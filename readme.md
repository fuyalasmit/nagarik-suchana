# Project Setup Guide

## Initial Setup

Start Docker containers:
```bash
docker compose down -v
docker compose up
```

Keep this terminal running.

## Backend Setup

In a new terminal:
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

## Frontend Setup

In another terminal:
```bash
cd frontend
npm install
npm run start
```