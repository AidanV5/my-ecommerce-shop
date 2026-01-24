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

// Get reviews for a product
router.get('/product/:productId', (req, res) => {
    try {
        const reviews = db.prepare(`
            SELECT r.id, r.rating, r.title, r.comment, r.created_at, u.username
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `).all(req.params.productId);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Get average rating for a product
router.get('/rating/:productId', (req, res) => {
    try {
        const result = db.prepare(`
            SELECT AVG(rating) as average_rating, COUNT(*) as review_count
            FROM reviews
            WHERE product_id = ?
        `).get(req.params.productId);
        res.json(result || { average_rating: 0, review_count: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rating' });
    }
});

// Create a review (requires authentication)
router.post('/', authenticateToken, (req, res) => {
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !title) {
        return res.status(400).json({ error: 'Product ID, rating, and title are required' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
        const insert = db.prepare(`
            INSERT INTO reviews (product_id, user_id, rating, title, comment)
            VALUES (?, ?, ?, ?, ?)
        `);
        const info = insert.run(productId, req.user.id, rating, title, comment || '');
        res.status(201).json({ id: info.lastInsertRowid, message: 'Review created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// Delete a review (user can delete own review)
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const review = db.prepare('SELECT user_id FROM reviews WHERE id = ?').get(req.params.id);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const del = db.prepare('DELETE FROM reviews WHERE id = ?');
        del.run(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
