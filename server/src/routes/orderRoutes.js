const express = require('express');
const db = require('../db/database');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/admin');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_change_me';

// Middleware to extract user
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

// Get All Orders (Admin Only)
router.get('/', isAdmin, (req, res) => {
    const orders = db.prepare(`
    SELECT o.id, o.total_price, o.created_at, u.username 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC
  `).all();

    // Get items for each order
    const ordersWithItems = orders.map(order => {
        const items = db.prepare('SELECT product_name, quantity, price_at_purchase FROM order_items WHERE order_id = ?').all(order.id);
        return { ...order, items };
    });

    res.json(ordersWithItems);
});

module.exports = router;
