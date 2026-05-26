import { validationResult } from 'express-validator';
import { HttpError } from './error.js';

export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  next(new HttpError(400, 'Validation failed', errors.array()));
}
