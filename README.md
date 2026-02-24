# Portfolio Pro (Next.js + Prisma + PostgreSQL)

Production-ready personal portfolio with:
- Public site (`/`, `/about`, `/projects`, `/research`, `/certificates`, `/skills`, `/activity`, `/documents`, `/contact`)
- Admin dashboard (`/admin/*`) with secured CRUD
- File uploads (local + S3-compatible)
- CV download + analytics
- GitHub repos/commits integration
- AI chatbot for profile Q&A

## Architecture Overview

- Frontend: Next.js App Router + TypeScript + TailwindCSS + shadcn-style UI components
- Backend: Next.js Route Handlers (API routes) for CRUD and platform endpoints
- ORM: Prisma
- DB: PostgreSQL
- Auth: NextAuth credentials with role check (`ADMIN`) and middleware guard
- Storage: Local dev (`public/uploads`) or S3-compatible object storage
- SEO: metadata, OpenGraph image routes, sitemap, robots

Why API routes (chosen over server actions):
- Better fit for reusable CRUD endpoints, analytics tracking, file upload, and external integrations.

## Folder Structure

```txt
app/
  api/
    auth/[...nextauth]/route.ts
    profile/route.ts
    social-links/route.ts
    projects/route.ts
    projects/[id]/route.ts
    papers/route.ts
    papers/[id]/route.ts
    certificates/route.ts
    certificates/[id]/route.ts
    skills/route.ts
    skills/[id]/route.ts
    posts/route.ts
    posts/[id]/route.ts
    documents/route.ts
    documents/[id]/route.ts
    cv/route.ts
    cv/[id]/route.ts
    upload/route.ts
    contact/route.ts
    track/route.ts
    github/route.ts
    chat/route.ts
    download/cv/route.ts
    download/document/[id]/route.ts
  admin/
    layout.tsx
    page.tsx
    profile/page.tsx
    projects/page.tsx
    research/page.tsx
    certificates/page.tsx
    skills/page.tsx
    activity/page.tsx
    documents/page.tsx
    cv/page.tsx
    settings/page.tsx
  activity/[slug]/page.tsx
  activity/[slug]/opengraph-image.tsx
  about/page.tsx
  projects/page.tsx
  research/page.tsx
  certificates/page.tsx
  skills/page.tsx
  documents/page.tsx
  contact/page.tsx
  login/page.tsx
  layout.tsx
  page.tsx
  sitemap.ts
  robots.ts
  og/route.tsx
components/
  admin/
  public/
  ui/
lib/
  auth.ts
  db.ts
  storage.ts
  validations.ts
  github.ts
  query.ts
  api.ts
prisma/
  schema.prisma
  seed.ts
middleware.ts
.env.example
```

## Prisma Schema

Complete schema is in `prisma/schema.prisma` and includes:
- `User` (admin)
- `Profile`
- `SocialLinks`
- `Skill`
- `Project`
- `Paper`
- `Certificate`
- `Post`
- `Document`
- `CV`
- `AnalyticsEvent`

Enums:
- `Role`
- `PublishStatus`
- `Visibility`
- `AnalyticsEventType`

## Setup

1. Install dependencies
```bash
npm install
```

2. Configure env
```bash
cp .env.example .env
```

3. Generate client + run migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed admin and sample content
```bash
npm run prisma:seed
```

5. Start dev server
```bash
npm run dev
```

Default seeded admin (change in `.env`):
- email: `admin@example.com`
- password: `admin123456`

## Migration Instructions

Development:
```bash
npx prisma migrate dev --name <change_name>
```

Production deploy:
```bash
npx prisma migrate deploy
```

## Deployment (Vercel + Neon/Supabase)

1. Create managed PostgreSQL database (Neon or Supabase)
2. Set `DATABASE_URL` in Vercel project env vars
3. Set auth/env vars:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_APP_URL`
4. Optional object storage envs for S3/R2 and set `STORAGE_PROVIDER=s3`
5. Build command:
```bash
npm run build
```
6. Run migrations in CI/release step:
```bash
npx prisma migrate deploy
```

## Security Notes

- Zod validation on API inputs
- File MIME allow-list for uploads (PDF/PNG/JPEG/WebP)
- Rate limiting on contact endpoint
- Admin-only mutation routes with role checks
- Admin middleware protection on `/admin/*`

## Features Checklist

- Public pages with SEO and responsive layout
- Admin CRUD for profile/content/docs/CV
- Draft/publish support on projects, papers, posts, documents
- Search/sort/pagination in admin manager
- Download tracking and page-view analytics
- GitHub repo + commit feed with cache
- AI chatbot endpoint responding about portfolio owner

## RAG Chatbot Setup (pgvector)

1. Enable pgvector extension in Postgres:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

2. Run migration and generate Prisma client:
```bash
npx prisma migrate dev --name add_knowledge_rag
npx prisma generate
```

3. Set OpenAI env vars in `.env`:
- `OPENAI_API_KEY`
- `OPENAI_EMBED_MODEL` (default `text-embedding-3-small`)
- `OPENAI_CHAT_MODEL` (default `gpt-4o-mini`)

4. Re-index knowledge from `/admin/settings` using **Re-index knowledge** button.

RAG behavior:
- Sources: Profile, Projects, Papers, Certificates, Posts, and only PUBLIC Documents.
- Retrieval: cosine similarity (`top 6`) from pgvector.
- Chat replies include citations and return `I don't know.` when context is missing.
