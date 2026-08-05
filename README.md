# CareKart — B2B PPE E-commerce Platform

A full-stack B2B e-commerce app for PPE (personal protective equipment) supply — a
React/Vite customer storefront and staff (Admin/Employee) portals on the frontend,
backed by an Express + Prisma + MySQL API.

```
.
├── frontend/   React 18 + Vite + TypeScript + Tailwind v4 (customer + staff UI)
└── backend/    Express + Prisma + MySQL (REST API)
```

They are two independent apps — the frontend talks to the backend only over HTTP
(`VITE_API_BASE_URL`). Deploy, run, and scale them separately.

## Prerequisites

- Node.js 20+ (developed on v24)
- MySQL 8+ running locally (or a connection string to a hosted instance)
- npm

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
- `DATABASE_URL` — point at your local MySQL (`mysql://user:pass@localhost:3306/carekart`)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate real values, e.g.
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (run twice)
- Everything else has a working default for local dev — email falls back to
  logging instead of sending. Fill in `GOOGLE_CLIENT_ID`/`FACEBOOK_APP_*` (for
  customer OAuth sign-in), `R2_*` (for product image/video storage — required
  before any upload endpoint will work), `SMTP_*`, and `PHONEPE_*` only when
  you have real credentials for them.

Create the database schema and seed starter data:

```bash
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
```

Run the API:

```bash
npm run dev
```

The API listens on `http://localhost:4000` (`/api/v1/...`). The seed script prints
the bootstrap admin login (`admin@carekart.local` / `ChangeMe123!` by default —
**change this password after first login**).

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` just needs `VITE_API_BASE_URL` pointing at the backend
(`http://localhost:4000/api/v1` for local dev — already the default).

Run the app:

```bash
npm run dev
```

The storefront is at `http://localhost:5173`. The staff portal is unlinked from
customer nav — reach it directly at `http://localhost:5173/staff/login`.

## Everyday development

Once both are set up, day-to-day you only need:

```bash
cd backend && npm run dev    # terminal 1
cd frontend && npm run dev   # terminal 2
```

If you change `backend/prisma/schema.prisma`, create a migration and regenerate
the client:

```bash
cd backend
npx prisma migrate dev --name <describe_the_change>
npx prisma generate
```

## Production builds

```bash
cd backend && npm run build && npm start     # compiles to dist/, then runs it
cd frontend && npm run build                 # outputs static files to dist/
```

See [backend/DEPLOY.md](backend/DEPLOY.md) for the full production deploy checklist
(env vars, migrations, R2 setup).

## Useful scripts

| Location | Command | What it does |
|---|---|---|
| `backend/` | `npm run dev` | API with hot reload (tsx watch) |
| `backend/` | `npm run prisma:migrate` | Create + apply a new migration (dev) |
| `backend/` | `npm run prisma:seed` | Re-run seed (safe — only creates missing rows) |
| `frontend/` | `npm run dev` | Vite dev server with HMR |
| `frontend/` | `npm run build` | Production build to `frontend/dist/` |
