import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Orders...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>Sales Log (Receipts)</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <strong>Order #{order.id}</strong>
                                <span style={{ marginLeft: '1rem', color: 'var(--secondary-color)' }}>
                                    {new Date(order.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div>
                                Customer: <strong>{order.username}</strong>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.5rem' }}>Item</th>
                                    <th style={{ padding: '0.5rem' }}>Qty</th>
                                    <th style={{ padding: '0.5rem' }}>Price (at purchase)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.5rem' }}>{item.product_name}</td>
                                        <td style={{ padding: '0.5rem' }}>{item.quantity}</td>
                                        <td style={{ padding: '0.5rem' }}>${item.price_at_purchase}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            Total: ${order.total_price.toFixed(2)}
                        </div>
                    </div>
                ))}

                {orders.length === 0 && <p>No orders found.</p>}
            </div>
        </div>
    );
};

export default AdminOrders;
