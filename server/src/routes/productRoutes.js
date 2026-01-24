const express = require('express');
const db = require('../db/database');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/admin');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Middleware to extract user for admin check
const extractUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (!err) {
                const fullUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
                req.user = fullUser;
            }
            next();
        });
    } else {
        next();
    }
};

router.use(extractUser);

// Get all products with filtering
router.get('/', (req, res) => {
    const { category, minPrice, maxPrice, search, sort } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
        query += ' AND category = ?';
        params.push(category);
    }

    if (minPrice) {
        query += ' AND price >= ?';
        params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
    }

    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
    }

    // Sorting options
    if (sort === 'price_asc') {
        query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
        query += ' ORDER BY price DESC';
    } else if (sort === 'newest') {
        query += ' ORDER BY id DESC';
    } else {
        query += ' ORDER BY id ASC';
    }

    try {
        const products = db.prepare(query).all(...params);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get trending products (based on order count)
router.get('/trending', (req, res) => {
    try {
        const trendingProducts = db.prepare(`
            SELECT p.*, COUNT(oi.id) as order_count
            FROM products p
            LEFT JOIN order_items oi ON p.id = (
                SELECT product_id FROM cart_items WHERE product_id = p.id LIMIT 1
            )
            GROUP BY p.id
            ORDER BY order_count DESC
            LIMIT 10
        `).all();
        res.json(trendingProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch trending products' });
    }
});

// Get product by ID
router.get('/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Create Product (Admin Only)
router.post('/', isAdmin, (req, res) => {
    const { name, description, price, image, category, stock } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    try {
        const insert = db.prepare('INSERT INTO products (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)');
        const info = insert.run(name, description, price, image, category || 'Uncategorized', stock || 0);
        res.status(201).json({ id: info.lastInsertRowid, message: 'Product created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update Product (Admin Only)
router.put('/:id', isAdmin, (req, res) => {
    const { name, description, price, image, category, stock } = req.body;
    const { id } = req.params;

    try {
        const update = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, image = ?, category = ?, stock = ? 
      WHERE id = ?
    `);
        const info = update.run(name, description, price, image, category, stock, id);

        if (info.changes === 0) return res.status(404).json({ error: 'Product not found' });

        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

module.exports = router;
