# Nagarik Suchana

**Nagarik Suchana** is a mobile app that connects citizens with local authorities, streamlining information flow and civic engagement. Citizens receive instant notifications about notices, vacancies, meetings, and health camps. They can file complaints about roads, water, and electricity, view budget allocations, track progress, and directly contact authorities, bringing transparency and efficiency to local governance.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js (v16 or higher)

### Setup

1. **Start Docker containers:**

   ```bash
   docker compose up
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run start
   ```
   
## Database Schema
<img width="6994" height="6327" alt="Untitled diagram-2026-01-04-145323" src="https://github.com/user-attachments/assets/ee191dc7-6e14-4752-9305-ae61d0aac628" />


## System Architecture
<img width="9540" height="12025" alt="Untitled diagram-2026-01-04-145414" src="https://github.com/user-attachments/assets/d20c5a72-a02b-45d7-9520-93cd0d730d19" />

## Features

- User authentication and profiles
- Notice management system
- OCR document processing
- Grievance management
- Admin dashboard
- Multilingual support (English/Nepali)

## Tech Stack

- **Frontend:** React Native (Expo), TypeScript, Tailwind CSS
- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL with Prisma ORM
- **OCR:** Tesseract.js
- **Containerization:** Docker
