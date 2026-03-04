"use client";

import { motion } from "framer-motion";

/**
 * SentimentPanel component - displays AI sentiment analysis results
 * including classification badge, summary, and key themes.
 */
export default function SentimentPanel({ sentiment }) {
    if (!sentiment) return null;

    const sentimentClass = sentiment.sentiment || "mixed";

    const sentimentLabels = {
        positive: "Positive Reception",
        mixed: "Mixed Reception",
        negative: "Negative Reception",
    };

    const sentimentEmojis = {
        positive: "😊",
        mixed: "🤔",
        negative: "😞",
    };

    return (
        <motion.div
            className={`glass-card sentiment-card ${sentimentClass}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            {/* Header */}
            <div className="sentiment-header">
                <h2 className="section-title">
                    <span className="section-title-icon">🤖</span> AI Sentiment Analysis
                </h2>

                <motion.div
                    className={`sentiment-badge ${sentimentClass}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <span className="sentiment-badge-dot" />
                    {sentimentEmojis[sentimentClass]} {sentimentLabels[sentimentClass]}
                </motion.div>
            </div>

            {/* Summary */}
            <motion.div
                className="sentiment-summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                {sentiment.summary}
            </motion.div>

            {/* Highlights */}
            {sentiment.highlights && (
                <motion.div
                    style={{
                        padding: "12px 16px",
                        background: "var(--bg-tertiary)",
                        borderRadius: "var(--radius-md)",
                        borderLeft: `3px solid var(--${sentimentClass})`,
                        marginBottom: "var(--space-lg)",
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                >
                    <strong style={{ color: "var(--text-primary)" }}>💡 Key Highlight:</strong>{" "}
                    {sentiment.highlights}
                </motion.div>
            )}

            {/* Themes */}
            {sentiment.themes && sentiment.themes.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                >
                    <h3
                        className="section-title"
                        style={{ fontSize: "0.95rem", marginBottom: "var(--space-sm)" }}
                    >
                        🏷️ Key Themes
                    </h3>
                    <div className="sentiment-themes">
                        {sentiment.themes.map((theme, i) => (
                            <motion.span
                                key={theme}
                                className="theme-tag"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25, delay: 0.8 + i * 0.06 }}
                            >
                                {theme}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Meta info */}
            <motion.div
                style={{
                    marginTop: "var(--space-lg)",
                    paddingTop: "var(--space-md)",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "var(--space-sm)",
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
            >
                <span>
                    📊 Reviews analyzed: {sentiment.reviewsAnalyzed || 0}
                </span>
                <span>
                    🎯 Confidence: {sentiment.confidence || "medium"}
                </span>
                <span>Powered by Google Gemini AI</span>
            </motion.div>
        </motion.div>
    );
}
