import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import '../styles/Wishlist.css';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [token, navigate]);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setMessage('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(wishlist.filter(item => item.product_id !== productId));
            setMessage('Removed from wishlist');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            setMessage('Failed to remove item');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await api.post(
                '/cart',
                { productId, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Added to cart!');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error('Error adding to cart:', err);
            setMessage('Failed to add to cart');
        }
    };

    if (loading) return <div className="wishlist-container"><p>Loading wishlist...</p></div>;

    return (
        <div className="wishlist-container">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h1>My Wishlist</h1>
                {message && <div className="message">{message}</div>}

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <p>Your wishlist is empty</p>
                        <button onClick={() => navigate('/')}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((item, idx) => (
                            <motion.div
                                key={item.product_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="wishlist-item"
                            >
                                <div className="product-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <h3>{item.name}</h3>
                                <p className="price">${item.price.toFixed(2)}</p>
                                <div className="wishlist-actions">
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(item.product_id)}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.product_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Wishlist;
