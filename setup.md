Initial Setup
==============
1. Initial docket setup [Keep this running in separate terminal]

docker compose down -v 

docker compose up

2. Backend Setup
================
cd backend
npm install
npx prisma db push
npm run dev 

3. Frontend Setup
=================
cd frontend
npm install
npm run start