# Installation Guide

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (uses `package-lock.json`)

## Steps

### 1. Install dependencies

```bash
npm install
```

### 2. Build the production bundle

```bash
npm run build
```

This runs TypeScript compilation (`tsc -b`) followed by Vite's production bundler. Fix any errors before proceeding.

### 3. Run in development mode

```bash
npm run dev
```

The dev server starts on `http://localhost:5173` and binds to `0.0.0.0` for network access.

### 4. Preview the production build

```bash
npm run preview
```

The preview server starts on `http://localhost:4173`.

## Seed Data

Seed data is generated automatically on first load when the IndexedDB database is empty. No manual seed step is required. The database is created in the browser's IndexedDB storage under the name `KanbanBoardDB`.

## Deployment (Vercel)

1. Push the repository to GitHub/GitLab.
2. Import the project in Vercel.
3. Vercel auto-detects Vite and uses the correct build settings.
4. The `public/_redirects` file ensures SPA fallback (no 404 on refresh).
