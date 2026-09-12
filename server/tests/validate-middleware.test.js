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
