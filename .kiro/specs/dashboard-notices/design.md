# Design Document: Dashboard Notices Feature

## Overview

This feature adds a "Recent Notices" section to the admin dashboard (`frontend/app/admin/dashboard.tsx`) that fetches and displays notices from the backend API. The implementation follows existing patterns in the codebase, using gluestack-ui components and the established color scheme.

## Architecture

```mermaid
flowchart TB
    subgraph Frontend
        Dashboard[Dashboard Screen]
        NoticeCard[NoticeCard Component]
        useNotices[useNotices Hook]
    end
    
    subgraph Backend
        API[/api/admin/notices]
        DB[(PostgreSQL)]
    end
    
    Dashboard --> useNotices
    useNotices --> API
    API --> DB
    Dashboard --> NoticeCard
```

The feature follows a simple architecture:
1. A custom hook (`useNotices`) handles data fetching and state management
2. A reusable `NoticeCard` component displays individual notices
3. The dashboard integrates the hook and renders the notices section

## Components and Interfaces

### 1. Notice Type Definition

Add to `frontend/types/admin.ts`:

```typescript
export type NoticeStatus = 'draft' | 'published' | 'archived';

export interface Notice {
  id: string;
  title: string;
  tags: string[];
  description?: string;
  status: NoticeStatus;
  url?: string;  // Document URL if uploaded
  createdAt: string;
  updatedAt: string;
}
```

### 2. useNotices Hook

Location: `frontend/hooks/useNotices.ts`

```typescript
interface UseNoticesReturn {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

Responsibilities:
- Fetch notices from `/api/admin/notices` on mount
- Manage loading and error states
- Provide refetch capability for manual refresh

### 3. NoticeCard Component

Location: `frontend/components/admin/NoticeCard.tsx`

Props:
```typescript
interface NoticeCardProps {
  notice: Notice;
  onPress: (id: string) => void;
}
```

Visual Design:
- Card with white background, rounded corners (12px)
- Left section: Title (bold, truncated), relative timestamp
- Right section: Status badge with color coding
- Document icon indicator if `url` exists
- Subtle border and shadow for depth

### 4. Dashboard Integration

The Recent Notices section will be added between "Grievance Summary" and "Recent Activity" sections in the dashboard.

## Data Models

### Notice (from Prisma schema)

| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID primary key |
| title | string | Notice title |
| tags | string[] | Array of tag strings |
| description | string? | Optional description |
| status | string | draft, published, archived |
| url | string? | Document URL if uploaded |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### API Response

```typescript
// GET /api/admin/notices
{
  notices: Notice[];
  total: number;
}
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| Network error | Display error message with retry button |
| Empty response | Show "No notices yet" empty state |
| API timeout | Show timeout message, allow retry |
| Invalid data | Log error, show generic error message |

## UI States

### Loading State
- Show a spinner centered in the notices section
- Maintain section header visibility

### Error State
- Display error message in red/pink background
- Show "Retry" button to refetch

### Empty State
- Display friendly message: "No notices created yet"
- Show "Create Notice" button linking to upload page

### Success State
- Display up to 5 notice cards
- Show "View All" link in section header

## Status Badge Colors

Following the existing `AdminColors` palette:

| Status | Background | Text Color |
|--------|------------|------------|
| draft | #FCD34D (yellow) | #92400E |
| published | #59AC77 (green) | #FFFFFF |
| archived | #9CA3AF (gray) | #FFFFFF |

## Testing Strategy

### Unit Tests
1. `useNotices` hook - test fetch, loading, error states
2. `NoticeCard` component - test rendering with different props
3. Status badge color mapping

### Integration Tests
1. Dashboard renders notices section
2. Notices fetch on mount
3. Error state displays correctly
4. Empty state displays correctly

### Manual Testing
1. Create notice without document → appears on dashboard
2. Create notice with document → shows document icon
3. Network offline → error state with retry
4. Multiple notices → only 5 shown with "View All"
