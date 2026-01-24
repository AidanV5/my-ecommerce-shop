import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import '../styles/Reviews.css';

const Reviews = () => {
    const { productId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchReviews();
        fetchRating();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/product/${productId}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRating = async () => {
        try {
            const res = await api.get(`/reviews/rating/${productId}`);
            setAverageRating(res.data.average_rating || 0);
            setReviewCount(res.data.review_count || 0);
        } catch (err) {
            console.error('Error fetching rating:', err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!token) {
            setMessage('Please log in to leave a review');
            return;
        }

        try {
            await api.post(
                '/reviews',
                { productId: parseInt(productId), rating, title, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Review posted successfully!');
            setTitle('');
            setComment('');
            setRating(5);
            fetchReviews();
            fetchRating();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to post review');
            console.error(err);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Delete this review?')) return;

        try {
            await api.delete(`/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Review deleted');
            fetchReviews();
            fetchRating();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to delete review');
            console.error(err);
        }
    };

    const renderStars = (count, interactive = false) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <span
                key={i}
                className={`star ${i < count ? 'filled' : ''}`}
                onClick={() => interactive && setRating(i + 1)}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="reviews-container">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="rating-summary">
                    <h2>Product Reviews</h2>
                    <div className="rating-display">
                        <div className="stars">{renderStars(Math.round(averageRating))}</div>
                        <div className="rating-stats">
                            <span className="average">{averageRating.toFixed(1)}</span>
                            <span className="count">({reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>

                {token && (
                    <motion.form onSubmit={handleSubmitReview} className="review-form">
                        <h3>Leave a Review</h3>
                        {message && <div className="message">{message}</div>}
                        
                        <div className="form-group">
                            <label>Rating</label>
                            <div className="star-selector">{renderStars(rating, true)}</div>
                        </div>

                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brief review title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts about this product"
                                rows="4"
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Post Review</button>
                    </motion.form>
                )}

                <div className="reviews-list">
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p>No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review, idx) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="review-card"
                            >
                                <div className="review-header">
                                    <div className="review-info">
                                        <strong>{review.username}</strong>
                                        <div className="stars">{renderStars(review.rating)}</div>
                                    </div>
                                    {token && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteReview(review.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <h4>{review.title}</h4>
                                <p>{review.comment}</p>
                                <small>{new Date(review.created_at).toLocaleDateString()}</small>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Reviews;
