"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import SentimentPanel from "@/components/SentimentPanel";
import ReviewList from "@/components/ReviewList";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";

/**
 * Main page - orchestrates the movie search and analysis pipeline.
 * Flow: User enters IMDb ID → Fetch movie → Fetch reviews → AI sentiment
 */
export default function Home() {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [lastSearchId, setLastSearchId] = useState("");

  const handleSearch = useCallback(async (imdbId) => {
    setIsLoading(true);
    setError(null);
    setMovie(null);
    setReviews([]);
    setSentiment(null);
    setLoadingStep(0);
    setLastSearchId(imdbId);

    try {
      // Step 1: Fetch movie details
      setLoadingStep(0);
      const movieRes = await fetch(`/api/movie?id=${encodeURIComponent(imdbId)}`);
      const movieData = await movieRes.json();

      if (!movieRes.ok) {
        throw new Error(movieData.error || "Failed to fetch movie details.");
      }

      setMovie(movieData);

      // Step 2: Fetch reviews
      setLoadingStep(1);
      let reviewsData = { reviews: [], count: 0 };
      try {
        const reviewsRes = await fetch(`/api/reviews?id=${encodeURIComponent(imdbId)}`);
        if (reviewsRes.ok) {
          reviewsData = await reviewsRes.json();
        }
      } catch (reviewErr) {
        console.warn("Reviews fetch failed, continuing with AI analysis:", reviewErr);
      }

      setReviews(reviewsData.reviews || []);

      // Step 3: AI sentiment analysis
      setLoadingStep(2);
      const sentimentRes = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviews: reviewsData.reviews || [],
          movieTitle: movieData.title,
          movieYear: movieData.year,
          imdbRating: movieData.imdbRating,
          plot: movieData.plot,
          genre: movieData.genre,
        }),
      });

      const sentimentData = await sentimentRes.json();

      if (!sentimentRes.ok) {
        throw new Error(sentimentData.error || "Sentiment analysis failed.");
      }

      setSentiment(sentimentData);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRetry = () => {
    if (lastSearchId) {
      handleSearch(lastSearchId);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <motion.div
          className="app-logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="app-logo-icon">🎬</span>
          Movie Insight
        </motion.div>

        <motion.h1
          className="app-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          AI Movie Insight Builder
        </motion.h1>

        <motion.p
          className="app-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Enter an IMDb movie ID to discover detailed insights and AI-powered
          audience sentiment analysis
        </motion.p>
      </header>

      {/* Search */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader currentStep={loadingStep} />
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorMessage message={error} onRetry={handleRetry} />
          </motion.div>
        )}

        {movie && !isLoading && !error && (
          <motion.div
            key="results"
            className="results-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MovieCard movie={movie} />
            {sentiment && <SentimentPanel sentiment={sentiment} />}
            {reviews.length > 0 && <ReviewList reviews={reviews} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with Next.js & Google Gemini AI • Movie data from OMDB</p>
      </footer>
    </div>
  );
}
