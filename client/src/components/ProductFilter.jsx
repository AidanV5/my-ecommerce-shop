import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/ProductFilter.css';

const ProductFilter = ({ onFilter, categories }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');

    const handleApplyFilter = () => {
        onFilter({
            minPrice,
            maxPrice,
            category: selectedCategory,
            search,
            sort
        });
    };

    const handleReset = () => {
        setMinPrice(0);
        setMaxPrice(1000);
        setSelectedCategory('All');
        setSearch('');
        setSort('');
        onFilter({
            minPrice: 0,
            maxPrice: 1000,
            category: 'All',
            search: '',
            sort: ''
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="product-filter"
        >
            <h3>Filter Products</h3>

            <div className="filter-group">
                <label>Search</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                />
            </div>

            <div className="filter-group">
                <label>Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                        placeholder="Min"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                        placeholder="Max"
                    />
                </div>
            </div>

            <div className="filter-group">
                <label>Sort By</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                </select>
            </div>

            <div className="filter-buttons">
                <button className="apply-btn" onClick={handleApplyFilter}>Apply Filter</button>
                <button className="reset-btn" onClick={handleReset}>Reset</button>
            </div>
        </motion.div>
    );
};

export default ProductFilter;
