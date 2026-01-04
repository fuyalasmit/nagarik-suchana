# Implementation Plan

- [x] 1. Add Notice type definitions
  - Add `NoticeStatus` type and `Notice` interface to `frontend/types/admin.ts`
  - Include all fields: id, title, tags, description, status, url, createdAt, updatedAt
  - _Requirements: 1.1, 2.1_

- [x] 2. Create useNotices hook
  - Create `frontend/hooks/useNotices.ts` with fetch logic
  - Implement loading, error, and data states
  - Add refetch function for manual refresh
  - Fetch from `API_CONFIG.admin.notices` endpoint
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Create NoticeCard component
  - Create `frontend/components/admin/NoticeCard.tsx`
  - Display notice title (truncated), relative timestamp, and status badge
  - Add document icon indicator when `url` exists
  - Implement status badge with color coding (draft=yellow, published=green, archived=gray)
  - Add onPress handler for navigation
  - _Requirements: 1.3, 1.4, 3.1, 3.2, 3.3, 3.4, 4.1_

- [x] 4. Add helper function for relative time
  - Add `getNoticeRelativeTime` helper to mock data or create utility
  - Reuse existing `getRelativeTime` function from `frontend/data/admin/mockData.ts`
  - _Requirements: 3.4_

- [x] 5. Integrate Recent Notices section into Dashboard
  - Import useNotices hook and NoticeCard component
  - Add "Recent Notices" section between Grievance Summary and Recent Activity
  - Implement loading state with spinner
  - Implement error state with retry button
  - Implement empty state with "Create Notice" button
  - Display up to 5 notices with "View All" link
  - Wire up navigation to notice details on card press
  - _Requirements: 1.1, 1.2, 1.5, 2.2, 2.3, 4.1, 4.2_
