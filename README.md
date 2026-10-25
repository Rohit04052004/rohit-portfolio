Rohit's portfolio site — a macOS-desktop-styled portfolio built with Next.js, Tailwind, and Prisma/SQLite.

## Roles

- **Viewer** (default, no login): can browse projects, resume, and contact info.
- **Admin** (Rohit): logs in at `/admin/login` with the password in `ADMIN_PASSWORD`, then manages everything from `/admin` — projects, profile/bio, resume upload, and contact links. Changes save to the database immediately and show up on the public site right away.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in ADMIN_PASSWORD and SESSION_SECRET
npx prisma migrate dev
npx prisma db seed     # adds mock content you can replace from /admin
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in as admin.

Generate a `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Known limitation: file uploads in production

Admin-uploaded images/resume PDFs are written to `public/uploads` on disk. That works locally, but **will not persist** on serverless hosts like Vercel (the filesystem is ephemeral/read-only at runtime). Before deploying there, swap the upload route (`src/app/api/upload/route.ts`) to use object storage (e.g. Vercel Blob or S3).

Similarly, the SQLite database file (`prisma/dev.db`) is local-only — for a persistent production database, point `DATABASE_URL` at a hosted SQLite-compatible service (e.g. Turso/libSQL) instead.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 (SQLite via `better-sqlite3` driver adapter) · `jose` for signed session cookies.
