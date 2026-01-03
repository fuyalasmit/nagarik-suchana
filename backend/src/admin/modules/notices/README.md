# Notice API Documentation

## Setup

1. Add your Vercel Blob token to `.env`:
```
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"
```

2. Get your Vercel Blob token from: https://vercel.com/dashboard/stores

## Endpoints

### 1. Upload File (PDF/Image)
Upload a file to Vercel Blob storage and get the URL.

```bash
POST /api/notices/upload
Content-Type: multipart/form-data
```

**Request:**
```bash
curl -X POST http://localhost:3001/api/notices/upload \
  -F "file=@/path/to/document.pdf"
```

**Response:**
```json
{
  "url": "https://blob.vercel-storage.com/..."
}
```

---

### 2. Create Notice
Create a new notice entry in the database.

```bash
POST /api/notices
Content-Type: application/json
```

**Request:**
```bash
curl -X POST http://localhost:3001/api/notices \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Road Construction Notice",
    "tags": ["infrastructure", "transport"],
    "description": "New road construction starting from March 2026",
    "effectiveFrom": "2026-03-01",
    "deadline": "2026-12-31",
    "url": "https://blob.vercel-storage.com/...",
    "province": "Bagmati",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan",
    "ward": "10",
    "contact": "+977-1-4200000",
    "ageGroup": "all",
    "gender": "all",
    "ethnicity": "all",
    "profession": "all",
    "qualification": "all",
    "status": "published"
  }'
```

**Response:**
```json
{
  "notice": {
    "id": "uuid",
    "title": "New Road Construction Notice",
    "tags": ["infrastructure", "transport"],
    "description": "...",
    "url": "https://blob.vercel-storage.com/...",
    "status": "published",
    "createdAt": "2026-01-03T...",
    "updatedAt": "2026-01-03T..."
  }
}
```

**Required Fields:**
- `title` (string)

**Optional Fields:**
- `tags` (string[])
- `description` (string)
- `effectiveFrom` (ISO date string)
- `deadline` (ISO date string)
- `url` (string - from upload endpoint)
- `province` (string)
- `district` (string)
- `municipality` (string)
- `ward` (string)
- `contact` (string)
- `ageGroup` (string)
- `gender` (string)
- `ethnicity` (string)
- `profession` (string)
- `qualification` (string)
- `status` (string: "draft" | "pending" | "published" | "archived", default: "draft")

---

### 3. Get All Notices
Get all notices with optional filters.

```bash
GET /api/notices
```

**Query Parameters (all optional):**
- `status` - Filter by status
- `province` - Filter by province
- `district` - Filter by district
- `municipality` - Filter by municipality
- `ward` - Filter by ward
- `tags` - Filter by tags (can be array)

**Examples:**
```bash
# Get all notices
curl http://localhost:3001/api/notices

# Get published notices only
curl http://localhost:3001/api/notices?status=published

# Get notices by location
curl http://localhost:3001/api/notices?province=Bagmati&district=Kathmandu

# Get notices by tags
curl http://localhost:3001/api/notices?tags=infrastructure&tags=transport
```

**Response:**
```json
{
  "notices": [
    {
      "id": "uuid",
      "title": "Notice Title",
      "tags": ["tag1", "tag2"],
      "description": "...",
      "url": "https://...",
      "status": "published",
      "createdAt": "2026-01-03T...",
      "updatedAt": "2026-01-03T..."
    }
  ]
}
```

---

### 4. Get Single Notice
Get a specific notice by ID.

```bash
GET /api/notices/:id
```

**Request:**
```bash
curl http://localhost:3001/api/notices/uuid-here
```

**Response:**
```json
{
  "notice": {
    "id": "uuid",
    "title": "Notice Title",
    "tags": ["tag1"],
    "description": "...",
    "effectiveFrom": "2026-03-01T...",
    "deadline": "2026-12-31T...",
    "url": "https://...",
    "province": "Bagmati",
    "district": "Kathmandu",
    "municipality": "Kathmandu Metropolitan",
    "ward": "10",
    "contact": "+977-1-4200000",
    "ageGroup": "all",
    "gender": "all",
    "ethnicity": "all",
    "profession": "all",
    "qualification": "all",
    "status": "published",
    "createdAt": "2026-01-03T...",
    "updatedAt": "2026-01-03T..."
  }
}
```

---

### 5. Update Notice
Update an existing notice.

```bash
PUT /api/notices/:id
Content-Type: application/json
```

**Request:**
```bash
curl -X PUT http://localhost:3001/api/notices/uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "published",
    "description": "Updated description"
  }'
```

**Response:**
```json
{
  "notice": {
    "id": "uuid",
    "title": "Updated Title",
    "status": "published",
    "description": "Updated description",
    "updatedAt": "2026-01-03T..."
  }
}
```

All fields are optional. Only provided fields will be updated.

---

### 6. Delete Notice
Delete a notice permanently.

```bash
DELETE /api/notices/:id
```

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/notices/uuid-here
```

**Response:**
```json
{
  "success": true
}
```

---

## Workflow Example

### Complete workflow to upload a PDF notice:

```bash
# Step 1: Upload the PDF file to get URL
curl -X POST http://localhost:3001/api/notices/upload \
  -F "file=@notice.pdf"
# Response: {"url": "https://blob.vercel-storage.com/xyz-abc123.pdf"}

# Step 2: Create notice with the URL
curl -X POST http://localhost:3001/api/notices \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Road Expansion Project",
    "tags": ["infrastructure"],
    "description": "Major road expansion in Ward 10",
    "url": "https://blob.vercel-storage.com/xyz-abc123.pdf",
    "province": "Bagmati",
    "district": "Kathmandu",
    "ward": "10",
    "status": "draft"
  }'

# Step 3: Update status to published when ready
curl -X PUT http://localhost:3001/api/notices/notice-id-here \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

Error format:
```json
{
  "error": "Error message here"
}
```

Validation error format:
```json
{
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```
