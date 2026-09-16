.PHONY: dev migrate seed reset test build

dev:
	cd apps/web && npm run dev

migrate:
	cd packages/database && npx prisma migrate dev

migrate-deploy:
	cd packages/database && npx prisma migrate deploy

seed:
	cd packages/database && npx ts-node seed/index.ts

reset:
	cd packages/database && npx prisma migrate reset --force

studio:
	cd packages/database && npx prisma studio

test:
	cd apps/web && npm test

build:
	cd apps/web && npm run build
