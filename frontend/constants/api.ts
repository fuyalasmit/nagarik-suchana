/**
 * API Configuration
 *
 * Single source of truth for all API endpoints
 * Update EXPO_PUBLIC_API_BASE_URL in .env to change the base URL
 */

// Get base URL from environment or use default
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const API_CONFIG = {
    baseUrl: API_BASE_URL,

    // Auth endpoints
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
        profile: `${API_BASE_URL}/api/auth/profile`,
        pushToken: `${API_BASE_URL}/api/auth/push-token`,
    },

    // Admin endpoints
    admin: {
        notices: `${API_BASE_URL}/api/admin/notices`,
        upload: `${API_BASE_URL}/api/admin/notices`,
    },

    // User endpoints
    user: {
        grievances: `${API_BASE_URL}/api/grievances`,
    },

    // OCR endpoints
    ocr: {
        extractText: `${API_BASE_URL}/api/ocr/extract-text`,
        upload: `${API_BASE_URL}/api/ocr/upload`,
    },

    // LLM endpoints
    llm: {
        summarize: `${API_BASE_URL}/api/llm/summarize`,
        extractNotice: `${API_BASE_URL}/api/llm/extract-notice`,
    },
};

// Helper function to build URL with query params
export const buildUrl = (endpoint: string, params?: Record<string, string>) => {
    if (!params) return endpoint;

    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

    return `${endpoint}?${queryString}`;
};
