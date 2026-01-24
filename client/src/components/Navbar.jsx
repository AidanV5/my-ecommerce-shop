import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{
                    fontSize: '1.75rem', fontWeight: '800',
                    background: 'linear-gradient(to right, var(--primary-color), #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    ShopEasy
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-color)', padding: '0.25rem' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <Link to="/">Products</Link>
                    <Link to="/trending" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>🔥 Trending</Link>
                    {token && <Link to="/wishlist">❤️ Wishlist</Link>}
                    {token ? (
                        <>
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Dashboard</Link>
                                    <Link to="/orders" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Sales Log</Link>
                                </>
                            )}
                            <Link to="/cart">Cart</Link>
                            <span>Welcome, {user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
