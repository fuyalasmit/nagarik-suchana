import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './user/modules/auth/auth.routes'
import path from "path";
import ocrRouter from "./ocr_backend/ocr";
import llmRouter from "./ocr_backend/llm";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve test frontend
app.use("/test", express.static(path.join(__dirname, "../../test_frontend")));

app.use('/api/auth',authRoutes)

app.get("/", (_req, res) => {
  res.send("server is running");
});

// OCR routes
app.use("/api/ocr", ocrRouter);

// LLM Preprocessing routes
app.use("/api/llm", llmRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
