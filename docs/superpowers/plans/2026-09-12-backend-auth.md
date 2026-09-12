# Backend Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add email/password authentication (register, login, get-current-user) to the KATHA backend, backed by JWTs, with a test harness that runs against an isolated in-memory MongoDB.

**Architecture:** Split the existing `server/server.js` into `server/app.js` (pure Express app, importable by tests without starting a real server or hitting the real database) and a slimmer `server/server.js` (DB connect + `listen`). Then build auth as three layers — `middleware/` (JWT check, validation-error formatting), `controllers/` (business logic against the existing `User` model), `routes/` (wiring) — driven by Jest + Supertest tests against `app.js`.

**Tech Stack:** Node.js (ESM, `"type": "module"`), Express, Mongoose, jsonwebtoken, express-validator, bcryptjs (already used by the `User` model), Jest, Supertest, mongodb-memory-server (new).

**Spec:** `docs/superpowers/specs/2026-09-12-backend-auth-design.md`

## Global Constraints

- Email/password only — no OAuth, no 2FA, no email verification, no refresh tokens in this slice (spec: "Decisions").
- JWT expiry is a flat `7d`; payload is `{ id, role }` (spec: "JWT & Middleware").
- API responses never include the `password` field, even internally logged ones (spec: "Endpoints").
- Reuse the existing `User` model's bcrypt `pre('save')` hook and `comparePassword` method — do not hash or compare passwords manually anywhere in new code (spec: "Architecture").
- Error responses always have the shape `{ error: string, code: string }` (optionally `details` for validation), matching the existing global error handler in `server.js`/`app.js` (spec: "Error Handling").
- Dev environment is Windows. Jest ESM runs must invoke `node_modules/jest/bin/jest.js` directly with `node --experimental-vm-modules` — do NOT use `node_modules/.bin/jest`, which is a shell shim that doesn't run reliably from `node` on Windows.
- **Do not run any git commands (`git add`, `git commit`, etc.) at any point in this plan.** The project owner commits changes themselves. Every task ends by naming the changed files instead of a commit step.

---

## Task 1: Split `server.js` into `app.js` + `server.js` (testability refactor)

**Files:**
- Create: `server/app.js`
- Modify: `server/server.js` (replace entirely)

**Interfaces:**
- Produces: `app.js` exports a configured Express `app` as its default export, with no side effects (no DB connection, no `listen()`). All later tasks import `app` from here for Supertest.

This is a pure refactor of already-working code — no new behavior, so there's no failing test to write first. Verify by manually confirming the server still boots identically to before.

- [ ] **Step 1: Create `server/app.js`**

```js
// 🚀 KATHA Heritage Platform - Express App Configuration
// 🎯 Purpose: Builds and configures the Express app (no listening, no DB connect)
// 📚 Kept separate from server.js so tests can import `app` without starting a real server

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import dbManager from './utils/database.js';

dotenv.config();

const app = express();

// 🛡️ Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"]
    }
  }
}));

// 🌐 CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://katha.vercel.app', 'https://www.katha.in']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ⚡ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

// 📝 Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 📊 Basic Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🚀 Root Route
app.get('/', (req, res) => {
  res.json({
    message: '🙏 Namaste! Welcome to KATHA Heritage Platform API',
    version: '1.0.0',
    status: 'active',
    features: [
      '🏛️ Indian Heritage Stories',
      '🗺️ Interactive Cultural Maps',
      '👥 Community Features',
      '🤖 AI-Powered Recommendations',
      '📱 Progressive Web App'
    ],
    developer: 'RKC_BHARAT Initiative',
    timestamp: new Date().toISOString()
  });
});

// 🔍 Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    database: dbManager.getStatus()
  });
});

// 📝 API Routes (auth routes are added here in Task 5)
// app.use('/api/auth', authRoutes);

// 🚨 Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString()
  });
});

// 🔍 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

export default app;
```

- [ ] **Step 2: Replace `server/server.js`**

