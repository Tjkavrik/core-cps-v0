# Local Development — CORE CPS V0.1

**Status:** Living document. Full instructions to run the prototype on any
machine. The application is portable: clone → configure `.env` → provision
PostgreSQL → migrate → seed → run.

---

## 1. Prerequisites
- **Node.js 20+** and npm
- **Docker** + Docker Compose (recommended for PostgreSQL), OR a local
  **PostgreSQL 15+** instance
- **Git**
- `openssl` (to generate a secret)

## 2. Clone the Repository
```bash
git clone https://github.com/<org-or-user>/core-cps-v0.git
cd core-cps-v0
```

## 3. Environment Setup
Copy the example env and fill in values:
```bash
cp .env.example .env
```
Required and optional variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Session secret. Generate: `openssl rand -hex 32` |
| `NEXTAUTH_URL` | ✅ | App base URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_NAME` | optional | Display name (default: `CPS V0.1 (Prototype)`) |
| `NEXT_PUBLIC_APP_ENV` | optional | Environment label (default: `development`) |
| `FILE_UPLOAD_MAX_MB` | optional | Max upload size in MB (default: `25`) |
| `FILE_UPLOAD_DIR` | optional | Local upload directory (default: `./uploads`) |
| `FILE_UPLOAD_PROVIDER` | optional | `local` (default) \| `s3` \| `azure` (future) |
| `LOG_LEVEL` | optional | `info` (default) |
| `NODE_ENV` | optional | `development` (default) |

Reference values:
```
DATABASE_URL=postgresql://cps:cps_dev@localhost:5432/cps_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -hex 32>
NEXT_PUBLIC_APP_NAME="CPS V0.1 (Prototype)"
NEXT_PUBLIC_APP_ENV=development
FILE_UPLOAD_MAX_MB=25
FILE_UPLOAD_DIR=./uploads
NODE_ENV=development
```

## 4. Database Setup

**Option A — Docker Compose (recommended):**
```bash
docker-compose up -d postgres
```
This starts PostgreSQL 15 on `localhost:5432` with database `cps_dev`, user
`cps`, password `cps_dev_password` (matches `.env.example`).

**Option B — Manual PostgreSQL:**
```sql
CREATE DATABASE cps_dev;
CREATE USER cps WITH PASSWORD 'cps_dev_password';
GRANT ALL PRIVILEGES ON DATABASE cps_dev TO cps;
```
Then set `DATABASE_URL` accordingly.

## 5. Install Dependencies
From the repository root (npm workspaces installs the whole monorepo):
```bash
npm install
```

## 6. Run Migrations
```bash
make migrate
# or: cd packages/database && npx prisma migrate deploy
```
For iterative schema changes during development use:
```bash
cd packages/database && npx prisma migrate dev
```

## 7. Seed Data (fictional sample data)
```bash
make seed
# or: cd packages/database && npx ts-node seed/index.ts
```
> The seed loads **fictional** data only (no real CORE data).

## 8. Start the Development Server
```bash
make dev
# or: cd apps/web && npm run dev
```
Open http://localhost:3000. Health check: http://localhost:3000/api/health

## 9. Demo User Accounts and Roles
All demo users share the prototype password **`cps-demo-1234`** (local dev only):

| Email | Role |
|-------|------|
| `project.user@example.test` | Project User |
| `coordinator@example.test` | CPS Coordinator |
| `warehouse@example.test` | Warehouse / Logistics |
| `manager@example.test` | CPS Manager |
| `leadership@example.test` | Leadership |
| `admin@example.test` | System Administrator |

## 10. Common Makefile Commands
| Command | Action |
|---------|--------|
| `make dev` | Start the Next.js dev server |
| `make migrate` | Apply migrations (dev) |
| `make migrate-deploy` | Apply migrations (non-interactive) |
| `make seed` | Load fictional seed data |
| `make reset` | Reset the database (drops data) |
| `make studio` | Open Prisma Studio |
| `make test` | Run tests |
| `make build` | Production build |

## 11. Resetting the Database
```bash
make reset   # runs `prisma migrate reset --force` then re-applies migrations
make seed    # reload fictional data
```

## 12. Running Tests
```bash
make test
```
(A test harness is scaffolded; test suites are added alongside features.)

## 13. Docker Production Build
Build and run the standalone app image (portable, no proprietary deps):
```bash
docker build -f apps/web/Dockerfile -t core-cps-web .
docker run --env-file .env -p 3000:3000 core-cps-web
```
Or run the full dev stack (app + database) in containers:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## 14. Troubleshooting
- **`Environment variable not found: DATABASE_URL`** — ensure `.env` exists and is
  loaded; Prisma commands read `packages/database`'s environment.
- **Cannot connect to PostgreSQL** — confirm the container/instance is running and
  `DATABASE_URL` host/port/credentials match.
- **Prisma client out of date** — run `cd packages/database && npx prisma generate`.
- **Port 3000 in use** — set a different port: `PORT=3001 make dev`.
- **Migrations out of sync** — use `make reset` (development only; drops data).
