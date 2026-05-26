import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(409, 'An account with that email already exists');
  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();
  res.status(201).json({ user: user.toSafeJSON(), token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new HttpError(401, 'Invalid email or password');
  const ok = await user.comparePassword(password);
  if (!ok) throw new HttpError(401, 'Invalid email or password');
  res.json({ user: user.toSafeJSON(), token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  await req.user.save();
  res.json({ user: req.user.toSafeJSON() });
});

export const addAddress = asyncHandler(async (req, res) => {
  const addr = req.body;
  if (addr.isDefault) {
    req.user.addresses.forEach((a) => (a.isDefault = false));
  }
  req.user.addresses.push(addr);
  await req.user.save();
  res.status(201).json({ user: req.user.toSafeJSON() });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  req.user.addresses = req.user.addresses.filter((a) => a._id.toString() !== req.params.id);
  await req.user.save();
  res.json({ user: req.user.toSafeJSON() });
});
