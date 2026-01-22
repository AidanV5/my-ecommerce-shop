import React, { useState } from 'react';
import api from '../api';

const ProductCard = ({ product }) => {
    const [loading, setLoading] = useState(false);

    const addToCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add items to cart');
            return;
        }

        setLoading(true);
        try {
            await api.post('/cart', { productId: product.id, quantity: 1 });
            alert('Added to cart!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }}
            />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h3>
            <p style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', flex: 1 }}>{product.description}</p>

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