```js
// 🚀 KATHA Heritage Platform - Server Entry Point
// 🎯 Purpose: Connects to the database and starts the HTTP server

import app from './app.js';
import dbManager from './utils/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  dbManager.setupEventListeners();
  await dbManager.connect();

  if (dbManager.isConnected) {
    await dbManager.createIndexes();
  }

  app.listen(PORT, () => {
    console.log('🚀 KATHA Heritage Platform Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`📱 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Ready for KATHA development!');
    console.log('🙏 Jai Hind! Let\'s build something amazing!');
  });
};

// 🎯 Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  await dbManager.disconnect();
  process.exit(0);
});

startServer();

export default app;
```

- [ ] **Step 3: Verify the server still boots the same as before**

Run (from `server/`): `npm run dev`
Expected: the same startup log lines as before (`🚀 KATHA Heritage Platform Server Started!`, etc.), and the process connects to MongoDB Atlas exactly as it did prior to this refactor.

In a second terminal, run: `curl http://localhost:5000/` and `curl http://localhost:5000/api/health`
Expected: identical JSON shape to what these two routes returned before the refactor (same `message`, `status`, `database` object).

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 4: Task complete**

Files changed: `server/app.js` (new), `server/server.js` (replaced). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 2: Test infrastructure (mongodb-memory-server + Jest ESM config)

**Files:**
- Create: `server/jest.config.js`
- Create: `server/tests/env.setup.js`
- Create: `server/tests/setup.js`
- Create: `server/tests/db-setup.test.js`
- Modify: `server/package.json` (devDependency + `test` script)

**Interfaces:**
- Produces: `connectTestDB()`, `clearTestDB()`, `closeTestDB()` exported from `server/tests/setup.js` — every later test file imports these three functions.
- Produces: `process.env.JWT_SECRET` is set to a fixed test value before any test file's imports run (via `env.setup.js`), so middleware/controller code can rely on `process.env.JWT_SECRET` existing in tests without touching `server/.env`.

- [ ] **Step 1: Install the in-memory MongoDB package**

Run (from `server/`): `npm install --save-dev mongodb-memory-server`
Expected: `server/package.json` now lists `mongodb-memory-server` under `devDependencies`, and `server/package-lock.json` is updated.

- [ ] **Step 2: Create `server/tests/env.setup.js`**

```js
process.env.JWT_SECRET = 'test-jwt-secret-for-katha-tests-only';
process.env.NODE_ENV = 'test';
```

- [ ] **Step 3: Create `server/jest.config.js`**

```js
export default {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/env.setup.js'],
  testTimeout: 20000
};
```

