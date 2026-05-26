export function notFound(req, res, next) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const payload = {
    error: err.message || 'Server error',
  };
  if (err.errors) payload.details = err.errors;
  if (process.env.NODE_ENV !== 'production' && status >= 500) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) this.errors = details;
  }
}
