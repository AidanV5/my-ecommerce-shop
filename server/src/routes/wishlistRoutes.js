const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.use(authenticateToken);

// Get user's wishlist
router.get('/', (req, res) => {
    try {
        const wishlist = db.prepare(`
            SELECT w.id, p.id as product_id, p.name, p.price, p.image, p.category, p.stock
            FROM wishlists w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.created_at DESC
        `).all(req.user.id);
        res.json(wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// Add to wishlist
router.post('/', (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const insert = db.prepare(`
            INSERT INTO wishlists (user_id, product_id)
            VALUES (?, ?)
        `);
        const info = insert.run(req.user.id, productId);
        res.status(201).json({ id: info.lastInsertRowid, message: 'Added to wishlist' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }
        console.error(err);
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// Remove from wishlist
router.delete('/:productId', (req, res) => {
    try {
        const del = db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?');
        const info = del.run(req.user.id, req.params.productId);
        if (info.changes === 0) {
            return res.status(404).json({ error: 'Item not found in wishlist' });
        }
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

// Check if product is in wishlist
router.get('/check/:productId', (req, res) => {
    try {
        const wishlist = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?')
            .get(req.user.id, req.params.productId);
        res.json({ inWishlist: !!wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to check wishlist' });
    }
});

module.exports = router;
