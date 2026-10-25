# Frontend Foundation + Auth UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the KATHA client from a demo counter into a real, polished React app: brand design system, routing, Redux auth state wired to the existing auth API, and the first pages (Home, Login, Register, 404).

**Architecture:** Tailwind v4 CSS-first theme holds the brand tokens. A thin `services/` layer (axios client, pure error-message mapper, resilient token storage) sits under a Redux Toolkit `auth` slice. Presentational components live in `components/common`, shell components in `components/layout`, screens in `components/pages`. `main.jsx` provides the store and kicks off session restore; `App.jsx` owns routing.

**Tech Stack:** React 19, Vite (latest), Tailwind CSS v4, Redux Toolkit, React Router 7, React Hook Form, Axios, ESLint 9/10 flat config. Verification: ESLint, `vite build`, a plain-Node assert script, and a Playwright-driven browser check that runs from the scratchpad (not a project dependency).

**Spec:** `docs/superpowers/specs/2026-09-26-frontend-foundation-design.md` (binding authority; this plan's Rulings section lists the few places it deliberately refines the spec).

## Global Constraints

- All work happens in `client/`. Do **not** modify `server/` (the backend is finished and reviewed).
- Windows dev machine, Node 24, npm 11. Run every `npm` command from `C:\devKiNG_Projects\03_Full_Stack_Projects\Katha\client`.
- Upgrade every client dependency to its latest release, majors included. If npm reports `ERESOLVE` or a major breaks build/lint and a small config change can't fix it, step only that package (and its coupled peers) back to the highest working version — **never** use `--force` or `--legacy-peer-deps`.
- Remove `@tailwindcss/postcss`, `postcss`, `autoprefixer`, and `postcss.config.js`; delete `tailwind.config.js` (Tailwind v4 CSS-first only).
- **No frontend test framework** (no Vitest/Jest/Testing Library). Per-task verification is `npm run lint`, `npm run build`, and (from Task 3 on) `npm run check`. Task 8 adds a scratchpad-only browser check.
- Brand tokens (from `docs/brand-guidelines.md`): saffron `#FF6B35`, deep blue `#004E89`, gold `#FFD700`, cream `#FFF8E7`, charcoal `#2D3436`, soft green `#00B894`. Fonts: Inter (body), Playfair Display (headings), Noto Serif Devanagari (Hindi accents) via `<link>` in `index.html`.
- API contract (fixed): `POST /auth/register {name,email,password}` → `201 {user:{id,name,email,role,avatar}, token}`; `POST /auth/login {email,password}` → `200` same shape; `GET /auth/me` (Bearer) → `200 {user}`. Errors are `{error, code}`; codes `DUPLICATE_EMAIL` (409), `INVALID_CREDENTIALS` (401), `UNAUTHORIZED` (401), `VALIDATION_ERROR` (400, `details:[{field,message}]`), `RATE_LIMIT_EXCEEDED` (429). Base URL is `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.
- Token lives under `localStorage` key `katha_token`; every storage access is wrapped in try/catch; an in-memory copy keeps the session working when storage is blocked.
- ESLint (react-hooks v7 + react-refresh) must pass with **zero** errors: no `setState` synchronously inside effects, no impure calls (`Date.now`, `Math.random`, `new Date()`) inside component bodies, and component files export only components.
- No emoji as UI icons — inline SVG only. Accessibility: semantic landmarks, labelled inputs, `aria-invalid`/`aria-describedby` for errors, visible focus, `prefers-reduced-motion` respected, body text never saffron.
- **Commit rules (project owner's hard rule — Claude/AI must never appear as a contributor on GitHub):** each task ends with ONE plain local commit staging **only that task's listed files** (never `git add .` / `-A`), a plain descriptive message, **no `Co-Authored-By` line and no mention of Claude/AI/Anthropic**, and **never `git push`**. Before staging, run `git status --short` and confirm nothing outside the task's file list would be committed.
- Scratchpad for throwaway files: `C:\Users\kingr\AppData\Local\Temp\claude\c--devKiNG-Projects-03-Full-Stack-Projects-Katha\f7e89805-d43b-4b34-af51-56f6fd8d78d9\scratchpad` (referred to below as `<SCRATCH>`).

## Review Focus

Inputs and conditions the spec implies but that no happy-path task exercises, most likely to bite a real user first. Each has a pinning check in the task noted.

1. **Browser storage blocked, missing, or throwing** (private mode, disabled site data): the app must still load and let the user sign in for the tab's lifetime — never a white screen. *Pinned: Task 3 `npm run check` (three storage scenarios); Task 8 browser check "blocked storage".*
2. **Stale, expired, or garbage token at startup; API down at startup:** a 401 from `/auth/me` clears the token and shows the guest UI with no redirect loop or flash of signed-in UI; an unreachable API keeps the token (so a later reload can recover) and also shows the guest UI. *Pinned: Task 8 browser checks "stale token" and "API down at startup".*
3. **The API answering with something other than the documented JSON** (HTML 502 page, 429 rate limit, timeout/no response, empty body): users always see a friendly sentence, never `undefined`, raw HTML, or a blank error box. *Pinned: Task 3 `npm run check` (nine message cases).*
4. **Form input edge cases:** email with surrounding spaces or capitals (must be trimmed, case left to the server), whitespace-only name, 101-character name, password containing leading/trailing spaces (must NOT be trimmed), mismatched confirm password, and double-submit while a request is in flight. *Pinned: Task 8 browser checks (request-body assertion, validation messages, disabled-while-loading).*
5. **Odd URLs and narrow screens:** a malformed hash such as `/#%E0%A4%A` (makes `decodeURIComponent` throw), an unknown route, and a 360px viewport with a very long user name and the mobile menu open — no crash, no horizontal scrollbar. *Pinned: Task 8 browser checks "malformed hash", "404", "long name at 360px".*

## Rulings (deliberate refinements of the spec)

- **Brand mark is an inline SVG (`Logo`), not the files in `public/`.** `katha-logo(svg).svg` is 745 KB and has a grey square baked in; the PNG is 929 KB. The mark is a tiny hand-drawn temple-spire glyph shared by the header, footer, loader and a new 1 KB `public/favicon.svg`. The old logo files stay in `public/` untouched (unused).
- **Primary button text is near-black (`ink`), not white.** White on saffron→gold fails WCAG AA at body sizes (≈2.9:1); `ink` on saffron is ≈6:1.
- **The token is cleared only on a 401 from `/auth/me`**, not on any failure — a network blip or 5xx at startup must not log people out.
- **Session restore is dispatched from `main.jsx`** (before first render), not from an effect in `App.jsx`, to avoid the duplicate request React StrictMode's double-effect would cause. `auth.initializing` gates the first render so guests never see a signed-in flash.
- **Double-submit is blocked in the store**, via a `condition` on `registerUser`/`loginUser` (skips the call while `auth.status === 'loading'`), not only by disabling the button — a fast double-click can fire twice before React re-renders.
- **A tiny `scripts/check-services.mjs` (plain `node:assert`, exposed as `npm run check`) pins the pure service modules.** It adds no dependency and is not a test framework.
- **`index.html` cleanup:** flag emoji removed from `<title>`, author meta corrected, heavy favicon links replaced by `favicon.svg`.

---

## Task 1: Upgrade dependencies and repair the Tailwind v4 entry point

**Files:**
- Modify: `client/package.json`, `client/package-lock.json`, `client/eslint.config.js` (only if the new ESLint/plugin majors require it), `client/src/index.css` (only the three `@tailwind` lines)
- Delete: `client/postcss.config.js`

**Interfaces:**
- Produces: a client that installs cleanly on latest dependencies and passes `npm run lint` and `npm run build`. Later tasks assume Tailwind v4 (`@import "tailwindcss"`), React 19.x, `react-router-dom` 7.x, `@reduxjs/toolkit` 2.x, `react-hook-form` 7.x, `axios` 1.x.

- [ ] **Step 1: Record the baseline**

Run (from `client/`): `npm run lint` then `npm run build`
Expected: note whether each passes or fails and paste the first error lines (if any) into your report. This is the "before" picture; do not fix unrelated pre-existing problems beyond what Steps 2-5 require.

- [ ] **Step 2: Remove the PostCSS-era packages and config**

```bash
npm uninstall @tailwindcss/postcss postcss autoprefixer
rm postcss.config.js
```
Expected: three packages removed from `package.json`; `postcss.config.js` gone.

- [ ] **Step 3: Upgrade everything to latest**

```bash
npm install react@latest react-dom@latest react-router-dom@latest react-redux@latest @reduxjs/toolkit@latest axios@latest react-hook-form@latest tailwindcss@latest
npm install -D @tailwindcss/vite@latest vite@latest @vitejs/plugin-react@latest eslint@latest @eslint/js@latest eslint-plugin-react-hooks@latest eslint-plugin-react-refresh@latest globals@latest @types/react@latest @types/react-dom@latest
```
Expected: installs succeed. If npm prints `ERESOLVE`, do NOT force: identify the conflicting package pair from the error, step that pair back to its highest compatible version (e.g. `vite@7` with `@vitejs/plugin-react@5`, or `eslint@9` with `@eslint/js@9`), reinstall, and record exactly what you pinned and why in your report.

- [ ] **Step 4: Repair the Tailwind entry**

In `client/src/index.css`, replace these three lines:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
with the single line:
```css
@import "tailwindcss";
```
(Leave everything else in the file; Task 2 rewrites it. The `@import url('https://fonts.googleapis.com/...')` at the very top must stay above it.)

- [ ] **Step 5: Make ESLint pass on the new majors**

Run: `npm run lint`
If it fails because a plugin's flat-config export was renamed (most likely `reactHooks.configs['recommended-latest']`), open `node_modules/eslint-plugin-react-hooks/README.md`, use the flat-config key it documents (expected: `reactHooks.configs.flat.recommended`), and update `eslint.config.js` accordingly — only that line. If lint reports genuine rule violations in `App.jsx`/`Button.jsx` from the new React-Compiler-based rules, leave them (both files are rewritten in later tasks) **only if** lint can still exit 0 by reporting them as warnings; otherwise fix them minimally.
Expected end state: `npm run lint` exits 0.

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: succeeds. Run `npm outdated` and confirm nothing is left behind except anything you deliberately pinned in Step 3.

- [ ] **Step 7: Commit**

```bash
git status --short
git add client/package.json client/package-lock.json client/eslint.config.js client/src/index.css client/postcss.config.js
git commit -m "Upgrade client dependencies to latest and switch Tailwind to v4 import"
```
(Omit `client/eslint.config.js` from `git add` if you did not change it. `client/postcss.config.js` is staged as a deletion.)

---

## Task 2: Design tokens, base styles, favicon, and Button refactor

**Files:**
- Modify: `client/src/index.css` (full rewrite), `client/index.html` (full rewrite), `client/src/components/common/Button.jsx` (full rewrite)
- Create: `client/public/favicon.svg`
- Delete: `client/tailwind.config.js`, `client/src/App.css`, `client/src/assets/react.svg`, `client/public/vite.svg`

**Interfaces:**
- Produces (Tailwind utilities generated from the theme): colors `saffron`, `saffron-deep`, `gold`, `navy`, `navy-dark`, `navy-deep`, `cream`, `parchment`, `charcoal`, `charcoal-soft`, `ink`, `leaf`; fonts `font-sans`, `font-display`, `font-devanagari`; `shadow-card`, `shadow-glow`; `animate-drift`, `animate-rise`; custom utilities `bg-jali`, `bg-jali-light`, `bg-hero-glow`, `text-gradient-saffron`.
- Produces: `Button` default export — props `as` (default `'button'`), `variant` (`primary|secondary|outline|ghost|light|danger`, default `primary`), `size` (`small|medium|large`, default `medium`), `loading`, `disabled`, `type` (default `'button'`), `className`, `children`, plus any pass-through props (`to`, `href`, `onClick`, …). Forwards `ref`.

- [ ] **Step 1: Delete leftovers**

```bash
rm tailwind.config.js src/App.css src/assets/react.svg public/vite.svg
rmdir src/assets
```
(`src/assets` is empty afterwards; if `rmdir` fails because it is not empty, leave the directory.)

- [ ] **Step 2: Rewrite `client/src/index.css`**

```css
@import "tailwindcss";

@theme static {
  --color-saffron: #ff6b35;
  --color-saffron-deep: #c2410c;
  --color-gold: #ffd700;
  --color-navy: #004e89;
  --color-navy-dark: #003a66;
  --color-navy-deep: #002a4a;
  --color-cream: #fff8e7;
  --color-parchment: #f7ebcc;
  --color-charcoal: #2d3436;
  --color-charcoal-soft: #5b6467;
  --color-ink: #1b1a17;
  --color-leaf: #00b894;

  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: "Playfair Display", ui-serif, Georgia, "Times New Roman", serif;
  --font-devanagari: "Noto Serif Devanagari", "Noto Sans Devanagari", "Nirmala UI", serif;

  --shadow-card: 0 8px 32px rgb(0 0 0 / 0.08);
  --shadow-glow: 0 4px 14px rgb(255 107 53 / 0.35);

  --animate-drift: drift 120s linear infinite;
  --animate-rise: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;

  @keyframes drift {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
    -webkit-text-size-adjust: 100%;
  }

  body {
    @apply bg-cream font-sans text-charcoal antialiased;
    margin: 0;
    min-height: 100dvh;
    text-rendering: optimizeLegibility;
  }

  h1,
  h2,
  h3,
  h4 {
    @apply font-display text-navy;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  :focus-visible {
    outline: 2px solid var(--color-saffron-deep);
    outline-offset: 2px;
  }

  ::selection {
    background: rgb(255 215 0 / 0.5);
  }
}

/* Faint diamond lattice, inspired by jali screens — on light backgrounds */
@utility bg-jali {
  background-image:
    repeating-linear-gradient(45deg, rgb(0 78 137 / 0.07) 0 1px, transparent 1px 24px),
    repeating-linear-gradient(-45deg, rgb(0 78 137 / 0.07) 0 1px, transparent 1px 24px);
}

/* Same lattice, for dark navy backgrounds */
@utility bg-jali-light {
  background-image:
    repeating-linear-gradient(45deg, rgb(255 248 231 / 0.07) 0 1px, transparent 1px 24px),
    repeating-linear-gradient(-45deg, rgb(255 248 231 / 0.07) 0 1px, transparent 1px 24px);
}

/* Warm glow behind the hero: saffron top-left, gold bottom-right */
@utility bg-hero-glow {
  background-image:
    radial-gradient(60% 80% at 15% 20%, rgb(255 107 53 / 0.35), transparent 60%),
    radial-gradient(50% 60% at 90% 90%, rgb(255 215 0 / 0.18), transparent 60%);
}

@utility text-gradient-saffron {
  background-image: linear-gradient(90deg, var(--color-saffron), var(--color-gold));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Create `client/public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#FF6B35"/><circle cx="20" cy="5.2" r="1.2" fill="#FFD700"/><path d="M20 6l3.5 6h-7zM20 10.5l6 8.5H14zM20 15.5L29 27H11z" fill="#FFF8E7"/><rect x="9" y="27" width="22" height="5" rx="1" fill="#004E89"/><path d="M17.5 32v-2.5a2.5 2.5 0 015 0V32z" fill="#FFD700"/></svg>
```

- [ ] **Step 4: Rewrite `client/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/katha-logo(png).png" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="KATHA - Indian Heritage Platform. Discover, share and preserve the rich cultural heritage of India through stories, places, and community connections."
    />
    <meta
      name="keywords"
      content="Indian heritage, culture, stories, mythology, history, India, KATHA, Bharatiya Sanskriti"
    />
    <meta name="author" content="Raj Roy (KiNG)" />
    <meta name="theme-color" content="#FFF8E7" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@500;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&display=swap"
      rel="stylesheet"
    />

    <title>KATHA — Indian Heritage Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Rewrite `client/src/components/common/Button.jsx`**

```jsx
import { forwardRef } from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 active:translate-y-px';

const SIZES = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-3.5 text-base sm:text-lg',
};

const VARIANTS = {
  primary: 'bg-linear-to-r from-saffron to-gold text-ink shadow-glow hover:brightness-105',
  secondary: 'bg-navy text-cream hover:bg-navy-dark',
  outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-cream',
  ghost: 'text-navy hover:bg-navy/10',
  light: 'border-2 border-cream/70 text-cream hover:bg-cream/10',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};

function Spinner() {
  return (
    <svg
      className="size-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const isNativeButton = Component === 'button';

  const classes = [
    BASE,
    SIZES[size],
    VARIANTS[variant],
    isDisabled ? 'pointer-events-none opacity-60' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      ref={ref}
      {...(isNativeButton ? { type, disabled: isDisabled } : {})}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </Component>
  );
});

export default Button;
```

- [ ] **Step 6: Verify**

Run (from `client/`): `npm run lint` → exit 0. `npm run build` → succeeds.
Then confirm the theme reached the bundle: `grep -l "\-\-color-saffron" dist/assets/*.css` prints a file, and `grep -c "@tailwind" src/index.css` prints `0`.

- [ ] **Step 7: Commit**

```bash
git status --short
git add client/src/index.css client/index.html client/src/components/common/Button.jsx client/public/favicon.svg client/tailwind.config.js client/src/App.css client/src/assets/react.svg client/public/vite.svg
git commit -m "Add Tailwind v4 brand theme, favicon, and refactor Button to design tokens"
```
(The four deleted files are staged as deletions. Do not stage `client/dist`.)

---

## Task 3: Services, error messages, token storage, auth store, and the checks script

**Files:**
- Create: `client/src/services/tokenStorage.js`, `client/src/services/errorMessages.js`, `client/src/services/api.js`, `client/src/services/authService.js`, `client/src/store/authSlice.js`, `client/src/store/index.js`, `client/scripts/check-services.mjs`, `client/.env.example`
- Modify: `client/package.json` (add the `check` script)

**Interfaces:**
- Produces `tokenStorage.js`: `getToken(): string|null`, `setToken(value: string): void`, `clearToken(): void` (never throw; memory fallback).
- Produces `errorMessages.js`: `getErrorMessage(error): string` (pure; never throws).
- Produces `api.js`: default export axios instance (baseURL from `VITE_API_URL`, 15 s timeout, Bearer interceptor using `getToken()`).
- Produces `authService.js`: `register(payload)`, `login(payload)`, `fetchMe()` → each resolves to the response `data`.
- Produces `authSlice.js`: default export reducer; named exports `registerUser(payload)`, `loginUser(payload)`, `fetchCurrentUser()` (thunks), `logout()` (thunk action creator), `clearError` (action). State: `{ user, token, status: 'idle'|'loading'|'succeeded'|'failed', error: string|null, initializing: boolean }`. Thunk rejections carry a string (register/login) or `{message, unauthorized}` (fetchCurrentUser).
- Produces `store/index.js`: default export `store`.

- [ ] **Step 1: Write the failing check — `client/scripts/check-services.mjs`**

```js
import assert from 'node:assert/strict';

const { getErrorMessage } = await import('../src/services/errorMessages.js');

const errorCases = [
  [{}, "Can't reach the server. Please try again."],
  [undefined, "Can't reach the server. Please try again."],
  [{ response: { status: 409, data: { code: 'DUPLICATE_EMAIL' } } }, 'An account with this email already exists.'],
  [{ response: { status: 401, data: { code: 'INVALID_CREDENTIALS' } } }, 'Invalid email or password.'],
  [
    {
      response: {
        status: 400,
        data: {
          code: 'VALIDATION_ERROR',
          details: [{ field: 'password', message: 'Password must be at least 6 characters' }],
        },
      },
    },
    'Password must be at least 6 characters',
  ],
  [{ response: { status: 400, data: { code: 'VALIDATION_ERROR' } } }, 'Please check the details you entered.'],
  [
    { response: { status: 429, data: { code: 'RATE_LIMIT_EXCEEDED' } } },
    'Too many attempts. Please wait a few minutes and try again.',
  ],
  [
    { response: { status: 502, data: '<html>Bad Gateway</html>' } },
    'Something went wrong on our side. Please try again shortly.',
  ],
  [{ response: { status: 404, data: null } }, 'Something went wrong. Please try again.'],
];

for (const [input, expected] of errorCases) {
  assert.equal(getErrorMessage(input), expected);
}

function stubStorage(value) {
  Object.defineProperty(globalThis, 'localStorage', { value, configurable: true, writable: true });
}

// Scenario A: storage exists but every call throws (private mode / blocked site data)
const throwing = {
  getItem() {
    throw new Error('denied');
  },
  setItem() {
    throw new Error('denied');
  },
  removeItem() {
    throw new Error('denied');
  },
};
stubStorage(throwing);
let store = await import('../src/services/tokenStorage.js?blocked');
assert.equal(store.getToken(), null);
store.setToken('abc');
assert.equal(store.getToken(), 'abc', 'token must survive in memory when storage throws');
store.clearToken();
assert.equal(store.getToken(), null);

// Scenario B: storage missing entirely
stubStorage(undefined);
store = await import('../src/services/tokenStorage.js?missing');
assert.equal(store.getToken(), null);
store.setToken('xyz');
assert.equal(store.getToken(), 'xyz');

// Scenario C: healthy storage
const data = new Map();
stubStorage({
  getItem: (key) => (data.has(key) ? data.get(key) : null),
  setItem: (key, value) => data.set(key, String(value)),
  removeItem: (key) => data.delete(key),
});
data.set('katha_token', 'saved');
store = await import('../src/services/tokenStorage.js?working');
assert.equal(store.getToken(), 'saved');
store.setToken('next');
assert.equal(data.get('katha_token'), 'next');
store.clearToken();
assert.equal(data.has('katha_token'), false);
assert.equal(store.getToken(), null);

console.log('service checks passed');
```

Add to `client/package.json` `"scripts"` (keep existing scripts): `"check": "node scripts/check-services.mjs"`.

- [ ] **Step 2: Run it and verify it fails**

Run (from `client/`): `npm run check`
Expected: FAIL with `Cannot find module '.../src/services/errorMessages.js'`.

- [ ] **Step 3: Create `client/src/services/errorMessages.js`**

```js
const NETWORK_MESSAGE = "Can't reach the server. Please try again.";
const RATE_LIMIT_MESSAGE = 'Too many attempts. Please wait a few minutes and try again.';

export function getErrorMessage(error) {
  const response = error?.response;
  if (!response) return NETWORK_MESSAGE;

  const data = response.data && typeof response.data === 'object' ? response.data : {};

  switch (data.code) {
    case 'DUPLICATE_EMAIL':
      return 'An account with this email already exists.';
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password.';
    case 'RATE_LIMIT_EXCEEDED':
      return RATE_LIMIT_MESSAGE;
    case 'VALIDATION_ERROR': {
      const first = Array.isArray(data.details) ? data.details[0]?.message : undefined;
      return first || 'Please check the details you entered.';
    }
    default:
      break;
  }

  if (response.status === 429) return RATE_LIMIT_MESSAGE;
  if (response.status >= 500) return 'Something went wrong on our side. Please try again shortly.';
  return 'Something went wrong. Please try again.';
}
```

- [ ] **Step 4: Create `client/src/services/tokenStorage.js`**

```js
const STORAGE_KEY = 'katha_token';

let token = null;
let loaded = false;

function loadOnce() {
  if (loaded) return;
  loaded = true;
  try {
    token = globalThis.localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    token = null;
  }
}

export function getToken() {
  loadOnce();
  return token;
}

export function setToken(value) {
  loaded = true;
  token = value;
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage is blocked or unavailable: the session lasts until the tab closes.
  }
}

export function clearToken() {
  loaded = true;
  token = null;
  try {
    globalThis.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing persisted, nothing to remove.
  }
}
```

- [ ] **Step 5: Run the checks and verify they pass**

Run: `npm run check`
Expected: prints `service checks passed`, exit 0.

- [ ] **Step 6: Create `client/src/services/api.js`**

```js
import axios from 'axios';
import { getToken } from './tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

- [ ] **Step 7: Create `client/src/services/authService.js`**

```js
import api from './api';

export const register = (payload) => api.post('/auth/register', payload).then((response) => response.data);

export const login = (payload) => api.post('/auth/login', payload).then((response) => response.data);

export const fetchMe = () => api.get('/auth/me').then((response) => response.data);
```

- [ ] **Step 8: Create `client/src/store/authSlice.js`**

```js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
import { getErrorMessage } from '../services/errorMessages';
import { clearToken, getToken, setToken } from '../services/tokenStorage';

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

// Runs synchronously at dispatch time, so a rapid double-click can never start two requests.
const notAlreadyLoading = (_, { getState }) => getState().auth.status !== 'loading';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: notAlreadyLoading },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);
      setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: notAlreadyLoading },
);

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    return await authService.fetchMe();
  } catch (error) {
    const unauthorized = error?.response?.status === 401;
    if (unauthorized) clearToken();
    return rejectWithValue({ message: getErrorMessage(error), unauthorized });
  }
});

