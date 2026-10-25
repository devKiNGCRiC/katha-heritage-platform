# Frontend Foundation + Auth UI — Design

**Date:** 2026-09-26
**Status:** Approved (user delegated stack/dependency decisions: "use the best thing… install or upgrade to the latest")
**Scope:** Second slice for KATHA — a real React app shell (design system, routing, state, first pages) wired to the auth API built in slice 1.

## Context

The client (`client/`) is a Vite + React 19 app that is still the default counter demo re-skinned (`App.jsx`). One real component exists (`components/common/Button.jsx`); `components/layout/` and `components/pages/` are empty. Redux Toolkit, React Router, React Hook Form and Axios are installed but unused. The backend (`server/`) exposes `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (JWT Bearer).

**Known defect being fixed:** Tailwind v4 is installed (`@tailwindcss/vite`) but `src/index.css` uses v3 `@tailwind base/components/utilities` directives and `tailwind.config.js` is a v3 config that v4 does not load automatically. Custom `katha-*` colors therefore never applied.

## Decisions

- **Dependencies:** upgrade every client dependency to its latest release, including majors (Vite 8 + `@vitejs/plugin-react` 6, ESLint 10 + `@eslint/js` 10, `eslint-plugin-react-hooks` 7, `eslint-plugin-react-refresh`, `globals` 17, React 19.3, Tailwind 4.3, Redux Toolkit 2.12, React Router 7.18, Axios 1.20, React Hook Form 7.89). If a major upgrade breaks build or lint and cannot be fixed with a small config change, pin that package (and its coupled peers) to the highest working version and record it in the plan ledger.
- **Remove unused packages:** `@tailwindcss/postcss`, `postcss`, `autoprefixer` and `postcss.config.js` (Tailwind v4's Vite plugin replaces them).
- **Styling:** Tailwind v4 CSS-first config. `src/index.css` becomes `@import "tailwindcss";` plus an `@theme` block for brand tokens. `tailwind.config.js` is deleted.
- **Design tokens** (from `docs/brand-guidelines.md`): saffron `#FF6B35`, deep blue `#004E89`, gold `#FFD700`, cream `#FFF8E7`, charcoal `#2D3436`, soft green `#00B894`; fonts Inter (body) and Playfair Display (headings/decorative), loaded from Google Fonts via `<link>` in `index.html` (not a CSS `@import`).
- **Routing:** `react-router-dom` `BrowserRouter`: `/` Home, `/login`, `/register`, `*` NotFound. All routes render inside a shared `Layout` (Header + Outlet + Footer).
- **State:** Redux Toolkit store with one `auth` slice: `{ user, token, status: 'idle'|'loading'|'succeeded'|'failed', error }`. Async thunks `registerUser`, `loginUser`, `fetchCurrentUser`; reducer `logout`.
- **Token persistence:** `localStorage` key `katha_token`. Read at store creation; written on login/register success; removed on logout or a 401 from `/auth/me`. All `localStorage` access is wrapped in try/catch.
- **API client:** `src/services/api.js` — axios instance, `baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`, request interceptor attaching `Authorization: Bearer <token>` when a token exists. `client/.env.example` documents `VITE_API_URL`.
- **Session restore:** at startup (in `main.jsx`, before first render), if a token exists, dispatch `fetchCurrentUser`; `auth.initializing` gates the first render. The token is cleared only on a 401 — a network failure or 5xx keeps it so a later reload can recover.
- **Refinements made while planning** (see the plan's Rulings): the brand mark is an inline SVG `Logo` (the files in `public/` are 745–929 KB and have a baked-in grey square); primary button text is near-black for WCAG contrast; double-submit is blocked in the store; `npm run check` runs a tiny plain-Node assert script over the pure service modules (no test framework).
- **Forms:** react-hook-form. Register: `name` required ≤100 chars, `email` valid, `password` ≥6 chars, confirm-password must match (client-side only). Login: `email` valid, `password` required. Server errors map to inline messages: `409 DUPLICATE_EMAIL` → "An account with this email already exists", `401 INVALID_CREDENTIALS` → "Invalid email or password", `400 VALIDATION_ERROR` → first `details[].message`, network failure → "Can't reach the server. Please try again."
- **Post-auth navigation:** successful login/register navigates to `/`. Login/Register pages redirect to `/` if already authenticated.
- **Accessibility:** semantic landmarks, labelled inputs with `aria-invalid`/`aria-describedby` for errors, visible focus rings, `prefers-reduced-motion` respected for animations, sufficient contrast for saffron-on-white text (use deep blue/charcoal for body text; saffron for accents and large text/buttons only).

## Components

- `components/layout/Layout.jsx`, `Header.jsx` (sticky, backdrop blur, logo + nav; signed-out shows Login/Register, signed-in shows user name + Logout; mobile menu toggle), `Footer.jsx` (tagline, links, contact from `README`: Raj Roy (KiNG), GitHub/LinkedIn/Instagram).
- `components/common/Button.jsx` (existing — refactor to brand tokens, keep API: `variant`, `size`, `loading`, `disabled`, `type`), `Card.jsx`, `Input.jsx` (label + error, forwards ref for react-hook-form).
- `components/pages/Home.jsx` (hero with logo/tagline/CTAs; features showcase: Stories, Community, Cultural Maps; category strip: mythology, history, folk tales, geography, architecture, festivals, philosophy; closing CTA), `Login.jsx`, `Register.jsx`, `NotFound.jsx`.
- `store/index.js`, `store/authSlice.js`; `services/api.js`, `services/authService.js` (thin axios wrappers for the three endpoints).
- `App.jsx` becomes the router + session-restore effect; `main.jsx` wraps in Redux `Provider`.

## Visual direction

Warm, respectful, editorial — not a generic SaaS template. Cream page background, deep-blue headings in Playfair Display, saffron→gold gradient reserved for primary CTAs and the hero accent, subtle traditional pattern (CSS-only, e.g. a low-opacity geometric/jali-inspired background on the hero and dividers), cards with soft shadow and a faint gold border (per brand guidelines). No emoji as UI icons — use inline SVG icons. Responsive from 360px up; 4-column mobile / 12-column desktop grid feel via Tailwind utilities.

## Testing / Verification

No frontend test framework is added (YAGNI for this slice; revisit when business logic grows). Verification per task: `npm run lint` clean, `npm run build` succeeds. Final task runs the dev server and checks every route renders, forms validate, and a failed API call (backend/DB unavailable) shows the friendly network-error message rather than crashing.

## Out of Scope

Stories browsing/detail/creation, user dashboard, protected-route guards beyond login/register redirects, OAuth, password reset, email verification, mobile app, i18n.

## Files Added/Changed

- Changed: `client/package.json` (+lockfile), `client/index.html`, `client/src/index.css`, `client/src/main.jsx`, `client/src/App.jsx`, `client/src/components/common/Button.jsx`, `client/eslint.config.js` (only if required by ESLint 10)
- Deleted: `client/tailwind.config.js`, `client/postcss.config.js`, `client/src/App.css`, `client/src/assets/react.svg`, `client/public/vite.svg` (default template leftovers)
- Added: `client/.env.example`, `client/src/store/*`, `client/src/services/*`, `client/src/components/layout/*`, `client/src/components/common/{Card,Input}.jsx`, `client/src/components/pages/*`
