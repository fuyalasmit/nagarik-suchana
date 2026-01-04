# API Configuration Guide

## Overview

All API endpoints are now centralized in a single configuration file for easy management and environment switching.

## Configuration File

**Location:** `/frontend/constants/api.ts`

This file exports:

-   `API_CONFIG`: Object containing all API endpoints
-   `buildUrl()`: Helper function for building URLs with query parameters

## Environment Variables

**File:** `/frontend/.env`

```env
# API Base URL - Change this to switch environments
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001

# Admin Credentials
EXPO_PUBLIC_ADMIN_EMAIL=admin@admin.com
EXPO_PUBLIC_ADMIN_PASSWORD=admin123
```

## Usage

### Import the config

```typescript
import { API_CONFIG } from "@/constants/api";
```

### Use endpoints

```typescript
// Auth endpoints
fetch(API_CONFIG.auth.login, {
    /* ... */
});
fetch(API_CONFIG.auth.register, {
    /* ... */
});

// Admin endpoints
fetch(API_CONFIG.admin.notices, {
    /* ... */
});
fetch(API_CONFIG.admin.upload, {
    /* ... */
});

// User endpoints
fetch(API_CONFIG.user.grievances, {
    /* ... */
});

// OCR endpoints
fetch(API_CONFIG.ocr.extractText, {
    /* ... */
});

// LLM endpoints
fetch(API_CONFIG.llm.summarize, {
    /* ... */
});
```

### Build URLs with query params

```typescript
import { buildUrl } from "@/constants/api";

const url = buildUrl(API_CONFIG.ocr.extractText, {
    lang: "nep",
    format: "json",
});
// Result: http://localhost:3001/api/ocr/extract-text?lang=nep&format=json
```

## Switching Environments

### Development (localhost)

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Production

```env
EXPO_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### Staging

```env
EXPO_PUBLIC_API_BASE_URL=https://staging-api.yourdomain.com
```

## Files Updated

The following files now use the centralized API config:

-   ✅ `/app/user/grievances.tsx`
-   ✅ `/app/login.tsx`
-   ✅ `/app/register.tsx`
-   ✅ `/app/admin/upload.tsx`

## Benefits

1. **Single Source of Truth**: All endpoints in one place
2. **Environment Switching**: Change `.env` to switch between dev/staging/prod
3. **Type Safety**: TypeScript autocomplete for all endpoints
4. **Maintainability**: Update endpoint once, applies everywhere
5. **No Hardcoding**: No more `http://localhost:3001` scattered in code

## Adding New Endpoints

Edit `/frontend/constants/api.ts`:

```typescript
export const API_CONFIG = {
    // ... existing endpoints

    // Add new section
    newFeature: {
        endpoint1: `${API_BASE_URL}/api/new-feature/endpoint1`,
        endpoint2: `${API_BASE_URL}/api/new-feature/endpoint2`,
    },
};
```

Then use it:

```typescript
fetch(API_CONFIG.newFeature.endpoint1, {
    /* ... */
});
```
