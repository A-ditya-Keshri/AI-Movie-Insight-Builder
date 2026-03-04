"use client";

import { motion } from "framer-motion";

/**
 * MovieCard component - displays movie poster, title, metadata, 
 * plot summary, and detailed info with staggered animations.
 */
export default function MovieCard({ movie }) {
    if (!movie) return null;

    const metaTags = [
        { label: movie.year, icon: "📅" },
        { label: movie.runtime, icon: "⏱️" },
        { label: movie.rated, icon: "🏷️" },
        { label: movie.genre, icon: "🎭" },
    ].filter((tag) => tag.label && tag.label !== "N/A");

    const details = [
        { label: "Director", value: movie.director },
        { label: "Writer", value: movie.writer },
        { label: "Language", value: movie.language },
        { label: "Awards", value: movie.awards },
        { label: "Box Office", value: movie.boxOffice },
    ].filter((d) => d.value && d.value !== "N/A");

    return (
        <motion.div
            className="glass-card movie-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Poster */}
            <motion.div
                className="movie-poster-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {movie.poster ? (
                    <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        loading="eager"
                    />
                ) : (
                    <div className="movie-poster-fallback">🎥</div>
                )}
            </motion.div>

            {/* Info */}
            <div className="movie-info">
                <motion.h1
                    className="movie-title"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    {movie.title}
                </motion.h1>

                {/* Meta tags */}
                <motion.div
                    className="movie-meta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    {movie.imdbRating && movie.imdbRating !== "N/A" && (
                        <span className="movie-meta-tag rating">
                            ⭐ {movie.imdbRating}/10
                            {movie.imdbVotes && movie.imdbVotes !== "N/A" && (
                                <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>
                                    ({movie.imdbVotes} votes)
                                </span>
                            )}
                        </span>
                    )}
                    {metaTags.map((tag, i) => (
                        <span key={i} className="movie-meta-tag">
                            {tag.icon} {tag.label}
                        </span>
                    ))}
                </motion.div>

                {/* Plot */}
                {movie.plot && movie.plot !== "N/A" && (
                    <motion.p
                        className="movie-plot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        {movie.plot}
                    </motion.p>
                )}

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                >
                    {details.map((detail, i) => (
                        <div key={i} className="movie-detail-row">
                            <span className="movie-detail-label">{detail.label}</span>
                            <span className="movie-detail-value">{detail.value}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Cast */}
                {movie.actors && movie.actors !== "N/A" && (
                    <CastList actors={movie.actors} />
                )}
            </div>
        </motion.div>
    );
}

/**
 * CastList sub-component - renders cast members as animated chips.
 */
function CastList({ actors }) {
    const castList = actors.split(",").map((a) => a.trim());

    return (
        <motion.div
            className="cast-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
        >
            <h2 className="section-title">
                <span className="section-title-icon">🎭</span> Cast
            </h2>
            <div className="cast-grid">
                {castList.map((actor, i) => (
                    <motion.div
                        key={actor}
                        className="cast-chip"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                    >
                        <div className="cast-avatar">
                            {actor.charAt(0).toUpperCase()}
                        </div>
                        {actor}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
