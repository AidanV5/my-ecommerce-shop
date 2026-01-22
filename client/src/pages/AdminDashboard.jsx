import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Edit, Save, X } from 'lucide-react';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', image: '', category: 'Electronics', stock: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') {
            alert('Access Denied');
            navigate('/');
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', image: '', category: 'Electronics', stock: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
                alert('Product updated!');
            } else {
                await api.post('/products', formData);
                alert('Product created!');
            }
            setFormData({ name: '', description: '', price: '', image: '', category: 'Electronics', stock: '' });
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            alert('Operation failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>Admin Dashboard</h1>

            <div className="grid grid-cols-2">
                <div className="card" style={{ height: 'fit-content' }}>
                    <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="input-field" required />
                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input-field" rows="3" />

                        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                            <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} className="input-field" required />
                            <input name="stock" type="number" placeholder="Stock Qty" value={formData.stock} onChange={handleChange} className="input-field" />
                        </div>

                        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="input-field" />

                        <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Home">Home</option>
                        </select>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                                {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Create Product')}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="btn btn-outline">Cancel</button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="card">
                    <h2>Inventory Management</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {products.map(p => (
                            <li key={p.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--secondary-color)' }}>
                                        {p.category} | ${p.price} | Stock: {p.stock}
                                    </div>
                                </div>
                                <button onClick={() => startEdit(p)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Edit size={16} /> Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
