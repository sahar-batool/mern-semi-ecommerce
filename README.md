# MERN Semi E-Commerce

A full-stack e-commerce web app I built from a Software Requirements Specification (SRS), as a way to practice going from a written spec to a real, deployed product.

🔗 **Live demo:** https://mern-ecommerce-project-mauve.vercel.app
📄 **Tech stack:** React, Node.js, Express, MongoDB (MERN)

## What it does

It's a "semi" e-commerce app, meaning you can browse products, view details, register, log in, and manage your profile, but there's no cart or checkout yet (that's listed as a future improvement below). The focus was on getting the core architecture right: authentication, authorization, a clean API, and a working admin panel.

**Guests can:**
- Browse all products
- View individual product details
- Register and log in

**Logged-in users can:**
- View and update their own profile
- Everything a guest can do

**Admins can:**
- Create, update, and delete products
- View all registered users

## Features

- JWT-based authentication, with protected routes on both the frontend and backend
- Role-based access control (regular users vs admins)
- Product listing with pagination, category filtering, search, and sorting
- A centralized API layer on the frontend instead of scattered API calls
- Centralized error handling on the backend, with consistent error responses
- Passwords are hashed and never returned in any API response
- Responsive design, works on both desktop and mobile
- Session persistence (refreshing the page doesn't log you out) and auto-logout if your session expires

## Tech stack

**Frontend:** React, React Router, Axios, plain CSS
**Backend:** Node.js, Express, MongoDB with Mongoose
**Auth:** JWT, bcrypt for password hashing
**Deployment:** Vercel (frontend and backend together, as a serverless function)

## Running it locally

You'll need Node.js and a MongoDB database (local or Atlas).

**1. Clone the repo**
```bash
git clone https://github.com/sahar-batool/mern-semi-ecommerce.git
cd mern-semi-ecommerce
```

**2. Set up the backend**
```bash
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
```bash
npm run dev
```

**3. Set up the frontend**

In a separate terminal:
```bash
cd client
npm install
```
Create a `.env` file in `client/` (use `.env.example` as a guide):
```
VITE_API_URL=http://localhost:5000/api
```
Then run:
```bash
npm run dev
```

**4. (Optional) Load sample data**

From the `server` folder:
```bash
node seeder.js
```
This creates an admin account (`admin@example.com` / `admin123`) and a handful of sample products.

## What I learned

This project started as a straightforward build-from-spec exercise, but deployment turned out to be the most educational part. A few real issues I had to work through:

- An Express 5 breaking change that crashed my CORS setup in production but not locally
- Getting a traditional Express app to run correctly as a Vercel serverless function
- Dependency resolution issues when splitting a frontend and backend into separate folders under one deployment

Debugging these taught me more about how a Node app actually runs in production than writing the original code did.

## What's not included (on purpose)

Based on the original spec, this version intentionally leaves out: shopping cart, checkout, payments, order management, product reviews, and a few other things. These are listed as possible future additions, not missing features.

## Future improvements

- Shopping cart and checkout
- Image upload instead of pasting image URLs
- Email verification and password reset
- Refresh tokens