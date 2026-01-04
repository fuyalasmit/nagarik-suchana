# Requirements Document

## Introduction

This feature adds a "Recent Notices" section to the admin dashboard that displays notices uploaded through the admin upload page. When an admin creates a notice (with or without a document), it should appear on the dashboard, allowing admins to quickly see and manage recently created notices. This provides visibility into the notice pipeline and enables quick access to notice details.

## Requirements

### Requirement 1: Display Recent Notices on Dashboard

**User Story:** As an admin, I want to see recently uploaded notices on the dashboard, so that I can quickly review and track notices I've created.

#### Acceptance Criteria

1. WHEN the admin dashboard loads THEN the system SHALL display a "Recent Notices" section showing the most recent notices
2. WHEN notices exist in the system THEN the system SHALL display up to 5 notices in the Recent Notices section
3. WHEN a notice is displayed THEN the system SHALL show the notice title, status (draft/published/archived), and creation date
4. WHEN a notice has an attached document THEN the system SHALL display a document indicator icon
5. IF no notices exist THEN the system SHALL display an empty state message indicating no notices have been created

### Requirement 2: Fetch Notices from Backend API

**User Story:** As an admin, I want the dashboard to fetch real notice data from the backend, so that I see accurate and up-to-date information.

#### Acceptance Criteria

1. WHEN the dashboard mounts THEN the system SHALL fetch notices from the `/api/admin/notices` endpoint
2. WHEN the API request is in progress THEN the system SHALL display a loading indicator
3. IF the API request fails THEN the system SHALL display an error message with a retry option
4. WHEN new notices are created THEN the system SHALL refresh the notices list when returning to the dashboard

### Requirement 3: Notice Status Visualization

**User Story:** As an admin, I want to see the status of each notice at a glance, so that I can quickly identify which notices need attention.

#### Acceptance Criteria

1. WHEN a notice has status "draft" THEN the system SHALL display a yellow/amber status badge
2. WHEN a notice has status "published" THEN the system SHALL display a green status badge
3. WHEN a notice has status "archived" THEN the system SHALL display a gray status badge
4. WHEN a notice is displayed THEN the system SHALL show the relative time since creation (e.g., "2h ago", "3d ago")

### Requirement 4: Navigate to Notice Details

**User Story:** As an admin, I want to tap on a notice to view its details, so that I can review or edit the notice content.

#### Acceptance Criteria

1. WHEN the admin taps on a notice item THEN the system SHALL navigate to the notice detail/edit screen
2. WHEN navigating to notice details THEN the system SHALL pass the notice ID as a parameter
