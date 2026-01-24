# Feature Overview & Navigation Guide

## Navigation Structure

```
ShopEasy (Logo)
├── Products (Home)
├── 🔥 Trending (NEW)
├── ❤️ Wishlist (when logged in) (NEW)
├── [Theme Toggle]
├── [Auth]
│   ├── If Logged In:
│   │   ├── [Dashboard] (if admin)
│   │   ├── [Sales Log] (if admin)
│   │   ├── Cart
│   │   ├── Welcome, [Username]
│   │   └── Logout
│   └── If Not Logged In:
│       ├── Login
│       └── Register
```

## Feature Workflows

### 1. REVIEWING A PRODUCT

```
Browse Products
     ↓
Click "See reviews" link
     ↓
View existing reviews with ratings
     ↓
Login (if not already)
     ↓
Fill review form:
  - Select 1-5 stars
  - Enter title
  - Enter detailed comment
     ↓
Submit review
     ↓
Review appears in list
```

### 2. USING WISHLIST

```
Browse Products
     ↓
Click heart ❤️ icon on product card
     ↓
Heart turns red (added to wishlist)
     ↓
Click "Wishlist" link in navbar
     ↓
View all saved products
     ↓
Options:
  - Add to Cart (direct checkout)
  - Remove from wishlist
```

### 3. FILTERING PRODUCTS

```
Home page
     ↓
See filter sidebar on left
     ↓
Apply filters:
  - Search: Type product name
  - Category: Select from dropdown
  - Price: Set min/max range
  - Sort: Choose sorting order
     ↓
Click "Apply Filter"
     ↓
View filtered results
```

### 4. VIEWING TRENDING

```
Click "🔥 Trending" in navbar
     ↓
See top 10 popular products
     ↓
Can:
  - Add to cart
  - Add to wishlist
  - View reviews
  - Filter by price/category
```

## Product Card Features

```
┌─────────────────────────┐
│   Product Image    ❤️    │  (Heart: Add to wishlist)
├─────────────────────────┤
│ Product Name            │
│ Product Description     │
│ ⭐⭐⭐⭐ (4.5) See reviews  │
│ In Stock: 15 items      │
├─────────────────────────┤
│ $99.99  [Add to Cart]   │
└─────────────────────────┘
```

## Rating Display

```
Overall Rating:
⭐⭐⭐⭐ 4.2 (Based on 45 reviews)

Reviews Sort: Newest First

Review Card:
┌─────────────────────────┐
│ John Doe      ⭐⭐⭐⭐⭐    │
├─────────────────────────┤
│ Great Product!          │
│ Works perfectly, very   │
│ satisfied with quality  │
│ Jan 15, 2024      [×]   │  (Delete if own)
└─────────────────────────┘
```

## Wishlist Page

```
My Wishlist

[Empty State]
├─ Your wishlist is empty
└─ [Continue Shopping]

[With Items]
┌─────────────┬─────────────┬─────────────┐
│ Product 1   │ Product 2   │ Product 3   │
│ $79.99      │ $129.99     │ $49.99      │
│ [Add Cart]  │ [Add Cart]  │ [Add Cart]  │
│ [Remove]    │ [Remove]    │ [Remove]    │
└─────────────┴─────────────┴─────────────┘
```

## Trending Page

```
🔥 Trending Now
Check out the most popular products

[Product 1] [Product 2] [Product 3]
[Product 4] [Product 5] [Product 6]
[Product 7] [Product 8] [Product 9]
[Product 10]
```

## Review Submission Form

```
Rating:      ⭐⭐⭐⭐⭐ (interactive)

Title:       [Great product!]

Comment:     [Detailed review text
             area for long comments]

             [Post Review] [Cancel]
```

## Security Features

```
Login/Register
     ↓
Password entered
     ↓
bcryptjs hashing (10 rounds)
     ↓
Hashed password stored in DB
     ↓
On login: Compare with bcrypt.compare()
     ↓
JWT token issued
     ↓
Token used for:
  - Creating reviews
  - Managing wishlist
  - Viewing own data
```

## Filter Sidebar

```
┌─────────────────────┐
│  FILTER PRODUCTS    │
├─────────────────────┤
│ Search              │
│ [________]          │
│                     │
│ Category            │
│ [Select ▼]          │
│  All                │
│  Electronics        │
│  Fashion            │
│  Accessories        │
│  Home               │
│                     │
│ Price Range         │
│ [50] - [500]        │
│                     │
│ Sort By             │
│ [Select ▼]          │
│  Relevance          │
│  Price: Low-High    │
│  Price: High-Low    │
│  Newest             │
│                     │
│ [Apply] [Reset]     │
└─────────────────────┘
```

## Data Flow Diagram

```
FRONTEND                    BACKEND                  DATABASE

Reviews Page ─POST request─> reviewRoutes.js ─INSERT─> reviews table
     ↓                            ↓
  Display              Verify JWT token
  ratings          Validate rating (1-5)
                   Hash user ID

Wishlist Page ─POST request─> wishlistRoutes.js ─INSERT─> wishlists table
     ↓                            ↓
  Show saved       Verify JWT token
  products      Check for duplicates

Product Card ─GET request─> productRoutes.js ─SELECT─> products table
     ↓                            ↓
  Display           Apply filters
  filtered      Sort results
  products      Join with reviews

Trending Page ─GET request─> productRoutes.js ─SELECT─> Multiple tables
     ↓                            ↓
  Show top 10    Join products
  products       with order data
                 Sort by frequency
```

## API Response Examples

### Get Reviews
```json
[
  {
    "id": 1,
    "rating": 5,
    "title": "Amazing product!",
    "comment": "Exceeded expectations...",
    "username": "john_doe",
    "created_at": "2024-01-15T10:30:00"
  },
  ...
]
```

### Get Wishlist
```json
[
  {
    "id": 1,
    "product_id": 5,
    "name": "Wireless Headphones",
    "price": 250.00,
    "image": "https://...",
    "category": "Electronics"
  },
  ...
]
```

### Get Trending
```json
[
  {
    "id": 1,
    "name": "Popular Product",
    "price": 99.99,
    "image": "https://...",
    "order_count": 42
  },
  ...
]
```

---

**All features integrate seamlessly into your existing e-commerce platform!** 🎉
