import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovieDetails } from '../services/movieApi.js';
import Spinner from '../components/UI/Spinner.jsx';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-center" style={{ color: 'var(--primary-color)' }}>{error}</p>;
  }

  if (!movie) {
    return <p className="text-center">Movie not found.</p>;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/400x600?text=No+Image';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Background';

  return (
    <motion.div
      className="movie-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="backdrop-header" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="overlay"></div>
        <div className="details-content">
          <img src={posterUrl} alt={movie.title} className="details-poster" />
          <div className="info">
            <h1>{movie.title} ({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</h1>
            <p className="tagline">{movie.tagline}</p>
            <p><strong>Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10 ({movie.vote_count} votes)</p>
            <p><strong>Genres:</strong> {movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A'}</p>
            <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
            <h3>Overview</h3>
            <p>{movie.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetails;