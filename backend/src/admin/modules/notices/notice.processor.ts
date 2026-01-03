import Tesseract from 'tesseract.js';
import { GoogleGenAI } from '@google/genai';
import { fromPath } from 'pdf2pic';
import prisma from '../../../user/config/database';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const MODEL = 'gemini-2.5-flash';
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

// Download file from URL to temp location
async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Clean up on error
      reject(err);
    });
  });
}

// Perform OCR on buffer (for direct file uploads)
export async function performOCRFromBuffer(
  buffer: Buffer, 
  mimetype: string
): Promise<{ ocrText: string; ocrConfidence: number }> {
  const tempFiles: string[] = [];
  const uploadDir = path.join(__dirname, 'temp');
  
  // Ensure temp directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  try {
    // Save buffer to temp file
    const tempFilePath = path.join(uploadDir, `temp-${Date.now()}${mimetype === 'application/pdf' ? '.pdf' : '.png'}`);
    fs.writeFileSync(tempFilePath, buffer);
    tempFiles.push(tempFilePath);
    
    const isPdf = mimetype === 'application/pdf';
    const lang = 'nep+eng'; // Both Nepali and English
    
    let fullText = '';
    let totalConfidence = 0;
    let pageCount = 0;
    
    if (isPdf) {
      console.log('Processing PDF for OCR...');
      
      const options = {
        density: 300,
        saveFilename: `pdf_page_${Date.now()}`,
        savePath: uploadDir,
        format: 'png' as const,
        width: 2000,
        height: 2800,
      };
      
      const convert = fromPath(tempFilePath, options);
      let pageNum = 1;
      let hasMorePages = true;
      
      while (hasMorePages) {
        try {
          const pageResult = await convert(pageNum, { responseType: 'image' });
          
          if (pageResult && pageResult.path) {
            tempFiles.push(pageResult.path);
            console.log(`OCR processing page ${pageNum}...`);
            
            const ocrResult = await Tesseract.recognize(pageResult.path, lang);
            fullText += `--- Page ${pageNum} ---\n${ocrResult.data.text}\n\n`;
            totalConfidence += ocrResult.data.confidence;
            pageCount++;
            pageNum++;
          } else {
            hasMorePages = false;
          }
        } catch (pageError) {
          hasMorePages = false;
        }
      }
      
      if (pageCount === 0) {
        throw new Error('Could not process any pages from PDF');
      }
    } else {
      // Process image directly
      console.log('Processing image for OCR...');
      const result = await Tesseract.recognize(tempFilePath, lang);
      fullText = result.data.text;
      totalConfidence = result.data.confidence;
      pageCount = 1;
    }
    
    // Clean up temp files
    for (const tempFile of tempFiles) {
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }
    
    return {
      ocrText: fullText.trim(),
      ocrConfidence: pageCount > 0 ? totalConfidence / pageCount : 0,
    };
  } catch (error) {
    // Clean up on error
    for (const tempFile of tempFiles) {
      try {
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    throw error;
  }
}

// Perform OCR on image or PDF from file path
async function performOCR(filePath: string): Promise<{ text: string; confidence: number }> {
  const tempFiles: string[] = [];
  
  try {
    const ext = path.extname(filePath).toLowerCase();
    const isPdf = ext === '.pdf';
    
    let fullText = '';
    let totalConfidence = 0;
    let pageCount = 0;

    if (isPdf) {
      console.log('Processing PDF for OCR...');
      const uploadDir = path.dirname(filePath);
      
      const options = {
        density: 300,
        saveFilename: `pdf_page_${Date.now()}`,
        savePath: uploadDir,
        format: 'png',
        width: 2000,
        height: 2800,
      };

      const convert = fromPath(filePath, options);
      let pageNum = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        try {
          const pageResult = await convert(pageNum, { responseType: 'image' });
          
          if (pageResult && pageResult.path) {
            tempFiles.push(pageResult.path);
            console.log(`OCR processing page ${pageNum}...`);

            const ocrResult = await Tesseract.recognize(pageResult.path, 'nep+eng');
            
            fullText += `--- Page ${pageNum} ---\n${ocrResult.data.text}\n\n`;
            totalConfidence += ocrResult.data.confidence;
            pageCount++;
            pageNum++;
          } else {
            hasMorePages = false;
          }
        } catch {
          hasMorePages = false;
        }
      }
      
      if (pageCount === 0) {
        throw new Error('Could not process any pages from PDF');
      }
    } else {
      // Process image directly
      console.log('Processing image for OCR...');
      const result = await Tesseract.recognize(filePath, 'nep+eng');
      fullText = result.data.text;
      totalConfidence = result.data.confidence;
      pageCount = 1;
    }

    // Clean up temp files
    for (const tempFile of tempFiles) {
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {}
    }

    return {
      text: fullText.trim(),
      confidence: pageCount > 0 ? totalConfidence / pageCount : 0,
    };
  } catch (error) {
    // Clean up on error
    for (const tempFile of tempFiles) {
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {}
    }
    throw error;
  }
}

