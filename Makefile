# Start docker, run prisma migrations, then start backend & frontend
.PHONY: up-all
up-all:
	docker compose up -d
	cd backend && npm install
	cd backend && npx prisma migrate dev --name init
	cd backend && npm run dev & \
	cd frontend && npm run start
