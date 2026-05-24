# ShopCart E-Commerce Project

ShopCart is a full-stack e-commerce demo project with a React frontend, Express backend, MongoDB database, seeded products, demo users, cart, wishlist, checkout, orders, and admin management.

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT with cookies
- Tooling: npm, Nodemon, Concurrently

## Requirements

Install these before running the project:

- Node.js 18 or newer
- npm
- MongoDB Community Server
- Git

MongoDB must be running locally before starting the backend.

Default MongoDB URL:

```text
mongodb://127.0.0.1:27017/shopcart
```

## Quick Start

Clone the project:

```bash
git clone <your-github-repo-url>
cd <repo-folder>
```

Install dependencies:

```bash
npm install
npm run install:all
```

Create the backend environment file.

Windows:

```bash
copy Backend\.env.example Backend\.env
```

macOS/Linux:

```bash
cp Backend/.env.example Backend/.env
```

Seed the database with sample data:

```bash
npm run seed:full
```

Run the project:

```bash
npm run dev
```

Open the app:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

Important:

- Use `http://localhost:5173` in the browser for the website.
- `http://localhost:8000` is only the backend API. API URLs can display JSON in the browser.
- In development, frontend API calls use the Vite proxy prefix `/api`, so refreshing React routes like `/products`, `/cart`, or `/admin/products` should keep showing the website instead of backend JSON.

## Demo Accounts

Admin:

```text
Email: admin@shopcart.com
Password: Admin@123
```

User:

```text
Email: user@shopcart.com
Password: User@123
```

## Seeded Data

Running `npm run seed:full` creates:

- 12 sample products
- 19 categories
- 5 brands
- Admin demo account
- User demo account
- User cart with 2 items
- User wishlist with 2 items
- User order history with 3 orders

## Available Scripts

Run from the project root.

Install backend and frontend dependencies:

```bash
npm run install:all
```

Start backend and frontend together:

```bash
npm run dev
```

Start only backend:

```bash
npm run dev:backend
```

Start only frontend:

```bash
npm run dev:frontend
```

Seed missing data only:

```bash
npm run seed
```

Reset demo users, orders, cart, and wishlist:

```bash
npm run seed:reset
```

Reset all sample catalog and demo data:

```bash
npm run seed:full
```

Build frontend:

```bash
npm run build
```

Run project verification:

```bash
npm run verify
```

`npm run verify` runs a full seed and then builds the frontend.

## Environment Setup

The backend uses `Backend/.env`.

Default local values are already provided in `Backend/.env.example`:

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/shopcart
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
CLIENT_URL=
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
MAIL_ID=
MAIL_PASSWORD=
```

Email settings are optional. Checkout works without email credentials. Password reset email requires valid `MAIL_ID` and `MAIL_PASSWORD`.

The frontend uses Vite proxy in development. You usually do not need to edit frontend env files.

## Manual Test Flow

User flow:

1. Open http://localhost:5173
2. Log in as `user@shopcart.com` / `User@123`
3. Browse products
4. Search, filter, and sort products
5. Add/remove wishlist items
6. Add/reduce/remove cart items
7. Go to checkout
8. Use the seeded address
9. Place an order
10. Confirm the new order appears in My Orders
11. Update profile information

Admin flow:

1. Log in as `admin@shopcart.com` / `Admin@123`
2. Open admin products
3. Confirm admin can see active and deleted products
4. Edit a product
5. Create a product
6. Open admin orders
7. Edit order status and payment status

## Common Problems

### MongoDB connection error

Make sure MongoDB is running locally.

Check that `Backend/.env` contains:

```env
MONGO_URI=mongodb://127.0.0.1:27017/shopcart
```

### Login does not work

Reset demo data:

```bash
npm run seed:full
```

Then use the exact demo credentials:

```text
admin@shopcart.com / Admin@123
user@shopcart.com / User@123
```

### Port already in use

Default ports:

- Frontend: `5173`
- Backend: `8000`

Stop old dev servers before running:

```bash
npm run dev
```

### Products are missing

Run:

```bash
npm run seed:full
```

## Notes For Developers

- Do not commit `Backend/.env`.
- Use `Backend/.env.example` for shared local defaults.
- Run `npm run verify` before submitting changes.
- This project is intended for local development and feature testing.

