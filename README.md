# CHEDI CSA Member App — Frontend

React 19 + Vite SPA integrated with `chediwebapp_backend`.

## Quick start

```bash
# Terminal 1 — API (needs MongoDB, or use in-memory for local demo)
cd chediwebapp_backend
npm install
npm run dev:memory   # or: npm run seed && npm run dev  (with local Mongo)

# Terminal 2 — UI
cd clcode
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` → `http://127.0.0.1:4000`.

## Demo login

| Field | Value |
|-------|--------|
| Email | `divya.nair@example.com` (or any seeded member email) |
| OTP | `1234` (returned in OTP API responses when `ALLOW_DEMO_OTP=true`) |

## Payments

Checkout no longer uses card or net banking. Members submit a **payment request**; admins collect payment offline and mark it Paid at `http://localhost:4000/admin` (key: `chedi-admin-demo`).

## Integration notes

- API client: `src/api/` + session tokens in `localStorage`
- App state / flows: `src/hooks/useChediApp.jsx`
- Client validation: `src/lib/validation.js`
- Catalogs, membership, payments, deliveries, settings all call live backend endpoints
- Dummy OTP + dummy payment gateway are backend-only and intended for non-production