const initialToken = getToken();

const initialState = {
  user: null,
  token: initialToken,
  status: 'idle',
  error: null,
  initializing: Boolean(initialToken),
};

const startLoading = (state) => {
  state.status = 'loading';
  state.error = null;
};

const authenticated = (state, action) => {
  state.status = 'succeeded';
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.initializing = false;
};

const authFailed = (state, action) => {
  state.status = 'failed';
  state.error = typeof action.payload === 'string' ? action.payload : FALLBACK_ERROR;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      if (state.status === 'failed') state.status = 'idle';
    },
    sessionCleared(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, startLoading)
      .addCase(registerUser.fulfilled, authenticated)
      .addCase(registerUser.rejected, authFailed)
      .addCase(loginUser.pending, startLoading)
      .addCase(loginUser.fulfilled, authenticated)
      .addCase(loginUser.rejected, authFailed)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false;
        if (!state.token) return;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.initializing = false;
        if (action.payload?.unauthorized) {
          state.token = null;
          state.user = null;
        }
      });
  },
});

export const { clearError, sessionCleared } = authSlice.actions;

export const logout = () => (dispatch) => {
  clearToken();
  dispatch(sessionCleared());
};

export default authSlice.reducer;
```

- [ ] **Step 9: Create `client/src/store/index.js`**

```js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
```

- [ ] **Step 10: Create `client/.env.example`**

```
# Base URL of the KATHA API (include /api). Defaults to http://localhost:5000/api when unset.
VITE_API_URL=http://localhost:5000/api
```

- [ ] **Step 11: Verify**

Run: `npm run check` (passes), `npm run lint` (exit 0), `npm run build` (succeeds).

- [ ] **Step 12: Commit**

```bash
git status --short
git add client/src/services client/src/store client/scripts/check-services.mjs client/.env.example client/package.json
git commit -m "Add API services, resilient token storage, auth store, and service checks"
```

---

## Task 4: Common components and layout shell

**Files:**
- Create: `client/src/components/common/Icons.jsx`, `client/src/components/common/Logo.jsx`, `client/src/components/common/Card.jsx`, `client/src/components/common/Input.jsx`, `client/src/components/common/FormError.jsx`, `client/src/components/layout/Layout.jsx`, `client/src/components/layout/Header.jsx`, `client/src/components/layout/Footer.jsx`

**Interfaces:**
- Consumes: `Button` (Task 2); `logout` and `state.auth.user` (Task 3); theme utilities (Task 2).
- Produces: `Icons.jsx` named exports `MenuIcon`, `CloseIcon`, `BookIcon`, `UsersIcon`, `MapPinIcon`, `ArrowRightIcon`, `AlertIcon`, `GithubIcon`, `LinkedinIcon`, `InstagramIcon` (each takes `className`, default `size-5`) and `Mandala({className})`. `Logo({className})` (default `size-9`). `Card({as, className, children, ...props})`. `Input` (forwardRef; props `label`, `error`, `hint`, `id`, `className`, plus input props). `FormError({message})` (renders nothing when falsy). `Layout` (default export, renders `Header` + `<Outlet />` + `Footer`, handles hash-scroll and a skip link). `Header`, `Footer` default exports.

- [ ] **Step 1: Create `client/src/components/common/Icons.jsx`**

```jsx
function Svg({ className = 'size-5', children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const MenuIcon = (props) => (
  <Svg {...props}>
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Svg>
);

export const BookIcon = (props) => (
  <Svg {...props}>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </Svg>
);

export const UsersIcon = (props) => (
  <Svg {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

export const MapPinIcon = (props) => (
  <Svg {...props}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Svg>
);

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const AlertIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </Svg>
);

export const GithubIcon = (props) => (
  <Svg {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </Svg>
);

export const LinkedinIcon = (props) => (
  <Svg {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </Svg>
);

export const InstagramIcon = (props) => (
  <Svg {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </Svg>
);

const PETAL_ANGLES = Array.from({ length: 16 }, (_, index) => index * 22.5);

export function Mandala({ className = '' }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="1.2">
        <circle cx="200" cy="200" r="190" opacity="0.35" />
        <circle cx="200" cy="200" r="150" opacity="0.5" />
        <circle cx="200" cy="200" r="60" opacity="0.6" />
        {PETAL_ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 200 200)`}>
            <path d="M200 50C222 100 222 140 200 170C178 140 178 100 200 50Z" opacity="0.75" />
            <path d="M200 20L208 44L200 38L192 44Z" opacity="0.55" />
          </g>
        ))}
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Create `client/src/components/common/Logo.jsx`**

```jsx
export default function Logo({ className = 'size-9' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="#FF6B35" />
      <circle cx="20" cy="5.2" r="1.2" fill="#FFD700" />
      <path d="M20 6l3.5 6h-7zM20 10.5l6 8.5H14zM20 15.5L29 27H11z" fill="#FFF8E7" />
      <rect x="9" y="27" width="22" height="5" rx="1" fill="#004E89" />
      <path d="M17.5 32v-2.5a2.5 2.5 0 015 0V32z" fill="#FFD700" />
    </svg>
  );
}
```

- [ ] **Step 3: Create `client/src/components/common/Card.jsx`**

```jsx
export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`rounded-2xl border border-gold/25 bg-white shadow-card ${className}`} {...props}>
      {children}
    </Component>
  );
}
```

- [ ] **Step 4: Create `client/src/components/common/Input.jsx`**

```jsx
import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border bg-white px-4 py-3 text-base text-charcoal shadow-sm transition placeholder:text-charcoal-soft/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/30 ${
          error ? 'border-red-600' : 'border-charcoal/25'
        }`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-charcoal-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
```

- [ ] **Step 5: Create `client/src/components/common/FormError.jsx`**

```jsx
import { AlertIcon } from './Icons';

export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-800"
    >
      <AlertIcon className="mt-0.5 size-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
```

- [ ] **Step 6: Create `client/src/components/layout/Header.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import Button from '../common/Button';
import { CloseIcon, MenuIcon } from '../common/Icons';
import Logo from '../common/Logo';

const NAV_BASE = 'rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-saffron-deep';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout());
  };

  const links = (
    <>
      <NavLink
        to="/"
        end
        onClick={closeMenu}
        className={({ isActive }) => `${NAV_BASE} ${isActive ? 'text-saffron-deep' : 'text-navy'}`}
      >
        Home
      </NavLink>
      <Link to={{ pathname: '/', hash: '#features' }} onClick={closeMenu} className={`${NAV_BASE} text-navy`}>
        Explore
      </Link>
      <Link to={{ pathname: '/', hash: '#categories' }} onClick={closeMenu} className={`${NAV_BASE} text-navy`}>
        Themes
      </Link>
    </>
  );

  const authActions = user ? (
    <>
      <span className="max-w-[9rem] truncate text-sm font-semibold text-charcoal" title={user.name}>
        {user.name}
      </span>
      <Button variant="outline" size="small" onClick={handleLogout}>
        Log out
      </Button>
    </>
  ) : (
    <>
      <Button as={Link} to="/login" variant="ghost" size="small" onClick={closeMenu}>
        Sign in
      </Button>
      <Button as={Link} to="/register" size="small" onClick={closeMenu}>
        Join KATHA
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="KATHA home">
          <Logo className="size-9" />
          <span className="font-display text-2xl font-bold tracking-wide text-navy">KATHA</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links}
        </nav>

        <div className="hidden items-center gap-3 md:flex">{authActions}</div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-lg text-navy hover:bg-navy/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-navy/10 bg-cream md:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links}
          </nav>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 border-t border-navy/10 px-4 py-4 sm:px-6">
            {authActions}
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 7: Create `client/src/components/layout/Footer.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../common/Icons';
import Logo from '../common/Logo';

const YEAR = new Date().getFullYear();

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/devKiNGCRiC', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajroy28/', Icon: LinkedinIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/devkingcric', Icon: InstagramIcon },
];

const LINK = 'underline-offset-4 transition-colors hover:text-gold hover:underline';

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-cream/85">
      <div className="h-1 bg-linear-to-r from-saffron via-gold to-leaf" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="size-10" />
            <span className="font-display text-2xl font-bold tracking-wide text-cream">KATHA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Preserving the past, inspiring the future — one katha at a time.
          </p>
        </div>

        <nav aria-label="Footer explore">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to={{ pathname: '/', hash: '#features' }} className={LINK}>
                What we&rsquo;re building
              </Link>
            </li>
            <li>
              <Link to={{ pathname: '/', hash: '#categories' }} className={LINK}>
                Themes
              </Link>
            </li>
            <li>
              <Link to="/login" className={LINK}>
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/register" className={LINK}>
                Join KATHA
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Connect</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${LINK}`}>
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href="mailto:kingraj28roy@gmail.com" className={LINK}>
                kingraj28roy@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            &copy; {YEAR} KATHA. Built with care by Raj Roy (KiNG) &middot; RKC_BHARAT Initiative.
          </p>
          <p className="font-devanagari text-sm text-gold" lang="hi">
            जय हिन्द
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Create `client/src/components/layout/Layout.jsx`**

```jsx
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function readHashTarget(hash) {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

export default function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduceMotion ? 'auto' : 'smooth';

    if (hash) {
      const target = readHashTarget(hash);
      if (target) {
        target.scrollIntoView({ behavior });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 9: Verify**

Run (from `client/`): `npm run lint` → exit 0; `npm run build` → succeeds; `npm run check` → passes.

- [ ] **Step 10: Commit**

```bash
git status --short
git add client/src/components/common/Icons.jsx client/src/components/common/Logo.jsx client/src/components/common/Card.jsx client/src/components/common/Input.jsx client/src/components/common/FormError.jsx client/src/components/layout/Layout.jsx client/src/components/layout/Header.jsx client/src/components/layout/Footer.jsx
git commit -m "Add common components and the layout shell (header, footer, mobile menu)"
```

---

## Task 5: Login and Register pages

**Files:**
- Create: `client/src/components/layout/AuthPanel.jsx`, `client/src/components/pages/Login.jsx`, `client/src/components/pages/Register.jsx`

**Interfaces:**
- Consumes: `Input`, `Button`, `FormError`, `Mandala` (Task 4); `loginUser`, `registerUser`, `clearError` and `state.auth.{user,status,error}` (Task 3).
- Produces: `AuthPanel({title, subtitle, children, footer})`; default-exported `Login` and `Register` page components. Both redirect to `/` when `state.auth.user` is set (this also performs the post-success navigation), clear stale errors on mount, trim `email` (and `name`) but never the password, and disable submit while `status === 'loading'`.
- Exact user-visible strings (Task 8 asserts on them): headings `Welcome back` / `Create your account`; submit buttons `Sign in` / `Create account`; labels `Email`, `Password`, `Full name`, `Confirm password`; validation messages `Enter your email address`, `Enter a valid email address`, `Enter your password`, `Enter your name`, `Name must be 100 characters or fewer`, `Choose a password`, `Password must be at least 6 characters`, `Confirm your password`, `Passwords do not match`.

- [ ] **Step 1: Create `client/src/components/layout/AuthPanel.jsx`**

```jsx
import { Mandala } from '../common/Icons';

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12">
      <aside className="relative hidden overflow-hidden rounded-3xl bg-navy bg-jali-light p-10 text-cream lg:flex lg:flex-col lg:justify-between">
        <Mandala className="pointer-events-none absolute -bottom-24 -right-24 size-[26rem] animate-drift text-gold/30 motion-reduce:animate-none" />
        <div className="relative">
          <span lang="hi" className="font-devanagari text-lg text-gold">
            कथा
          </span>
          <p className="mt-6 font-display text-3xl leading-snug text-cream">
            Every festival, fort and folk tale is a story waiting to be told.
          </p>
        </div>
        <p className="relative text-sm text-cream/80">
          Preserving the past, inspiring the future &mdash; one katha at a time.
        </p>
      </aside>

      <section className="mx-auto w-full max-w-md self-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-charcoal-soft">{subtitle}</p>
        <div className="mt-8 rounded-2xl border border-gold/25 bg-white p-6 shadow-card sm:p-8">{children}</div>
        <p className="mt-6 text-center text-sm text-charcoal-soft">{footer}</p>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Create `client/src/components/pages/Login.jsx`**

```jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Button from '../common/Button';
import FormError from '../common/FormError';
import Input from '../common/Input';
import AuthPanel from '../layout/AuthPanel';
import { clearError, loginUser } from '../../store/authSlice';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const LINK = 'font-semibold text-navy underline underline-offset-4 hover:text-saffron-deep';

export default function Login() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (values) => dispatch(loginUser({ email: values.email, password: values.password }));

  return (
    <AuthPanel
      title="Welcome back"
      subtitle="Sign in to continue your journey through India's stories."
      footer={
        <>
          New to KATHA?{' '}
          <Link to="/register" className={LINK}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError message={error} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email', {
            setValueAs: (value) => value.trim(),
            required: 'Enter your email address',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
          })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
        />
        <Button type="submit" size="large" loading={status === 'loading'} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthPanel>
  );
}
```

- [ ] **Step 3: Create `client/src/components/pages/Register.jsx`**

```jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Button from '../common/Button';
import FormError from '../common/FormError';
import Input from '../common/Input';
import AuthPanel from '../layout/AuthPanel';
import { clearError, registerUser } from '../../store/authSlice';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const LINK = 'font-semibold text-navy underline underline-offset-4 hover:text-saffron-deep';

export default function Register() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (values) =>
    dispatch(registerUser({ name: values.name, email: values.email, password: values.password }));

  return (
    <AuthPanel
      title="Create your account"
      subtitle="Join KATHA and start collecting the stories that shaped a civilisation."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className={LINK}>
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError message={error} />
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', {
            setValueAs: (value) => value.trim(),
            required: 'Enter your name',
            maxLength: { value: 100, message: 'Name must be 100 characters or fewer' },
          })}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email', {
            setValueAs: (value) => value.trim(),
            required: 'Enter your email address',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
          })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 6 characters."
          error={errors.password?.message}
          {...register('password', {
            required: 'Choose a password',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirm your password',
            validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
          })}
        />
        <Button type="submit" size="large" loading={status === 'loading'} className="w-full">
          Create account
        </Button>
      </form>
    </AuthPanel>
  );
}
```

- [ ] **Step 4: Verify**

Run (from `client/`): `npm run lint` → exit 0; `npm run build` → succeeds; `npm run check` → passes.
If ESLint's `react-hooks` rules flag `useForm`/`register` usage (for example an `incompatible-library` warning), record the exact message in your report and keep the code as written unless it is an *error*; only errors block.

- [ ] **Step 5: Commit**

```bash
git status --short
git add client/src/components/layout/AuthPanel.jsx client/src/components/pages/Login.jsx client/src/components/pages/Register.jsx
git commit -m "Add Login and Register pages with validation and server error handling"
```

---

## Task 6: Home page and 404 page

**Files:**
- Create: `client/src/components/pages/Home.jsx`, `client/src/components/pages/NotFound.jsx`

**Interfaces:**
- Consumes: `Button`, `Card`, `Icons` (`Mandala`, `BookIcon`, `UsersIcon`, `MapPinIcon`, `ArrowRightIcon`), theme utilities (`bg-jali`, `bg-jali-light`, `bg-hero-glow`, `text-gradient-saffron`, `animate-drift`, `animate-rise`), `state.auth.user`.
- Produces: default-exported `Home` and `NotFound`. Exact strings Task 8 asserts on: Home `h1` text `Every heritage begins with a katha.`; guest hero CTAs `Join KATHA` (→ `/register`) and `Sign in` (→ `/login`); section ids `features` and `categories`; NotFound `h1` text `This page has wandered off`.

- [ ] **Step 1: Create `client/src/components/pages/Home.jsx`**

```jsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { ArrowRightIcon, BookIcon, MapPinIcon, Mandala, UsersIcon } from '../common/Icons';

