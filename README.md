# Adhira Herbals — MERN eCommerce

Premium D2C Ayurvedic store. MongoDB + Express + React (Vite) + Node.

## Quick start

```bash
npm run install:all
cp server/.env.example server/.env   # edit MONGO_URI + JWT_SECRET
npm run seed                          # seeds products + admin user
npm run dev                           # client on :5173, server on :5000
```

Default admin (after seeding): `admin@adhiraherbals.com` / `Admin@123`

## Stack

- **Backend**: Express, Mongoose, JWT auth, bcrypt, Helmet, Morgan, express-rate-limit
- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Framer Motion, Zustand, Axios
- **Payments**: Mock gateway with Razorpay-compatible interface (swap real keys via env)

## Structure

```
adhira-herbals/
├── server/        # Express API
│   ├── src/
│   │   ├── config/        DB + env
│   │   ├── models/        Mongoose schemas
│   │   ├── controllers/   route handlers
│   │   ├── routes/        Express routers
│   │   ├── middleware/    auth, admin, errors
│   │   ├── services/      payment, mailer (stubs)
│   │   ├── seed/          seed script
│   │   └── server.js
│   └── .env.example
└── client/        # React app
    └── src/
        ├── api/           axios + endpoints
        ├── components/    shared UI
        ├── pages/         routed pages
        ├── store/         Zustand stores
        └── App.jsx
```

## API surface

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | user |
| GET | `/api/products` | public |
| GET | `/api/products/:slug` | public |
| POST | `/api/reviews/:productId` | user |
| GET | `/api/cart` | user |
| POST | `/api/cart` | user |
| PATCH | `/api/cart/:itemId` | user |
| DELETE | `/api/cart/:itemId` | user |
| POST | `/api/orders` | user |
| GET | `/api/orders/me` | user |
| POST | `/api/payments/create` | user |
| POST | `/api/payments/verify` | user |
| GET | `/api/admin/stats` | admin |
| CRUD | `/api/admin/products` | admin |
| GET | `/api/admin/orders` | admin |
| PATCH | `/api/admin/orders/:id/status` | admin |
| GET | `/api/admin/users` | admin |

## Swapping the mock payment for real Razorpay

Set `PAYMENT_PROVIDER=razorpay` in `server/.env` and add `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`. The service interface is identical; only the implementation behind `server/src/services/payment.js` changes.
