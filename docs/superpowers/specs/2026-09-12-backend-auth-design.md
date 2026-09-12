# Backend Authentication — Design

**Date:** 2026-09-12
**Status:** Approved
**Scope:** First backend subsystem for KATHA — email/password authentication with JWT.

## Context

The backend currently has an Express bootstrap (`server/server.js`), a MongoDB connection manager (`server/utils/database.js`), and complete Mongoose models (`server/models/index.js`: `User`, `Story`, `Place`, `Comment`), but no routes or controllers exist yet. Auth-related imports in `server.js` are commented out. Stories require an `author` (a `User` ref), so authentication is the first subsystem to build.

## Decisions

- **Auth methods:** Email/password only. `googleId`/`facebookId`/`githubId` fields stay in the `User` schema for future use, but no OAuth routes are built now.
- **Token strategy:** A single JWT returned in the response body (not httpOnly cookies, no refresh token pair). Frontend is responsible for storing and attaching it as a Bearer token.
- **Out of scope for this slice:** OAuth (Google/Facebook/GitHub), 2FA (speakeasy), email verification, refresh tokens, per-user rate limiting beyond the existing global limiter.

These choices favor simplicity for a learning-stage MVP over production-grade hardening. Revisiting any of them later (e.g. adding refresh tokens or OAuth) is expected and does not require re-architecting this slice — the JWT middleware and controller structure below accommodate it.

## Architecture

New directories:
- `server/routes/` — Express routers
- `server/controllers/` — request handlers (business logic, calls into models)
- `server/middleware/` — cross-cutting concerns (auth check, validation)

`server/server.js` is split into `server/app.js` (pure Express app config — no DB connect, no `listen()`) and a slim `server/server.js` (imports `app`, connects the DB, calls `listen()`). This split is what makes the "Testing" section below possible: Supertest needs to import the configured `app` without triggering a real database connection or opening a real port. `app.js` mounts:
```js
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);
```

## Endpoints

| Method | Path | Auth required | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ name, email, password }` | `201 { user, token }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `200 { user, token }` |
| GET | `/api/auth/me` | Yes (Bearer token) | — | `200 { user }` |

`user` objects never include the `password` field (the schema already has `select: false` on it; controllers must not override that with `.select('+password')` except internally during login, where it's stripped before responding).

## JWT & Middleware

`server/middleware/auth.js`:
- Reads `Authorization: Bearer <token>` header.
- Verifies with `jwt.verify(token, process.env.JWT_SECRET)`.
- On success, attaches `req.user = { id, email, role }` (decoded payload) and calls `next()`.
- On missing/invalid/expired token, responds `401 { error, code: 'UNAUTHORIZED' }`.

Token payload: `{ id: user._id, role: user.role }`. Expiry: `7d` (constant in the controller, easy to change later — not over-engineered into a config system yet).

## Validation

`server/middleware/validate.js` wraps `express-validator` result-checking into a reusable middleware. Per-route validators (defined alongside the routes):
- **Register:** `name` non-empty (≤100 chars), `email` valid format, `password` ≥ 6 chars.
- **Login:** `email` and `password` both present.

Mongoose schema validation remains the second line of defense (e.g. `unique: true` on email surfaces as a duplicate-key error, which the controller maps to a `409`).

## Error Handling

Reuses the existing global error handler in `server.js` — controllers throw or `next(err)` with `err.status` and `err.code` set:
- `400 VALIDATION_ERROR` — express-validator failures.
- `401 INVALID_CREDENTIALS` — login with wrong email/password.
- `401 UNAUTHORIZED` — missing/invalid/expired token on `/me`.
- `409 DUPLICATE_EMAIL` — register with an email already in use.
- `500 INTERNAL_SERVER_ERROR` — unexpected failures (already handled generically).

## Testing

Adds `mongodb-memory-server` as a dev dependency so tests run against an isolated in-memory MongoDB instance instead of the real Atlas database. `server/tests/auth.test.js` (Jest + Supertest) covers:
1. Register succeeds and returns a token.
2. Register with a duplicate email is rejected (409).
3. Register with invalid input is rejected (400).
4. Login succeeds with correct credentials.
5. Login fails with wrong password (401).
6. `GET /api/auth/me` succeeds with a valid token.
7. `GET /api/auth/me` fails without a token (401).

## Files Added/Changed

- `server/app.js` (new — Express app extracted from `server.js` for testability)
- `server/server.js` (replaced — now only DB connect + `listen()`)
- `server/routes/authRoutes.js` (new)
- `server/controllers/authController.js` (new)
- `server/middleware/auth.js` (new)
- `server/middleware/validate.js` (new)
- `server/tests/setup.js`, `server/tests/env.setup.js`, `server/jest.config.js` (new — test harness)
- `server/tests/auth.test.js`, `server/tests/auth-middleware.test.js`, `server/tests/validate-middleware.test.js`, `server/tests/db-setup.test.js` (new)
- `server/package.json` (add `mongodb-memory-server` devDependency, update `test` script for ESM)