const FEATURES = [
  {
    title: 'Stories',
    status: 'Coming first',
    Icon: BookIcon,
    text: 'Read and share mythology, history and folk tales, organised by region, era and theme.',
  },
  {
    title: 'Community',
    status: 'Planned',
    Icon: UsersIcon,
    text: 'Follow storytellers, join the conversation, ask experts and grow a circle of cultural ambassadors.',
  },
  {
    title: 'Cultural Maps',
    status: 'Planned',
    Icon: MapPinIcon,
    text: 'Travel India on an interactive map of temples, forts and heritage sites, each with its own stories.',
  },
];

const CATEGORIES = [
  { name: 'Mythology', native: 'पुराण', text: 'Epics, deities and the tales that shaped belief.' },
  { name: 'History', native: 'इतिहास', text: 'Dynasties, movements and the people between the dates.' },
  { name: 'Folk Tales', native: 'लोक कथा', text: 'Regional stories carried by voice across generations.' },
  { name: 'Geography', native: 'भूगोल', text: 'Rivers, mountains and the meaning of place.' },
  { name: 'Architecture', native: 'वास्तुकला', text: 'Temples, forts and the craft behind them.' },
  { name: 'Festivals', native: 'उत्सव', text: 'Rituals, seasons and celebrations across the year.' },
  { name: 'Philosophy', native: 'दर्शन', text: 'Schools of thought and everyday wisdom.' },
];

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron-deep">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-charcoal-soft">{intro}</p>}
    </div>
  );
}

