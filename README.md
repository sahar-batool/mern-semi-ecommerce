# MERN Semi E-Commerce

A full-stack e-commerce web app I built from a Software Requirements Specification (SRS), as a way to practice going from a written spec to a real, deployed product.

🔗 **Live demo:** https://mern-ecommerce-project-mauve.vercel.app
📄 **Tech stack:** React, Node.js, Express, MongoDB (MERN)

## What it does

It's a "semi" e-commerce app: you can browse products, register, log in, manage your profile, add items to a cart, check out, and track your orders. Admins can manage products and orders. There are no online payments yet (listed as a future improvement below). The focus was on getting the core architecture right: authentication, authorization, a clean API, and working user and admin flows.

**Guests can:**
- Browse all products, with search, filters, sorting and pagination
- View individual product details
- Register and log in

**Logged-in users can:**
- Everything a guest can do
- View and update their own profile
- Add products to a cart, change quantities and remove items
- Check out with shipping details and see an order confirmation
- View their order history and order details
- Cancel their own pending orders

**Admins can:**
- Create, update, and delete products
- View all registered users
- View all orders with customer details
- Update order status (pending, processing, shipped, delivered, cancelled)

## Features

- JWT-based authentication, with protected routes on both the frontend and backend
- Role-based access control (regular users vs admins)
- Product listing with pagination, category filtering, search, and sorting
- Shopping cart stored in the database, with a live item count in the navbar
- Orders store a snapshot of each item (name, price, image), so history stays correct if a product changes later
- Order totals are calculated on the server, never trusted from the client
- Stock handling: stock is checked and reduced when an order is placed, and restored when an order is cancelled
- Order status rules: only pending orders can be cancelled by the user, and delivered or cancelled orders are locked
- A centralized API layer on the frontend instead of scattered API calls
- Centralized error handling on the backend, with consistent error responses
- Passwords are hashed and never returned in any API response
- Responsive design, works on both desktop and mobile
- Session persistence (refreshing the page doesn't log you out) and auto-logout if your session expires

## API overview

| Module | Method | Endpoint | Access |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Public |
| Auth | POST | `/api/auth/login` | Public |
| Auth | GET | `/api/auth/me` | Protected |
| Products | GET | `/api/products` | Public |
| Products | GET | `/api/products/:id` | Public |
| Products | POST / PUT / DELETE | `/api/products`, `/api/products/:id` | Admin |
| Users | GET / PUT | `/api/users/me` | Protected |
| Users | GET | `/api/users`, `/api/users/:id` | Admin |
| Cart | GET | `/api/cart` | Protected |
| Cart | POST | `/api/cart` | Protected |
| Cart | PUT | `/api/cart` | Protected |
| Cart | DELETE | `/api/cart/:productId` | Protected |
| Cart | DELETE | `/api/cart` | Protected |
| Orders | POST | `/api/orders` | Protected |
| Orders | GET | `/api/orders/my` | Protected |
| Orders | GET | `/api/orders/:id` | Owner or admin |
| Orders | PUT | `/api/orders/:id/cancel` | Owner |
| Orders | GET | `/api/orders` | Admin |
| Orders | PUT | `/api/orders/:id/status` | Admin |

## Tech stack

**Frontend:** React, React Router, Axios, React Context, plain CSS
**Backend:** Node.js, Express, MongoDB with Mongoose
**Auth:** JWT, bcrypt for password hashing
**Deployment:** Vercel (frontend and backend together, as a serverless function)

## Running it locally

You'll need Node.js and a MongoDB database (local or Atlas).

**1. Clone the repo**

```
git clone https://github.com/sahar-batool/mern-semi-ecommerce.git
cd mern-semi-ecommerce
```

**2. Set up the backend**

```
cd server
npm install
```

Create a `.env` file in `server/` (use `.env.example` as a guide) with your own values:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_own_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Then run:

```
npm run dev
```

**3. Set up the frontend**

In a separate terminal:

```
cd client
npm install
```

Create a `.env` file in `client/` (use `.env.example` as a guide):

```
VITE_API_URL=http://localhost:5000/api
```

Then run:

```
npm run dev
```

**4. (Optional) Load sample products**

From the `server` folder:

```
node seeder.js
```

This loads 18 sample products across four categories (Electronics, Clothing, Accessories, Home), including one out-of-stock item to test the sold-out state. It only touches products, so existing users and orders are kept.

**5. Create an admin account**

Register a normal account through the app, then open your database and change that user's `role` from `"user"` to `"admin"`.

## What I learned

This project started as a straightforward build-from-spec exercise, but debugging taught me the most. A few real issues I had to work through:

- An Express 5 breaking change that crashed my CORS setup in production but not locally
- Getting a traditional Express app to run correctly as a Vercel serverless function
- Dependency resolution issues when splitting a frontend and backend into separate folders under one deployment
- A double-hashed password bug that locked an admin out, caused by a missing `isModified` check in the User model's pre-save hook
- A file-casing mismatch (`Models` vs `models`) that made Mongoose load the same model twice on Windows
- A doubled `/api` in request URLs that caused 404s between the React client and the API

Debugging these taught me more about how a Node app actually runs in production than writing the original code did.

## What's not included (on purpose)

Based on the original spec, this version intentionally leaves out: online payments, shipping integration, product reviews, wishlist, coupons, and email notifications. These are listed as possible future additions, not missing features.

## Future improvements

- Payment gateway integration
- Image upload instead of pasting image URLs
- Email verification and password reset
- Refresh tokens
- Order tracking and email notifications
- Admin dashboard with sales statistics