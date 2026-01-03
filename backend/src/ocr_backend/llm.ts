import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

// Free tier model
const MODEL = "gemini-2.5-flash";

// Lazy initialization of Gemini AI (to ensure env vars are loaded)
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "LLM Preprocessing API is running",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Summarize endpoint - takes OCR text and returns summarized version
router.post("/summarize", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Text is required in request body" });
    }

    const gemini = getAI();

    // Create prompt for summarization
    const prompt = `You are a helpful assistant that summarizes text extracted from documents.
    
The following text was extracted from a document using OCR (may contain Nepali and English text). 
Please summarize the key information from this document in a clear and concise manner.
If it appears to be an official document (like citizenship, license, etc.), extract and highlight the important fields.

OCR Extracted Text:
---
${text}
---

Please provide:
1. A brief summary of what this document is
2. Key information extracted (names, dates, numbers, addresses, etc.)
3. Any important details

Respond in the same language as the document (Nepali or English or both).`;

    // Generate response using new SDK
    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const summary = response.text;

    res.json({
      success: true,
      originalText: text,
      summary: summary,
      model: MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "LLM processing failed",
    });
  }
});

// Generic preprocess endpoint - can be customized with different prompts
router.post("/preprocess", async (req: Request, res: Response) => {
  try {
    const { text, instruction } = req.body;

    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Text is required in request body" });
    }

    const gemini = getAI();

    // Use custom instruction or default
    const defaultInstruction = "Analyze and summarize the following text:";
    const prompt = `${instruction || defaultInstruction}

Text:
---
${text}
---`;

    // Generate response using new SDK
    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const output = response.text;

    res.json({
      success: true,
      originalText: text,
      instruction: instruction || defaultInstruction,
      output: output,
      model: MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "LLM processing failed",
    });
  }
});

// Extract structured notice data for matchmaking
router.post("/extract-notice", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .json({ error: "Text is required in request body" });
    }

    const gemini = getAI();

    // Generate unique notice ID
    const noticeId = `NTC-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create prompt for structured extraction
    const prompt = `You are an AI assistant that extracts structured information from government notices in Nepal.

Extract the following fields from the notice text below and return ONLY a valid JSON object with these exact keys:

{
  "notice_id": "${noticeId}",
  "notice_type": "Type of notice: 'Job Vacancy', 'Tax Notice', 'Road Repair', 'Water Supply', 'Public Hearing', 'License Renewal', 'Social Welfare', 'Scholarship', 'Training', 'Other' (string)",
  "notice_description": "Brief 2-3 sentence summary of the notice in the same language as the document (string)",
  "service_sector": "Sector like 'Health', 'Education', 'Agriculture', 'Administration', 'Engineering', 'Finance', 'Social Welfare', 'Other' or empty string (string)",
  "service_group": "Service group if mentioned (e.g., 'Technical', 'Administrative', 'Medical') or empty string (string)",
  "position_title": "Job/position title if mentioned, otherwise empty string (string)",
  "position_level": "Position level/grade if mentioned (e.g., 'Officer Level', 'Assistant Level', '4th Level') or empty string (string)",
  "employment_type": "Type: 'Permanent', 'Contract', 'Temporary', 'Part-time' or empty string (string)",
  "organization_type": "Type: 'Government', 'Semi-Government', 'Private', 'NGO', 'INGO' or empty string (string)",
  "province": "Province name or number if mentioned, otherwise empty string (string)",
  "district": "District name if mentioned, otherwise empty string (string)",
  "municipality": "Municipality/Rural Municipality/Metropolitan name if mentioned, otherwise empty string (string)",
  "work_location_type": "Type: 'Urban', 'Rural', 'Remote' or empty string (string)",
  "min_education_level": "Minimum education: 'SLC/SEE', '+2/Intermediate', 'Bachelor', 'Master', 'PhD' or empty string (string)",
  "required_degree": "Specific degree required (e.g., 'MBBS', 'BE Civil', 'BBA') or empty string (string)",
  "required_field": "Field of study required (e.g., 'Engineering', 'Medicine', 'Management') or empty string (string)",
  "requires_license": "true if professional license is required, false otherwise (boolean)",
  "min_experience_years": "Minimum years of experience required, otherwise null (number or null)",
  "required_current_level": "Current position level required to apply or empty string (string)",
  "required_service_years": "Years of service required, otherwise null (number or null)",
  "min_age": "Minimum age requirement, otherwise null (number or null)",
  "max_age": "Maximum age requirement, otherwise null (number or null)",
  "gender": "Required gender: 'Male', 'Female', 'Any' or empty string (string)",
  "family_type": "Family type requirement if mentioned (e.g., 'Joint', 'Nuclear') or empty string (string)",
  "number_of_family_members": "Required family members count, otherwise null (number or null)",
  "number_of_children": "Required number of children, otherwise null (number or null)",
  "number_of_elderly": "Required number of elderly in family, otherwise null (number or null)",
  "deadline": "Application deadline in YYYY-MM-DD format if mentioned, otherwise empty string (string)",
  "contact_phone": "Contact phone number if mentioned, otherwise empty string (string)",
  "contact_email": "Contact email if mentioned, otherwise empty string (string)",
  "source_ward": "Ward number if mentioned, otherwise empty string (string)"
}

IMPORTANT RULES:
1. Return ONLY the JSON object, no additional text or markdown formatting
2. Do not include \`\`\`json or any code fences
3. Use null for missing numeric values, empty string "" for missing text values
4. Extract dates in YYYY-MM-DD format (convert Nepali dates like 2081-03-15 BS to the same format)
5. If age range is mentioned like "18-35 years", extract as min_age: 18, max_age: 35
6. Be conservative - only extract information explicitly stated in the text
7. The notice_id is already provided, keep it as is
8. For Nepali text, keep the description in Nepali

Notice Text:
${text}
`;

    // Generate response using Gemini
    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const output = response.text;

    // Try to parse the JSON response
    let extractedData;
    try {
      // Clean the response in case there's any extra text
      const jsonMatch = output?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return res.status(500).json({
        error: "Failed to parse extracted data",
        rawOutput: output,
      });
    }

    res.json({
      success: true,
      data: extractedData,
      model: MODEL,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "LLM processing failed",
    });
  }
});

export default router;
