import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import transporter from '../utils/email.js';


export async function registerUser(userData) {
  const { email } = userData;
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    error.errors = ['Email already registered'];
    throw error;
  }
  const user = await User.create(userData);
  return user;
}


export async function authenticateUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.errors = ['Invalid credentials'];
    throw error;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    error.errors = ['Invalid credentials'];
    throw error;
  }
  return user;
}