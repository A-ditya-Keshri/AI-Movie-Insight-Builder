"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SearchBar component - validates IMDb ID format and submits search.
 * Supports format: tt + 7-8 digits (e.g., tt0133093)
 */
export default function SearchBar({ onSearch, isLoading }) {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [hasShake, setHasShake] = useState(false);

    const validateImdbId = (id) => {
        const trimmed = id.trim();
        if (!trimmed) return "Please enter an IMDb ID.";
        const pattern = /^tt\d{7,8}$/;
        if (!pattern.test(trimmed)) {
            return "Invalid format. IMDb ID should start with 'tt' followed by 7-8 digits (e.g., tt0133093).";
        }
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validateImdbId(inputValue);
        if (validationError) {
            setError(validationError);
            setHasShake(true);
            setTimeout(() => setHasShake(false), 500);
            return;
        }
        setError("");
        onSearch(inputValue.trim());
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (error) setError("");
    };

    return (
        <motion.div
            className="search-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                    <span className="search-icon">🎬</span>
                    <input
                        id="imdb-search-input"
                        type="text"
                        className={`search-input ${hasShake ? "error" : ""}`}
                        placeholder="Enter IMDb ID (e.g., tt0133093)"
                        value={inputValue}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        aria-label="IMDb Movie ID"
                        autoComplete="off"
                    />
                </div>
                <motion.button
                    id="search-button"
                    type="submit"
                    className="search-button"
                    disabled={isLoading}
                    whileTap={{ scale: 0.97 }}
                >
                    <span>{isLoading ? "Analyzing..." : "Analyze"}</span>
                </motion.button>
            </form>

            <AnimatePresence>
                {error && (
                    <motion.div
                        className="search-error"
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        ⚠️ {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