function Hero({ user }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy bg-jali-light text-cream">
      <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 -translate-y-1/2 lg:right-0"
        aria-hidden="true"
      >
        <Mandala className="size-[42rem] animate-drift text-gold/25 motion-reduce:animate-none lg:text-gold/40" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <div className="max-w-2xl animate-rise">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <span lang="hi" className="font-devanagari text-base normal-case tracking-normal">
              कथा
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
            Indian Heritage Platform
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            Every heritage begins with a <em className="text-gradient-saffron pr-1 font-semibold">katha</em>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
            KATHA is a home for India&rsquo;s stories &mdash; mythology, history, folk tales and the places that hold
            them &mdash; told by people who love them.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {user ? (
              <>
                <p className="text-cream/90">
                  Welcome back, <strong className="font-semibold text-gold">{user.name}</strong>.
                </p>
                <Button as={Link} to={{ pathname: '/', hash: '#features' }} size="large">
                  See what&rsquo;s coming
                  <ArrowRightIcon className="size-5" />
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/register" size="large">
                  Join KATHA
                  <ArrowRightIcon className="size-5" />
                </Button>
                <Button as={Link} to="/login" variant="light" size="large">
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-1 bg-linear-to-r from-saffron via-gold to-leaf" aria-hidden="true" />
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Explore"
        title="Three doors into a living heritage"
        intro="KATHA is being built in the open, one door at a time. Here is what is opening, in order."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ title, status, Icon, text }) => (
          <Card key={title} className="p-7 transition-shadow duration-300 hover:shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
                <Icon className="size-6" />
              </span>
              <span className="rounded-full bg-gold/30 px-2.5 py-0.5 text-xs font-semibold text-navy-dark">
                {status}
              </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
            <p className="mt-2 leading-relaxed text-charcoal-soft">{text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="bg-parchment bg-jali">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Themes"
          title="Explore India by theme"
          intro="From the epics to the everyday, every story finds its place."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ name, native, text }) => (
            <li key={name}>
              <Card className="h-full p-6">
                <p lang="hi" className="font-devanagari text-2xl font-bold text-saffron-deep">
                  {native}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold">{name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{text}</p>
              </Card>
            </li>
          ))}
          <li>
            <div className="flex h-full flex-col justify-center rounded-2xl border-2 border-dashed border-navy/30 p-6 text-center">
              <p className="font-display text-lg font-bold text-navy">And many more</p>
              <p className="mt-1.5 text-sm text-charcoal-soft">New themes will appear as the community grows.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-navy bg-jali-light px-6 py-14 text-center text-cream sm:px-12">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold text-cream sm:text-4xl">Be among the first storytellers</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream/85">
            Create your free account today and help shape a home for India&rsquo;s stories.
          </p>
          <div className="mt-8 flex justify-center">
            <Button as={Link} to="/register" size="large">
              Join KATHA
              <ArrowRightIcon className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Hero user={user} />
      <Features />
      <Categories />
      {!user && <ClosingCta />}
    </>
  );
}
```

- [ ] **Step 2: Create `client/src/components/pages/NotFound.jsx`**

```jsx
import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <p className="font-display text-8xl font-bold text-saffron-deep/90 sm:text-9xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold">This page has wandered off</h1>
      <p className="mt-3 max-w-md text-charcoal-soft">
        The story you were looking for isn&rsquo;t here &mdash; it may have moved, or it may never have been written.
      </p>
      <Button as={Link} to="/" size="large" className="mt-8">
        Back to home
      </Button>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run (from `client/`): `npm run lint` → exit 0; `npm run build` → succeeds; `npm run check` → passes.

