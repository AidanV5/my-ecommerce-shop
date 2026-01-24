import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ProductCard = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            checkWishlist();
            fetchRating();
        }
    }, [product.id, token]);

    const checkWishlist = async () => {
        try {
            const res = await api.get(`/wishlist/check/${product.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInWishlist(res.data.inWishlist);
        } catch (err) {
            console.error('Error checking wishlist:', err);
        }
    };

    const fetchRating = async () => {
        try {
            const res = await api.get(`/reviews/rating/${product.id}`);
            setRating(res.data.average_rating || 0);
        } catch (err) {
            console.error('Error fetching rating:', err);
        }
    };

    const addToCart = async () => {
        if (!token) {
            alert('Please login to add items to cart');
            return;
        }

        setLoading(true);
        try {
            await api.post('/cart', { productId: product.id, quantity: 1 }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Added to cart!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async () => {
        if (!token) {
            alert('Please login to use wishlist');
            return;
        }

        try {
            if (inWishlist) {
                await api.delete(`/wishlist/${product.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInWishlist(false);
            } else {
                await api.post('/wishlist', { productId: product.id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setInWishlist(true);
            }
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    };

    const isOutOfStock = product.stock <= 0;

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < Math.round(rating) ? '#ffc107' : '#ddd' }}>★</span>
        ));
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
                <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
                />
                <button
                    onClick={toggleWishlist}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: inWishlist ? '#ff6b6b' : 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    ♡
                </button>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', flex: 1 }}>{product.description}</p>

            <div style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div>{renderStars()}</div>
                <span style={{ fontSize: '0.9rem' }}>({rating.toFixed(1)})</span>
                <button
                    onClick={() => navigate(`/product/${product.id}/reviews`)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#0066cc',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.9rem'
                    }}
                >
                    See reviews
                </button>
            </div>

            <div style={{ margin: '0.5rem 0', fontWeight: '500', color: isOutOfStock ? 'var(--error-color)' : 'var(--text-color)' }}>
                {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock}`}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${product.price}</span>
                <button
                    className="btn btn-primary"
                    onClick={addToCart}
                    disabled={loading || isOutOfStock}
                    style={isOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    {loading ? 'Adding...' : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
