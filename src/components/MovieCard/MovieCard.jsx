import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <motion.div
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Link to={`/movie/${movie.id}`}>
        <img src={posterPath} alt={movie.title} className="movie-poster" />
        <h3 className="movie-title">{movie.title}</h3>
      </Link>
    </motion.div>
  );
};

export default MovieCard;