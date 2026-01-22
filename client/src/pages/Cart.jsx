import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const removeFromCart = async (id) => {
        try {
            await api.delete(`/cart/${id}`);
            setCartItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error removing item:', err);
            alert('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        setProcessing(true);
        try {
            await api.post('/cart/checkout');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            alert('Checkout Successful! Thank you for your purchase.');
            setCartItems([]);
            // navigate('/'); // Optional: redirect to home or tracking page
        } catch (err) {
            alert(err.response?.data?.error || 'Checkout failed');
        } finally {
            setProcessing(false);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading cart...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Your Cart</h1>

            {cartItems.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', marginTop: '1rem' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your cart is empty.</p>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cartItems.map(item => (
                            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={item.image || 'https://via.placeholder.com/100'}
                                    alt={item.name}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--border-radius)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.name}</h3>
                                    <p style={{ margin: 0, color: 'var(--secondary-color)' }}>Unit Price: ${item.price}</p>
                                    <p style={{ margin: 0 }}>Quantity: {item.quantity}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="btn btn-outline"
                                        style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                        <h2 style={{ marginTop: 0 }}>Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--secondary-color)' }}>
                            <span>Subtotal:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem' }}
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
