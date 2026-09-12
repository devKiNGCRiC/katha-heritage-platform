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
