const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../ecommerce.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT DEFAULT 'Uncategorized',
    stock INTEGER DEFAULT 10
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_name TEXT,
    price_at_purchase REAL,
    quantity INTEGER,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
`);

// Migrations
try {
  const tableInfo = db.prepare("PRAGMA table_info(products)").all();
  if (!tableInfo.some(col => col.name === 'category')) {
    db.exec(`ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Uncategorized'`);
  }
  if (!tableInfo.some(col => col.name === 'stock')) {
    db.exec(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 10`);
  }
} catch (e) {
  console.error("Migration error:", e);
}


// Seed products if empty
const count = db.prepare('SELECT count(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run('Classic Watch', 'A timeless timepiece.', 120.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80', 'Accessories', 50);
  insert.run('Leather Bag', 'Durable and stylish leather bag.', 85.50, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 'Accessories', 20);
  insert.run('Wireless Headphones', 'Noise cancelling high fidelity.', 250.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', 'Electronics', 15);
  insert.run('Running Shoes', 'Lightweight comfort for your run.', 95.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 'Fashion', 30);
}

module.exports = db;