- [ ] **Step 4: Commit**

```bash
git status --short
git add client/src/components/pages/Home.jsx client/src/components/pages/NotFound.jsx
git commit -m "Add Home and NotFound pages"
```

---

## Task 7: App routing, Provider, and session restore

**Files:**
- Modify: `client/src/App.jsx` (full rewrite), `client/src/main.jsx` (full rewrite)

**Interfaces:**
- Consumes: `Layout` (Task 4), `Home`/`Login`/`Register`/`NotFound` (Tasks 5-6), `store` and `fetchCurrentUser` (Task 3), `Logo` (Task 4), `state.auth.initializing`.
- Produces: the running app. Routes: `/` Home, `/login`, `/register`, `*` NotFound, all inside `Layout`. While `auth.initializing` is true, only a full-page loader renders.

- [ ] **Step 1: Rewrite `client/src/App.jsx`**

```jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from './components/common/Logo';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import NotFound from './components/pages/NotFound';
import Register from './components/pages/Register';

function FullPageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <Logo className="size-14 animate-pulse motion-reduce:animate-none" />
        <p className="text-sm font-medium text-charcoal-soft">Loading KATHA&hellip;</p>
      </div>
    </div>
  );
}

export default function App() {
  const initializing = useSelector((state) => state.auth.initializing);

  if (initializing) return <FullPageLoader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Rewrite `client/src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import store from './store';
