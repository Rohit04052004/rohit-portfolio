Rohit's portfolio site — a macOS-desktop-styled portfolio built with Next.js, Tailwind, and Prisma/Postgres.

**Live:** https://resume-rohit-nu.vercel.app

## Features

- Desktop-style UI ported from a macOS clone: menu bar, dock, Launchpad, Spotlight search, and Control Center.
- **Viewer** (default, no login): browse projects, resume, contact info, a live Bengaluru weather widget, a Spotify-style music player, and a tech stack widget.
- **Admin** (Rohit): logs in at `/admin/login` with the password in `ADMIN_PASSWORD`, then manages everything from `/admin` — profile/bio, projects, resume upload, contact links, Spotify tracks, and tech stack logos. Changes save to the database immediately and show up on the public site right away.
- Responsive mobile layout for the full desktop experience.

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
npx prisma migrate dev
npx prisma db seed     # adds mock content you can replace from /admin
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in as admin.

Generate a `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Prisma 7 (Postgres via Neon, `@prisma/adapter-neon`) · Vercel Blob for admin file uploads · `jose` for signed session cookies. Deployed on Vercel, connected to GitHub for automatic deploys on push to `main`.
