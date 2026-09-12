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
