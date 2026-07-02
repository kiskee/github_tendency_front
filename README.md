# GitHub Tendency — Frontend

Real-time GitHub repository trends dashboard. Track stars, forks, languages, and keywords across trending open-source repos.

## Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 6 |
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| Data fetching | @tanstack/react-query v5 |
| Charts | recharts v3 |
| SEO | react-helmet-async v3 |

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server (Vite proxy `/api` → backend) |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Architecture

```
src/
├── api/          HTTP client + endpoint functions
│   ├── client.ts   Generic fetch wrapper
│   ├── health.ts   GET /health
│   ├── search.ts   GET /search/:keyword
│   └── trends.ts   GET /trends, /trends/stats, /trends/report
├── pages/        Route components
│   ├── Dashboard.tsx  Stats cards, charts, top repos
│   ├── Search.tsx     Keyword search + results
│   └── Trends.tsx     Trend cards with repos
├── components/   Reusable UI
│   ├── CountUp.tsx        Animated number counter
│   ├── Footer.tsx         Site footer with nav links
│   ├── ReportSidebar.tsx  Report panel (polls every 2min)
│   └── Skeleton.tsx       Loading skeletons (3 variants)
├── App.tsx       Root layout: nav, health indicator, routes
├── main.tsx      Entry point: HelmetProvider → BrowserRouter → QueryClientProvider
└── index.css     Tailwind import + custom animations
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Dashboard | Stats overview, charts, top repositories |
| `/search` | Search | Search repos by keyword |
| `/trends` | Trends | Browse tracked trend keywords |

## Environment

Copy `.env.example` or create `.env`:

```env
VITE_API_BASE_URL=https://your-backend.com
VITE_API_KEY=your_api_key_here
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API base URL (dev proxy target) |
| `VITE_API_KEY` | Yes | API key sent as `x-api-key` header |

## Deploy (Vercel)

The project includes a Vercel Edge middleware (`middleware.ts`) that proxies `/api/*` requests to the backend.

Set the following environment variables in Vercel:

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Backend API URL |
| `API_KEY` | Backend API key |

`vercel.json` is configured with SPA fallback routing and `/api` passthrough.

## Development

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `VITE_API_BASE_URL`, adding the `x-api-key` header automatically.

## Build

```bash
npm run build
```

Output goes to `dist/`. Type-checking runs before bundling.


