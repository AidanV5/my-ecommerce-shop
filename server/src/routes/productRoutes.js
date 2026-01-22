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

// Get all products
router.get('/', (req, res) => {
    const { category } = req.query;
    let products;

    if (category && category !== 'All') {
        products = db.prepare('SELECT * FROM products WHERE category = ?').all(category);
    } else {
        products = db.prepare('SELECT * FROM products').all();
    }

    res.json(products);
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
