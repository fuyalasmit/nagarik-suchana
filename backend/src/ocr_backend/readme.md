# OCR Backend

Document OCR (Optical Character Recognition) and LLM processing service for extracting and analyzing text from images and PDFs. Supports Nepali and English languages.

## Features

- **OCR Processing**: Extract text from images (JPEG, PNG, GIF, WebP) and multi-page PDFs
- **Multi-language Support**: Nepali (`nep`), English (`eng`), or both (`both`)
- **LLM Integration**: Summarize and analyze extracted text using Google Gemini AI
- **Structured Data Extraction**: Extract structured notice/document data for matchmaking

## Directory Structure

```
ocr_backend/
├── ocr.ts          # OCR routes for file upload and text extraction
├── llm.ts          # LLM routes for text summarization and preprocessing
├── uploads/        # Temporary file storage (auto-created)
└── readme.md
```

## Environment Variables

| Variable         | Description                   | Required |
| ---------------- | ----------------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key for LLM | Yes      |

## API Endpoints

### OCR Routes (`/api/ocr`)

#### Health Check

```
GET /api/ocr/health
```

**Response:**

```json
{
  "status": "OK",
  "message": "OCR API is running",
  "timestamp": "2026-01-03T12:00:00.000Z"
}
```

---

#### Upload File

```
POST /api/ocr/upload
```

Upload a file without OCR processing.

**Request:**

- Content-Type: `multipart/form-data`
- Field: `image` (file)

**Supported Formats:** JPEG, PNG, GIF, WebP, PDF

**Max File Size:** 20MB

**Response:**

```json
{
  "message": "Image uploaded successfully",
  "filename": "1704288000000-123456789.png",
  "path": "/uploads/1704288000000-123456789.png",
  "size": 102400
}
```

---

#### Extract Text (OCR)

```
POST /api/ocr/extract-text?lang=both
```

Upload a file and extract text using OCR.

**Request:**

- Content-Type: `multipart/form-data`
- Field: `image` (file)

**Query Parameters:**

| Parameter | Values               | Default | Description            |
| --------- | -------------------- | ------- | ---------------------- |
| `lang`    | `nep`, `eng`, `both` | `both`  | OCR language selection |

**Response:**

```json
{
  "success": true,
  "text": "Extracted text content...",
  "confidence": 87.5,
  "pages": 1,
  "filename": "1704288000000-123456789.png",
  "fileType": "Image"
}
```

**Response Fields:**

| Field        | Type    | Description                          |
| ------------ | ------- | ------------------------------------ |
| `success`    | boolean | Whether extraction was successful    |
| `text`       | string  | Extracted text content               |
| `confidence` | number  | OCR confidence score (0-100)         |
| `pages`      | number  | Number of pages processed (for PDFs) |
| `filename`   | string  | Stored filename                      |
| `fileType`   | string  | `"Image"` or `"PDF"`                 |

---

### LLM Routes (`/api/llm`)

#### Health Check

```
GET /api/llm/health
```

**Response:**

```json
{
  "status": "OK",
  "message": "LLM Preprocessing API is running",
  "hasApiKey": true,
  "timestamp": "2026-01-03T12:00:00.000Z"
}
```

---

#### Summarize Text

```
POST /api/llm/summarize
```

Summarize OCR-extracted text and highlight key information.

**Request:**

```json
{
  "text": "Extracted document text..."
}
```

**Response:**

```json
{
  "success": true,
  "originalText": "Extracted document text...",
  "summary": "AI-generated summary...",
  "model": "gemini-2.5-flash",
  "timestamp": "2026-01-03T12:00:00.000Z"
}
```

---

#### Preprocess Text

```
POST /api/llm/preprocess
```

Process text with a custom instruction/prompt.

**Request:**

```json
{
  "text": "Text to process...",
  "instruction": "Optional custom instruction"
}
```

**Response:**

```json
{
  "success": true,
  "originalText": "Text to process...",
  "instruction": "Custom instruction used",
  "output": "AI-generated output...",
  "model": "gemini-2.5-flash",
  "timestamp": "2026-01-03T12:00:00.000Z"
}
```

---

#### Extract Notice Data

```
POST /api/llm/extract-notice
```

Extract structured data from government notices for matchmaking.

**Request:**

```json
{
  "text": "Government notice text..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "notice_id": "NTC-1704288000000-abc123xyz",
    "notice_type": "Job Vacancy",
    "notice_description": "Brief summary...",
    "service_sector": "Health",
    "position_title": "Medical Officer",
    "position_level": "Officer Level",
    "employment_type": "Permanent",
    "organization_type": "Government",
    "province": "Bagmati",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan",
    "min_education_level": "Bachelor",
    "required_degree": "MBBS",
    "min_experience_years": 2,
    "min_age": 21,
    "max_age": 35,
    "deadline": "2026-02-15",
    "contact_phone": "01-4XXXXXX",
    "contact_email": "info@example.gov.np"
  },
  "model": "gemini-2.5-flash",
  "timestamp": "2026-01-03T12:00:00.000Z"
}
```

**Extracted Fields:**

| Field                      | Type           | Description                                |
| -------------------------- | -------------- | ------------------------------------------ |
| `notice_id`                | string         | Auto-generated unique ID                   |
| `notice_type`              | string         | Type of notice                             |
| `notice_description`       | string         | Brief summary                              |
| `service_sector`           | string         | Sector (Health, Education, etc.)           |
| `service_group`            | string         | Service group                              |
| `position_title`           | string         | Job/position title                         |
| `position_level`           | string         | Position level/grade                       |
| `employment_type`          | string         | Permanent, Contract, Temporary, Part-time  |
| `organization_type`        | string         | Government, Semi-Government, Private, etc. |
| `province`                 | string         | Province name/number                       |
| `district`                 | string         | District name                              |
| `municipality`             | string         | Municipality name                          |
| `work_location_type`       | string         | Urban, Rural, Remote                       |
| `min_education_level`      | string         | Minimum education required                 |
| `required_degree`          | string         | Specific degree required                   |
| `required_field`           | string         | Field of study                             |
| `requires_license`         | boolean        | Professional license required              |
| `min_experience_years`     | number \| null | Minimum years of experience                |
| `required_current_level`   | string         | Current position level to apply            |
| `required_service_years`   | number \| null | Years of service required                  |
| `min_age`                  | number \| null | Minimum age                                |
| `max_age`                  | number \| null | Maximum age                                |
| `gender`                   | string         | Male, Female, Any                          |
| `family_type`              | string         | Joint, Nuclear                             |
| `number_of_family_members` | number \| null | Required family members count              |
| `number_of_children`       | number \| null | Required number of children                |
| `number_of_elderly`        | number \| null | Required elderly in family                 |
| `deadline`                 | string         | Application deadline (YYYY-MM-DD)          |
| `contact_phone`            | string         | Contact phone number                       |
| `contact_email`            | string         | Contact email                              |
| `source_ward`              | string         | Ward number                                |

## Dependencies

| Package         | Purpose                        |
| --------------- | ------------------------------ |
| `tesseract.js`  | OCR engine for text extraction |
| `pdf2pic`       | PDF to image conversion        |
| `multer`        | File upload handling           |
| `@google/genai` | Google Gemini AI SDK           |

## Trained Data Files

OCR requires language-specific trained data files located in the backend root:

- `eng.traineddata` - English language data
- `nep.traineddata` - Nepali language data

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

**Common Error Codes:**

| Code | Description                      |
| ---- | -------------------------------- |
| 400  | Bad request / Invalid input      |
| 500  | Server error / Processing failed |