(`testTimeout` is raised from Jest's 5s default because `mongodb-memory-server` downloads a MongoDB binary on its first run, which can be slow.)

- [ ] **Step 4: Create `server/tests/setup.js`**

```js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

export async function connectTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

export async function clearTestDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function closeTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
}
```

- [ ] **Step 5: Update the `test` script in `server/package.json`**

Change:
```json
"test": "jest"
```
to:
```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand"
```

(`--runInBand` avoids multiple parallel Jest workers each starting their own `mongodb-memory-server` instance, which is unnecessary overhead for this small suite.)

- [ ] **Step 6: Write the harness verification test — `server/tests/db-setup.test.js`**

```js
import mongoose from 'mongoose';
import models from '../models/index.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';

const { User } = models;

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('test database harness', () => {
  test('connects to an in-memory MongoDB instance', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('can create and read a User document', async () => {
    const user = await User.create({
      name: 'Harness Tester',
      email: 'harness@test.com',
      password: 'password123'
    });

    const found = await User.findById(user._id);
    expect(found.email).toBe('harness@test.com');
  });
});
```

- [ ] **Step 7: Run the test and confirm it passes**

Run (from `server/`): `npm test`
Expected: `db-setup.test.js` — 2 passed. (First run may take longer while `mongodb-memory-server` downloads its binary; this is normal and only happens once.)

- [ ] **Step 8: Task complete**

Files changed: `server/jest.config.js` (new), `server/tests/env.setup.js` (new), `server/tests/setup.js` (new), `server/tests/db-setup.test.js` (new), `server/package.json` (modified). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 3: JWT authentication middleware

**Files:**
- Create: `server/middleware/auth.js`
- Test: `server/tests/auth-middleware.test.js`

**Interfaces:**
- Consumes: `process.env.JWT_SECRET` (set by `tests/env.setup.js` in tests, by `.env` in real runs).
- Produces: `authenticate(req, res, next)` — on a valid `Authorization: Bearer <token>` header, sets `req.user = { id, role }` (the decoded JWT payload) and calls `next()`. Task 7's `GET /api/auth/me` route consumes this exact function name and behavior.

- [ ] **Step 1: Write the failing test — `server/tests/auth-middleware.test.js`**

```js
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/auth.js';

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authenticate middleware', () => {
  test('calls next() and attaches req.user for a valid token', () => {
    const token = jwt.sign({ id: 'user123', role: 'user' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('user123');
  });

  test('returns 401 when no authorization header is present', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 for an invalid token', () => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' } };
    const res = mockRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- auth-middleware`
Expected: FAIL — `Cannot find module '../middleware/auth.js'`

- [ ] **Step 3: Create `server/middleware/auth.js`**

```js
import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No authentication token provided',
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid or expired token',
      code: 'UNAUTHORIZED'
    });
  }
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- auth-middleware`
Expected: PASS — 3 passed.

- [ ] **Step 5: Task complete**

Files changed: `server/middleware/auth.js` (new), `server/tests/auth-middleware.test.js` (new). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 4: Validation-error middleware

**Files:**
- Create: `server/middleware/validate.js`
- Test: `server/tests/validate-middleware.test.js`

**Interfaces:**
- Produces: `validate(req, res, next)` — an Express middleware placed after `express-validator` check chains. If any checks failed, responds `400 { error, code: 'VALIDATION_ERROR', details: [{ field, message }] }`; otherwise calls `next()`. Tasks 5 and 6 consume this exact function name in their route validator chains.

- [ ] **Step 1: Write the failing test — `server/tests/validate-middleware.test.js`**

```js
import express from 'express';
import request from 'supertest';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';

function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.post(
    '/test',
    [body('name').notEmpty().withMessage('Name is required')],
    validate,
    (req, res) => res.status(200).json({ ok: true })
  );
  return app;
}

describe('validate middleware', () => {
  test('passes through when validation succeeds', async () => {
    const app = buildTestApp();
    const res = await request(app).post('/test').send({ name: 'Raj' });
    expect(res.status).toBe(200);
  });

  test('returns 400 with details when validation fails', async () => {
    const app = buildTestApp();
    const res = await request(app).post('/test').send({});
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.details[0].field).toBe('name');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- validate-middleware`
Expected: FAIL — `Cannot find module '../middleware/validate.js'`

- [ ] **Step 3: Create `server/middleware/validate.js`**

```js
import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }

  next();
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npm test -- validate-middleware`
Expected: PASS — 2 passed.

- [ ] **Step 5: Task complete**

Files changed: `server/middleware/validate.js` (new), `server/tests/validate-middleware.test.js` (new). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 5: Register endpoint

**Files:**
- Create: `server/controllers/authController.js`
- Create: `server/routes/authRoutes.js`
- Modify: `server/app.js` (mount the auth routes)
- Create: `server/tests/auth.test.js`

**Interfaces:**
- Consumes: `validate` from `server/middleware/validate.js` (Task 4); the `User` model from `server/models/index.js` (pre-existing — has bcrypt hashing built in).
- Produces: `register(req, res, next)` exported from `authController.js`. `POST /api/auth/register` mounted at `/api/auth/register`. Later tasks (6, 7) add more exports to this same controller file and more routes to this same router file.

- [ ] **Step 1: Write the failing test — `server/tests/auth.test.js`**

```js
import request from 'supertest';
import app from '../app.js';
import models from '../models/index.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';

const { User } = models;

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe('POST /api/auth/register', () => {
  test('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Raj Roy',
      email: 'raj@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('raj@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  test('rejects a duplicate email', async () => {
    await User.create({ name: 'Existing', email: 'raj@example.com', password: 'password123' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Raj Roy',
      email: 'raj@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('DUPLICATE_EMAIL');
  });

  test('rejects invalid input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'not-an-email',
      password: '123'
    });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- auth.test`
Expected: FAIL — `Cannot find module '../routes/authRoutes.js'` (once routes exist but aren't mounted, expect 404s instead; either way, it must fail before Steps 3-4).

- [ ] **Step 3: Create `server/controllers/authController.js`**

```js
// server/controllers/authController.js
import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const { User } = models;

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email already exists',
        code: 'DUPLICATE_EMAIL'
      });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);

    return res.status(201).json({ user: toSafeUser(user), token });
  } catch (error) {
    next(error);
  }
}

export { signToken, toSafeUser };
```

- [ ] **Step 4: Create `server/routes/authRoutes.js`**

```js
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  register
);

export default router;
```

- [ ] **Step 5: Mount the auth routes in `server/app.js`**

Add near the top, with the other imports:
```js
import authRoutes from './routes/authRoutes.js';
```

Replace this line:
```js
// 📝 API Routes (auth routes are added here in Task 5)
// app.use('/api/auth', authRoutes);
```
with:
```js
// 📝 API Routes
app.use('/api/auth', authRoutes);
```

- [ ] **Step 6: Run the test and verify it passes**

Run: `npm test -- auth.test`
Expected: PASS — 3 passed.

- [ ] **Step 7: Task complete**

Files changed: `server/controllers/authController.js` (new), `server/routes/authRoutes.js` (new), `server/app.js` (modified), `server/tests/auth.test.js` (new). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 6: Login endpoint

**Files:**
- Modify: `server/controllers/authController.js` (add `login`)
- Modify: `server/routes/authRoutes.js` (add `POST /login`)
- Modify: `server/tests/auth.test.js` (add a `describe` block)

**Interfaces:**
- Consumes: `signToken`, `toSafeUser` (defined in Task 5, same file); `User.comparePassword` (pre-existing on the model).
- Produces: `login(req, res, next)` exported from `authController.js`. `POST /api/auth/login`.

- [ ] **Step 1: Add the failing test to `server/tests/auth.test.js`**

Add this `describe` block after the existing `POST /api/auth/register` block (same file, same top-level `beforeAll`/`afterEach`/`afterAll`):

```js
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await User.create({ name: 'Raj Roy', email: 'raj@example.com', password: 'password123' });
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'raj@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('raj@example.com');
  });

  test('rejects an incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'raj@example.com',
      password: 'wrong-password'
    });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  test('rejects a login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'raj@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- auth.test`
Expected: FAIL — the new `POST /api/auth/login` tests fail with 404 (route doesn't exist yet). The existing register tests should still pass.

- [ ] **Step 3: Add `login` to `server/controllers/authController.js`**

Add this export alongside `register` (after it, in the same file):

```js
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = signToken(user);
    return res.status(200).json({ user: toSafeUser(user), token });
  } catch (error) {
    next(error);
  }
}
```

- [ ] **Step 4: Add the login route to `server/routes/authRoutes.js`**

Add this import to the top of the file (alongside `register`):
```js
import { register, login } from '../controllers/authController.js';
```
(replace the existing `import { register } from '../controllers/authController.js';` line with this one)

Add this route after the `/register` route:
```js
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test -- auth.test`
Expected: PASS — 6 passed (3 register + 3 login).

- [ ] **Step 6: Task complete**

Files changed: `server/controllers/authController.js` (modified), `server/routes/authRoutes.js` (modified), `server/tests/auth.test.js` (modified). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 7: Get-current-user endpoint (`GET /api/auth/me`)

**Files:**
- Modify: `server/controllers/authController.js` (add `getMe`)
- Modify: `server/routes/authRoutes.js` (add protected `GET /me`)
- Modify: `server/tests/auth.test.js` (add a `describe` block)

**Interfaces:**
- Consumes: `authenticate` from `server/middleware/auth.js` (Task 3) — attaches `req.user.id`.
- Produces: `getMe(req, res, next)` exported from `authController.js`. `GET /api/auth/me` (protected).

- [ ] **Step 1: Add the failing test to `server/tests/auth.test.js`**

Add this `describe` block after the `POST /api/auth/login` block:

```js
describe('GET /api/auth/me', () => {
  test('returns the current user for a valid token', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Raj Roy',
      email: 'raj@example.com',
      password: 'password123'
    });

    const token = registerRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('raj@example.com');
  });

  test('rejects a request without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- auth.test`
Expected: FAIL — the new `GET /api/auth/me` tests fail with 404. Register/login tests still pass.

- [ ] **Step 3: Add `getMe` to `server/controllers/authController.js`**

Add this export alongside `register` and `login`:

```js
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({
        error: 'User no longer exists',
        code: 'UNAUTHORIZED'
      });
    }

    return res.status(200).json({ user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
}
```

- [ ] **Step 4: Add the protected route to `server/routes/authRoutes.js`**

Add this import at the top of the file:
```js
import { authenticate } from '../middleware/auth.js';
```

Update the controller import line to include `getMe`:
```js
import { register, login, getMe } from '../controllers/authController.js';
```

Add this route after `/login`:
```js
router.get('/me', authenticate, getMe);
```

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test -- auth.test`
Expected: PASS — 8 passed (3 register + 3 login + 2 me).

- [ ] **Step 6: Run the entire test suite**

Run: `npm test`
Expected: all test files pass — `db-setup.test.js`, `auth-middleware.test.js`, `validate-middleware.test.js`, `auth.test.js`.

- [ ] **Step 7: Task complete**

Files changed: `server/controllers/authController.js` (modified), `server/routes/authRoutes.js` (modified), `server/tests/auth.test.js` (modified). Do not run git commands — leave these changes for the project owner to review and commit.

---

## Task 8: End-to-end manual verification against the real dev server

**Files:** None (verification only — no code changes).

**Interfaces:** None.

- [ ] **Step 1: Start the real dev server**

Run (from `server/`): `npm run dev`
Expected: the same startup banner as Task 1, connected to your real MongoDB Atlas database (make sure `server/.env` has a valid `MONGODB_URI` and `JWT_SECRET` set — these are separate from the test values in `tests/env.setup.js`).

- [ ] **Step 2: Register a real user via curl**

Run:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Raj Roy","email":"raj.manual.test@example.com","password":"password123"}'
```
Expected: `201` response with a `user` object (no `password` field) and a `token` string. Copy the token value for the next step.

- [ ] **Step 3: Log in with the same credentials**

Run:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"raj.manual.test@example.com","password":"password123"}'
```
Expected: `200` response with a fresh `token`.

- [ ] **Step 4: Fetch the current user with the token**

Run (replace `<token>` with the value from Step 2 or 3):
```bash
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <token>"
```
Expected: `200` response with the same user's `name` and `email`.

- [ ] **Step 5: Confirm the 401 path**

Run: `curl http://localhost:5000/api/auth/me`
Expected: `401` response with `code: "UNAUTHORIZED"`.

- [ ] **Step 6: Stop the dev server**

Press Ctrl+C in the terminal running `npm run dev`.

- [ ] **Step 7: Task complete**

No files changed. This task confirms the full slice works end-to-end against real infrastructure, not just the test suite. Auth backend is done — next slice per the roadmap is Stories CRUD.
