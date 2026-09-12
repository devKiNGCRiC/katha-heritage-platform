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

export { signToken, toSafeUser };
