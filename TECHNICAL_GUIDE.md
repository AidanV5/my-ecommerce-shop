# ShopEasy Technical Documentation

## Overview
ShopEasy is a full-stack e-commerce application built with:
*   **Frontend**: React (Vite), Tailwind-like CSS variables, Framer Motion, Swiper.
*   **Backend**: Node.js, Express.
*   **Database**: SQLite (via `better-sqlite3`).
*   **Authentication**: JWT (JSON Web Tokens).

---

## 📂 Project Structure

```
Project/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (Theme)
│   │   ├── pages/          # Route views
│   │   ├── api.js          # Axios configuration
│   │   ├── App.jsx         # Main Router setup
│   │   └── index.css       # Global styles & variables
├── server/                 # Express Backend
│   ├── src/
│   │   ├── db/             # Database connection & seeds
│   │   ├── middleware/     # Auth & Admin checks
│   │   ├── routes/         # API Endpoints
│   │   └── app.js          # Server entry point
└── package.json            # Root configuration
```

---

## 🛠 Backend Architecture (`server/`)

### 1. Database (`src/db/database.js`)
We use **SQLite** for a zero-configuration relational database.
*   **Tables**:
    *   `users`: Stores `username`, hashed `password`, and `role` ('user' or 'admin').
    *   `products`: Stores `name`, `price`, `stock`, `category`, etc.
    *   `cart_items`: Links `users` to `products` with a `quantity`.
*   **Initialization**: The file automatically creates tables and seeds initial data if empty.

### 2. Authentication (`src/routes/authRoutes.js`)
*   **Register** (`POST /register`): Hashes password using `bcryptjs` and saves user.
*   **Login** (`POST /login`): Compares hash. If valid, signs a **JWT** containing `{ id, username, role }`.
    *   *Security Note*: Passwords are never stored in plain text.

### 3. Middleware (`src/middleware/admin.js`)
*   `isAdmin`: Checks `req.user.role`. If not 'admin', returns 403 Forbidden.
*   Used to protect sensitive routes like creating/editing products.

### 4. API Routes
*   **Products** (`src/routes/productRoutes.js`):
    *   `GET /`: List all products. Supports `?category=Name`.
    *   `POST /` (Admin): Create new product.
    *   `PUT /:id` (Admin): Update product details & stock.
*   **Cart** (`src/routes/cartRoutes.js`):
    *   Uses `authenticateToken` middleware to ensure only logged-in users access their cart.
    *   `POST /`: Adds item. **Checks Stock** before adding.
    *   `GET /`: Retrieves user's cart items.

---

## 💻 Frontend Architecture (`client/`)

### 1. Core Logic
*   **`api.js`**: An `axios` instance configured to automatically attach the `Authorization: Bearer <token>` header to every request if a user is logged in.
*   **`App.jsx`**: Uses `react-router-dom` to manage navigation between pages. Wrapped in `ThemeProvider`.

### 2. Context (`src/context/ThemeContext.jsx`)
*   Manages "Light" vs "Dark" mode.
*   Persists preference in `localStorage`.
*   Updates the `data-theme` attribute on the `<body>` tag, allowing CSS variables to swap colors globally.

### 3. Components
*   **`Navbar.jsx`**:
    *   Sticky "Glassmorphism" header.
    *   Conditionally renders links (e.g., "Dashboard") based on user login status and role.
*   **`HeroSlider.jsx`**:
    *   Uses `Swiper` library for the homepage banner.
    *   Autoplays and provides links to categories.
*   **`ProductCard.jsx`**:
    *   Displays product info.
    *   Handles "Add to Cart" logic.
    *   **Stock Check**: Disables button if `stock <= 0`.

### 4. Pages
*   **`Home.jsx`**:
    *   Fetches products from API.
    *   Implements **Animation** using `framer-motion` (staggered fade-in).
    *   Handles Category filtering.
*   **`AdminDashboard.jsx`**:
    *   Protected route (checks role on load).
    *   **Forms**: Create new product or Edit existing one.
    *   **Inventory List**: Shows current stock levels.

---

## 🚀 Key Workflows

### The "Stock Check" Flow
1.  **User** clicks "Add to Cart".
2.  **Frontend** sends `POST /api/cart` with `productId`.
3.  **Backend**:
    *   Fetches Product from DB.
    *   Checks if `Product.stock >= RequestedQuantity`.
    *   If yes -> Adds to cart table.
    *   If no -> Returns 400 Error ("Not enough stock").
4.  **Frontend**: Displays success or error toast.

### The "Admin Edit" Flow
1.  **Admin** logs in -> Redirected to Home -> Navigates to Dashboard.
2.  **Dashboard** fetches all products.
3.  Admin clicks "Edit". Form populates with current data.
4.  On Submit -> `PUT /api/products/:id` updates the record in SQLite.
5.  List refreshes to show new values (e.g., updated Stock).
