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
