"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * ReviewList component - displays scraped audience reviews
 * with author, rating, and review text in a scrollable list.
 */
export default function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <h2 className="section-title">
                <span className="section-title-icon">💬</span> Audience Reviews
                <span
                    style={{
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        color: "var(--text-muted)",
                        marginLeft: "auto",
                    }}
                >
                    {reviews.length} reviews found
                </span>
            </h2>

            <div className="reviews-list">
                <AnimatePresence>
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            className="review-item"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                        >
                            <div className="review-header">
                                <span className="review-author">
                                    👤 {review.author || "Anonymous"}
                                </span>
                                {review.rating && (
                                    <span className="review-rating">⭐ {review.rating}</span>
                                )}
                            </div>
                            <p className="review-text">
                                {review.text.length > 300
                                    ? review.text.substring(0, 300) + "..."
                                    : review.text}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
