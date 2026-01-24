import React, { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import '../styles/Trending.css';

const Trending = () => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrendingProducts();
    }, []);

    const fetchTrendingProducts = async () => {
        try {
            const res = await api.get('/products/trending');
            setTrendingProducts(res.data);
        } catch (err) {
            console.error('Error fetching trending products:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trending-container">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="trending-header"
            >
                <h1>🔥 Trending Now</h1>
                <p>Check out the most popular products</p>
            </motion.div>

            {loading ? (
                <p className="loading">Loading trending products...</p>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="products-grid"
                >
                    {trendingProducts.length === 0 ? (
                        <p>No trending products available</p>
                    ) : (
                        trendingProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Trending;