import { fetchCurrentUser } from './store/authSlice';

if (store.getState().auth.token) {
  store.dispatch(fetchCurrentUser());
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

- [ ] **Step 3: Verify**

Run (from `client/`): `npm run lint` → exit 0; `npm run build` → succeeds (note the reported JS/CSS bundle sizes in your report); `npm run check` → passes.
Then smoke-start the dev server without opening a browser: `BROWSER=none npm run dev -- --port 5173 --strictPort` in the background, wait until it prints the local URL, run `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` (expect `200`), then stop the server. If port 5173 is busy, report it instead of killing the other process.

- [ ] **Step 4: Commit**

```bash
git status --short
git add client/src/App.jsx client/src/main.jsx
git commit -m "Wire routing, Redux provider, and session restore"
```

---

## Task 8: Browser verification (no code changes)

**Files:** none in the repo. Scratch files only, in `<SCRATCH>`.

**Interfaces:**
- Consumes: the whole app as built by Tasks 1-7.
- Produces: a written report, PNG screenshots in `<SCRATCH>\shots`, and pass/fail results. This task **never edits repo files and never commits**. If a check fails, report the failure with the screenshot name and stop; the controller dispatches a fix to the owning task.

- [ ] **Step 1: Install Playwright's library-only package in the scratchpad**

```bash
cd "<SCRATCH>"
npm init -y
npm install playwright-core
```
(`playwright-core` downloads no browsers; the script drives the Edge/Chrome already installed on this Windows machine.)

- [ ] **Step 2: Write `<SCRATCH>\verify.mjs`**

```js
import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:5173';
const SHOTS = process.env.SHOTS_DIR;
fs.mkdirSync(SHOTS, { recursive: true });

const CORS = {
  'access-control-allow-origin': BASE,
  'access-control-allow-headers': 'authorization,content-type',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
};

const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];
const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error('No Edge or Chrome installation found');

const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

const USER = { id: '1', name: 'Raj Roy', email: 'raj@example.com', role: 'user', avatar: '' };
const json = (body, status = 200) => () => ({ status, body });

async function open({ width = 1280, height = 900, token, blockStorage = false, reducedMotion, api = {} } = {}) {
  const context = await browser.newContext({
    viewport: { width, height },
    ...(reducedMotion ? { reducedMotion } : {}),
  });
  if (token) {
    await context.addInitScript((value) => window.localStorage.setItem('katha_token', value), token);
  }
  if (blockStorage) {
    await context.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
  }
  const page = await context.newPage();
  const problems = [];
  const calls = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR/.test(message.text())) {
      problems.push(`console: ${message.text()}`);
    }
  });
  await page.route('**/api/auth/*', async (route) => {
    const request = route.request();
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const key = `${request.method()} ${new URL(request.url()).pathname.split('/').pop()}`;
    calls.push({ key, body: request.postData(), auth: request.headers().authorization });
    const handler = api[key];
    if (!handler) return route.abort('connectionrefused');
    const { status, body } = handler();
    return route.fulfill({
      status,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  });
  return { page, context, problems, calls };
}

async function test(name, options, run) {
  const ctx = await open(options);
  try {
    await run(ctx);
    assert.deepEqual(ctx.problems, [], 'unexpected page or console errors');
    results.push(`PASS ${name}`);
  } catch (error) {
    results.push(`FAIL ${name} — ${String(error.message).split('\n')[0]}`);
    try {
      await ctx.page.screenshot({ path: path.join(SHOTS, `FAIL-${name.replace(/\W+/g, '-')}.png`) });
    } catch {
      // screenshot is best-effort
    }
  } finally {
    await ctx.context.close();
  }
}

const shot = (page, name, fullPage = true) => page.screenshot({ path: path.join(SHOTS, name), fullPage });
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const heading = (page) => page.getByRole('heading', { level: 1 });

async function fillLogin(page, email, password) {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
}

// ---------- pages render ----------
await test('home renders at 1280px', {}, async ({ page }) => {
  await page.goto(BASE);
  await heading(page).waitFor();
  assert.match(await heading(page).innerText(), /Every heritage begins with a\s+katha\./);
  await page.getByRole('link', { name: 'Join KATHA' }).first().waitFor();
  await shot(page, 'home-1280.png');
});

await test('home renders at 360px without horizontal overflow', { width: 360, height: 800 }, async ({ page }) => {
  await page.goto(BASE);
  await heading(page).waitFor();
  assert.ok(await noOverflow(page), 'horizontal overflow at 360px');
  await shot(page, 'home-360.png');
});

await test('mobile menu opens and closes with Escape', { width: 360, height: 800 }, async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile' }).waitFor();
  await page.screenshot({ path: path.join(SHOTS, 'menu-360.png') });
  await page.keyboard.press('Escape');
  await page.getByRole('navigation', { name: 'Mobile' }).waitFor({ state: 'hidden' });
});

await test('login and register pages render', {}, async ({ page }) => {
  await page.goto(`${BASE}/login`);
  assert.equal(await heading(page).innerText(), 'Welcome back');
  await shot(page, 'login-1280.png');
  await page.goto(`${BASE}/register`);
  assert.equal(await heading(page).innerText(), 'Create your account');
  await shot(page, 'register-1280.png');
});

await test('login and register at 360px', { width: 360, height: 800 }, async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await heading(page).waitFor();
  assert.ok(await noOverflow(page));
  await shot(page, 'login-360.png');
  await page.goto(`${BASE}/register`);
  await heading(page).waitFor();
  assert.ok(await noOverflow(page));
  await shot(page, 'register-360.png');
});

await test('unknown route shows the 404 page', {}, async ({ page }) => {
  await page.goto(`${BASE}/nope/deeper`);
  assert.equal(await heading(page).innerText(), 'This page has wandered off');
  await shot(page, 'notfound-1280.png', false);
});

await test('malformed URL hash does not crash', {}, async ({ page }) => {
  await page.goto(`${BASE}/#%E0%A4%A`);
  await heading(page).waitFor();
});

