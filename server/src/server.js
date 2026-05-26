import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(helmet());
// CLIENT_URL: comma-separated list. Each entry can be a literal URL OR a wildcard
// pattern like "https://*.vercel.app" (covers production + branch + deploy previews).
const allowedPatterns = env.clientUrl.split(',').map((s) => s.trim()).filter(Boolean);

function originAllowed(origin) {
  if (!origin) return true; // server-to-server / curl / health check
  return allowedPatterns.some((pat) => {
    if (!pat.includes('*')) return pat === origin;
    // Convert wildcard to regex: escape, then turn \* into .+
    const re = new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.+') + '$');
    return re.test(origin);
  });
}

app.use(
  cors({
    origin: (origin, cb) => cb(null, originAllowed(origin)),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

// Light rate-limit on auth endpoints to discourage brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, env: env.nodeEnv, payment: env.paymentProvider })
);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`[api] listening on http://localhost:${env.port}  (payment: ${env.paymentProvider})`);
    });
  } catch (err) {
    console.error('[fatal] failed to start server:', err.message);
    process.exit(1);
  }
}

start();
