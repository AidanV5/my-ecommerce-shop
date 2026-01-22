import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { motion } from 'framer-motion';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = category === 'All' ? '/products' : `/products?category=${category}`;
                const res = await api.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    const categories = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home'];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

            {/* Hero Slider Section */}
            <HeroSlider />

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem',
                    background: 'linear-gradient(to right, var(--text-color), var(--primary-color))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                }}>
                    Latest Arrivals
                </h2>
                <p style={{ color: 'var(--secondary-color)', fontSize: '1.1rem' }}>Curated for your unique style.</p>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={category === cat ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ minWidth: '100px' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ fontSize: '1.5rem', opacity: 0.6 }}>Loading products...</div>
                </div>
            ) : (
                <>
                    <motion.div
                        className="grid grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {products.map(product => (
                            <motion.div key={product.id} variants={itemVariants}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {products.length === 0 && (
                        <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                            <p style={{ fontSize: '1.2rem', color: 'var(--secondary-color)' }}>No products found in this category.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
