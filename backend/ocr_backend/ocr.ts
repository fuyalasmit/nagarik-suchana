import express, { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";

const router = Router();

// Configure uploads directory - inside ocr_backend folder
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("Upload directory configured at:", uploadDir);

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "OCR API is running",
    timestamp: new Date().toISOString(),
  });
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept image files and PDFs
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files (JPEG, PNG, GIF, WebP) and PDFs are allowed"
        )
      );
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size for PDFs
  },
});

// Test upload endpoint - just receives and stores the file
router.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      res.json({
        message: "Image uploaded successfully",
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }
);

// OCR endpoint - performs OCR on uploaded image or PDF
router.post(
  "/extract-text",
  upload.single("image"),
  async (req: Request, res: Response) => {
    const tempFiles: string[] = []; // Track temp files for cleanup

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const filePath = req.file.path;
      tempFiles.push(filePath);

      // Get language from query param, default to both Nepali and English
      // Options: "nep" for Nepali only, "eng" for English only, "both" for nep+eng
      let lang = (req.query.lang as string) || "both";

      // Handle language options
      if (lang === "both") {
        lang = "nep+eng";
      }

      let fullText = "";
      let totalConfidence = 0;
      let pageCount = 0;

      // Check if it's a PDF
      if (req.file.mimetype === "application/pdf") {
        console.log("Processing PDF file...");

        // Convert PDF pages to images
        const options = {
          density: 300, // DPI for quality
          saveFilename: `pdf_page_${Date.now()}`,
          savePath: uploadDir,
          format: "png",
          width: 2000,
          height: 2800,
        };

        const convert = fromPath(filePath, options);

        // Get total pages (convert first to check)
        // Process pages one by one
        let pageNum = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          try {
            const pageResult = await convert(pageNum, {
              responseType: "image",
            });

            if (pageResult && pageResult.path) {
              tempFiles.push(pageResult.path);
              console.log(`Processing page ${pageNum}...`);

              // Run OCR on this page
              const ocrResult = await Tesseract.recognize(
                pageResult.path,
                lang,
                {
                  logger: (m) => console.log(`Page ${pageNum} OCR:`, m.status),
                }
              );

              fullText += `--- Page ${pageNum} ---\n${ocrResult.data.text}\n\n`;
              totalConfidence += ocrResult.data.confidence;
              pageCount++;
              pageNum++;
            } else {
              hasMorePages = false;
            }
          } catch (pageError) {
            // No more pages or error
            hasMorePages = false;
          }
        }

        if (pageCount === 0) {
          throw new Error("Could not process any pages from the PDF");
        }
      } else {
        // It's an image - process directly
        console.log("Processing image file...");
        const result = await Tesseract.recognize(filePath, lang, {
          logger: (m) => console.log("OCR Progress:", m),
        });

        fullText = result.data.text;
        totalConfidence = result.data.confidence;
        pageCount = 1;
      }

      // Clean up all temp files
      for (const tempFile of tempFiles) {
        try {
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      res.json({
        success: true,
        text: fullText.trim(),
        confidence: pageCount > 0 ? totalConfidence / pageCount : 0,
        pages: pageCount,
        filename: req.file.filename,
        fileType: req.file.mimetype === "application/pdf" ? "PDF" : "Image",
      });
    } catch (error) {
      // Clean up temp files on error
      for (const tempFile of tempFiles) {
        try {
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      res.status(500).json({
        error: error instanceof Error ? error.message : "OCR processing failed",
      });
    }
  }
);

// Error handling middleware for multer errors
router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default router;
