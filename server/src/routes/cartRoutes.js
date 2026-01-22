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

// Get Cart
router.get('/', (req, res) => {
    const cartItems = db.prepare(`
    SELECT ci.id, ci.quantity, p.name, p.price, p.image, p.stock 
    FROM cart_items ci 
    JOIN products p ON ci.product_id = p.id 
    WHERE ci.user_id = ?
  `).all(req.user.id);
    res.json(cartItems);
});

// Add to Cart
router.post('/', (req, res) => {
    const { productId, quantity } = req.body;
    const qty = quantity || 1;

    // Check product stock
    const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.stock < qty) {
        return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Check if item already exists
    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);

    if (existing) {
        if (product.stock < existing.quantity + qty) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }
        const update = db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?');
        update.run(qty, existing.id);
    } else {
        const insert = db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)');
        insert.run(req.user.id, productId, qty);
    }

    res.status(201).json({ message: 'Added to cart' });
});

// Remove from Cart
router.delete('/:id', (req, res) => {
    const del = db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?');
    const info = del.run(req.params.id, req.user.id);
    if (info.changes === 0) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item removed' });
});

// Checkout
router.post('/checkout', (req, res) => {
    const userId = req.user.id;

    // Transaction wrapper
    const checkoutTransaction = db.transaction(() => {
        // 1. Get Cart Items
        const cartItems = db.prepare(`
        SELECT ci.quantity, p.id as product_id, p.name, p.price, p.stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
    `).all(userId);

        if (cartItems.length === 0) throw new Error('Cart is empty');

        let total = 0;

        // 2. Verify Stock & Calculate Total
        for (const item of cartItems) {
            if (item.stock < item.quantity) {
                throw new Error(`Not enough stock for ${item.name}`);
            }
            total += item.price * item.quantity;
        }

        // 3. Create Order
        const orderResult = db.prepare('INSERT INTO orders (user_id, total_price) VALUES (?, ?)').run(userId, total);
        const orderId = orderResult.lastInsertRowid;

        // 4. Process Items (Deduct Stock & Add to Order Items)
        const deductStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        const addOrderItem = db.prepare('INSERT INTO order_items (order_id, product_name, price_at_purchase, quantity) VALUES (?, ?, ?, ?)');

        for (const item of cartItems) {
            deductStock.run(item.quantity, item.product_id);
            addOrderItem.run(orderId, item.name, item.price, item.quantity);
        }

        // 5. Clear Cart
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

        return orderId;
    });

    try {
        const orderId = checkoutTransaction();
        res.json({ message: 'Checkout successful', orderId });
    } catch (err) {
        console.error('Checkout failed:', err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
