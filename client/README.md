# KATHA Client

The React + Vite + Tailwind v4 web app for the KATHA heritage platform.

## Prerequisites

- Node 20+ and npm
- The API from `../server` running (default `http://localhost:5000`)

## Setup

```bash
npm install
```

Optionally copy the example environment file and set `VITE_API_URL`, but only if the API is not at `http://localhost:5000/api`:

```bash
cp .env.example .env
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server on port 5173 |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |
| `npm run check` | Plain-Node checks for the service modules (no test framework) |

## Important notes

- The dev server must run on port 5173 (`strictPort` is on). The server's CORS allow-list only permits `http://localhost:3000` and `http://localhost:5173`, so a different port would make every API call fail.
- If you change the server's `PORT`, set `VITE_API_URL` to match. On macOS, port 5000 is used by AirPlay Receiver, so choose another port and set both.

## Structure

- `src/components/{common,layout,pages}` - shared UI, the layout shell, and route pages
- `src/store` - Redux Toolkit auth slice
- `src/services` - axios client, token storage, and error messages
- `scripts/check-services.mjs` - plain-Node checks for the service modules