// Extract structured fields using LLM
export async function extractFieldsWithLLM(text: string): Promise<any> {
  const gemini = getAI();
  
  const prompt = `You are an AI assistant that extracts structured information from government notices in Nepal.

Extract the following fields from the notice text below and return ONLY a valid JSON object:

{
  "notice_type": "Type of notice (string)",
  "notice_description": "Brief 2-3 sentence summary (string)",
  "service_sector": "Sector like 'Health', 'Education', etc. or empty string (string)",
  "service_group": "Service group if mentioned or empty string (string)",
  "position_title": "Job/position title or empty string (string)",
  "position_level": "Position level/grade or empty string (string)",
  "employment_type": "Type: 'Permanent', 'Contract', 'Temporary' or empty string (string)",
  "organization_type": "Type: 'Government', 'Private', 'NGO' or empty string (string)",
  "province": "Province name or empty string (string)",
  "district": "District name or empty string (string)",
  "municipality": "Municipality name or empty string (string)",
  "work_location_type": "Type: 'Urban', 'Rural', 'Remote' or empty string (string)",
  "min_education_level": "Minimum education or empty string (string)",
  "required_degree": "Specific degree required or empty string (string)",
  "required_field": "Field of study or empty string (string)",
  "requires_license": true or false (boolean),
  "min_experience_years": number or null,
  "required_current_level": "Current position level or empty string (string)",
  "required_service_years": number or null,
  "min_age": number or null,
  "max_age": number or null,
  "gender": "'Male', 'Female', 'Any' or empty string (string)",
  "deadline": "Deadline in YYYY-MM-DD format or empty string (string)",
  "contact_phone": "Contact phone or empty string (string)",
  "contact_email": "Contact email or empty string (string)"
}

RULES:
1. Return ONLY the JSON object, no markdown or extra text
2. Use null for missing numeric values, empty string "" for missing text
3. Extract dates in YYYY-MM-DD format
4. Be conservative - only extract explicitly stated information

Notice Text:
${text}
`;

  const response = await gemini.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const output = response.text;
  
  // Parse JSON response
  const jsonMatch = output?.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error('Failed to extract structured data from LLM response');
}

// Main processing function - runs asynchronously
export async function processNoticeFile(noticeId: string, fileUrl: string): Promise<void> {
  const tempFilePath = path.join('/tmp', `notice_${noticeId}_${Date.now()}${path.extname(fileUrl)}`);
  
  try {
    console.log(`[Notice ${noticeId}] Starting background processing...`);
    
    // Update status to processing
    await prisma.notice.update({
      where: { id: noticeId },
      data: { processingStatus: 'processing' },
    });

    // Download file from blob
    console.log(`[Notice ${noticeId}] Downloading file...`);
    await downloadFile(fileUrl, tempFilePath);

    // Perform OCR
    console.log(`[Notice ${noticeId}] Running OCR...`);
    const ocrResult = await performOCR(tempFilePath);
    
    // Extract structured fields using LLM
    console.log(`[Notice ${noticeId}] Extracting fields with LLM...`);
    const extractedFields = await extractFields(ocrResult.text);

    // Update notice with results
    await prisma.notice.update({
      where: { id: noticeId },
      data: {
        ocrText: ocrResult.text,
        ocrConfidence: ocrResult.confidence,
        extractedFields: extractedFields,
        processingStatus: 'completed',
      },
    });

    console.log(`[Notice ${noticeId}] Processing completed successfully!`);
  } catch (error) {
    console.error(`[Notice ${noticeId}] Processing failed:`, error);
    
    // Update status to failed
    await prisma.notice.update({
      where: { id: noticeId },
      data: { 
        processingStatus: 'failed',
        // Store error info in extractedFields for debugging
        extractedFields: { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        },
      },
    });
  } finally {
    // Clean up temp file
    try {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    } catch {}
  }
}