await test('reduced motion stops the hero mandala', { reducedMotion: 'reduce' }, async ({ page }) => {
  await page.goto(BASE);
  const name = await page.evaluate(() => getComputedStyle(document.querySelector('svg.animate-drift')).animationName);
  assert.equal(name, 'none');
});

// ---------- login ----------
await test('login blocks an empty submit', {}, async ({ page, calls }) => {
  await page.goto(`${BASE}/login`);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Enter your email address').waitFor();
  await page.getByText('Enter your password').waitFor();
  assert.equal(calls.length, 0, 'no request should be sent');
});

await test('login shows a friendly error when the API is unreachable', {}, async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await fillLogin(page, 'raj@example.com', 'secret1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText("Can't reach the server. Please try again.").waitFor();
  assert.ok(await page.getByRole('button', { name: 'Sign in' }).isEnabled(), 'button should re-enable');
});

await test('login shows invalid-credentials message', { api: { 'POST login': json({ error: 'x', code: 'INVALID_CREDENTIALS' }, 401) } }, async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await fillLogin(page, 'raj@example.com', 'wrong-pass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Invalid email or password.').waitFor();
  await shot(page, 'login-error-1280.png', false);
});

await test('login success trims email, keeps password spaces, signs in, persists token', { api: { 'POST login': json({ user: USER, token: 'tok-123' }) } }, async ({ page, calls }) => {
  await page.goto(`${BASE}/login`);
  await fillLogin(page, '  RAJ@Example.com  ', ' pa ss ');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(`${BASE}/`);
  await page.locator('header').getByText('Raj Roy').first().waitFor();
  const body = JSON.parse(calls.find((call) => call.key === 'POST login').body);
  assert.equal(body.email, 'RAJ@Example.com');
  assert.equal(body.password, ' pa ss ');
  assert.equal(await page.evaluate(() => localStorage.getItem('katha_token')), 'tok-123');
  await shot(page, 'home-signed-in-1280.png', false);
});

