"use client";

import { motion } from "framer-motion";

/**
 * ErrorMessage component - displays user-friendly error messages
 * with a retry button and animated icon.
 */
export default function ErrorMessage({ message, onRetry }) {
    return (
        <motion.div
            className="glass-card error-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <motion.div
                className="error-icon"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                😕
            </motion.div>
            <h3 className="error-title">Something went wrong</h3>
            <p className="error-message">{message}</p>
            {onRetry && (
                <motion.button
                    className="error-retry-btn"
                    onClick={onRetry}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Try Again
                </motion.button>
            )}
        </motion.div>
    );
}