await test('double submit sends one login request', { api: { 'POST login': json({ user: USER, token: 't' }) } }, async ({ page, calls }) => {
  await page.goto(`${BASE}/login`);
  await fillLogin(page, 'raj@example.com', 'secret1');
  const button = page.getByRole('button', { name: 'Sign in' });
  await button.dblclick();
  await page.waitForURL(`${BASE}/`);
  assert.equal(calls.filter((call) => call.key === 'POST login').length, 1);
});

// ---------- register ----------
await test('register validations', {}, async ({ page, calls }) => {
  await page.goto(`${BASE}/register`);
  await page.getByLabel('Full name').fill('    ');
  await page.getByLabel('Email').fill('raj@example.com');
  await page.getByLabel('Password', { exact: true }).fill('abc');
  await page.getByLabel('Confirm password').fill('abd');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByText('Enter your name').waitFor();
  await page.getByText('Password must be at least 6 characters').waitFor();
  await page.getByText('Passwords do not match').waitFor();
  await page.getByLabel('Full name').fill('x'.repeat(101));
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByText('Name must be 100 characters or fewer').waitFor();
  assert.equal(calls.length, 0);
});

await test('register shows the duplicate-email message', { api: { 'POST register': json({ error: 'x', code: 'DUPLICATE_EMAIL' }, 409) } }, async ({ page }) => {
  await page.goto(`${BASE}/register`);
  await page.getByLabel('Full name').fill('Raj Roy');
  await page.getByLabel('Email').fill('raj@example.com');
  await page.getByLabel('Password', { exact: true }).fill('secret1');
  await page.getByLabel('Confirm password').fill('secret1');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByText('An account with this email already exists.').waitFor();
});

await test('register success signs in and redirects home', { api: { 'POST register': json({ user: USER, token: 'reg-1' }, 201) } }, async ({ page, calls }) => {
  await page.goto(`${BASE}/register`);
  await page.getByLabel('Full name').fill('  Raj Roy  ');
  await page.getByLabel('Email').fill('raj@example.com');
  await page.getByLabel('Password', { exact: true }).fill('secret1');
  await page.getByLabel('Confirm password').fill('secret1');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL(`${BASE}/`);
  await page.locator('header').getByText('Raj Roy').first().waitFor();
  const body = JSON.parse(calls.find((call) => call.key === 'POST register').body);
  assert.deepEqual(Object.keys(body).sort(), ['email', 'name', 'password']);
  assert.equal(body.name, 'Raj Roy');
});

// ---------- session restore ----------
await test('stale token: 401 clears the token and shows the guest UI', { token: 'garbage', api: { 'GET me': json({ error: 'x', code: 'UNAUTHORIZED' }, 401) } }, async ({ page }) => {
  await page.goto(BASE);
  await page.locator('header').getByRole('link', { name: 'Sign in' }).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('katha_token')), null);
});

await test('API down at startup keeps the token and shows the guest UI', { token: 'keep-me' }, async ({ page }) => {
  await page.goto(BASE);
  await page.locator('header').getByRole('link', { name: 'Sign in' }).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('katha_token')), 'keep-me');
});

await test('valid token restores the session and /login redirects home', { token: 'good', api: { 'GET me': json({ user: USER }) } }, async ({ page, calls }) => {
  await page.goto(`${BASE}/login`);
  await page.waitForURL(`${BASE}/`);
  await page.locator('header').getByText('Raj Roy').first().waitFor();
  assert.equal(calls.find((call) => call.key === 'GET me').auth, 'Bearer good');
});

await test('logout clears the session', { token: 'good', api: { 'GET me': json({ user: USER }) } }, async ({ page }) => {
  await page.goto(BASE);
  await page.getByRole('button', { name: 'Log out' }).click();
  await page.locator('header').getByRole('link', { name: 'Sign in' }).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem('katha_token')), null);
});

await test('long user name at 360px causes no horizontal overflow', { width: 360, height: 800, token: 'good', api: { 'GET me': json({ user: { ...USER, name: 'Very Long Name '.repeat(6).trim() } }) } }, async ({ page }) => {
  await page.goto(BASE);
  await heading(page).waitFor();
  assert.ok(await noOverflow(page), 'overflow with menu closed');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile' }).waitFor();
  assert.ok(await noOverflow(page), 'overflow with menu open');
  await page.screenshot({ path: path.join(SHOTS, 'menu-long-name-360.png') });
});

await test('blocked storage: app loads and login works for the tab', { blockStorage: true, api: { 'POST login': json({ user: USER, token: 'mem-only' }) } }, async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await heading(page).waitFor();
  await fillLogin(page, 'raj@example.com', 'secret1');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL(`${BASE}/`);
  await page.locator('header').getByText('Raj Roy').first().waitFor();
});

await browser.close();
console.log(results.join('\n'));
process.exit(results.some((line) => line.startsWith('FAIL')) ? 1 : 0);
```

- [ ] **Step 3: Static checks from the repo**

Run (from `client/`): `npm run lint`, `npm run build`, `npm run check`. Expected: all pass. Record the `vite build` bundle sizes.

- [ ] **Step 4: Start the dev server and run the browser check**

```bash
cd client
BROWSER=none npm run dev -- --port 5173 --strictPort > "<SCRATCH>/dev.log" 2>&1 &
```
Wait until `<SCRATCH>/dev.log` shows `Local:   http://localhost:5173/` (poll the file; do not sleep blindly). If port 5173 is busy, report BLOCKED and do not kill the other process. Then:

```bash
cd "<SCRATCH>"
SHOTS_DIR="<SCRATCH>/shots" node verify.mjs
```
Expected: one `PASS` line per check and exit code 0. Save the full output.

- [ ] **Step 5: Stop the dev server**

Kill only the dev-server process you started (by the PID you captured). Confirm port 5173 is free again.

- [ ] **Step 6: Report**

Write the report to the path given in your dispatch. Include: static-check results, bundle sizes, the full `PASS`/`FAIL` list, and the list of screenshot files in `<SCRATCH>\shots`. For every `FAIL`, include the failing check name and the matching `FAIL-*.png`. Do not fix anything and do not commit.
