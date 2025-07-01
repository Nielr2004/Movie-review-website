// my-movie-app/src/pages/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// --- CHANGE THIS LINE ---
import { fetchMovieDetails } from '../services/movieApi.js'; // Ensure correct function name and path
// --- END CHANGE ---
import styles from './MovieDetails.module.css'; // Assuming you have this CSS module

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMovieDetails(id); // Use fetchMovieDetails here too
        setMovie(data);
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getMovie();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.container}>Loading movie details...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
  }

  if (!movie) {
    return <div className={styles.container}>Movie not found.</div>;
  }

  // Format release date if available
  const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  // Construct backdrop URL
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Image+Available';

  return (
    <div className={styles.movieDetailsContainer}>
      <div className={styles.backdrop} style={{ backgroundImage: `url(${backdropUrl})` }}></div>
      <div className={styles.content}>
        <div className={styles.posterWrapper}>
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className={styles.poster} />
          ) : (
            <div className={styles.noPoster}>No Poster Available</div>
          )}
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>
          {movie.tagline && <p className={styles.tagline}>"{movie.tagline}"</p>}
          <p className={styles.overview}>{movie.overview}</p>
          <div className={styles.detailsGrid}>
            <p><strong>Release Date:</strong> {releaseDate}</p>
            <p><strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10 (${movie.vote_count} votes)` : 'N/A'}</p>
            <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</p>
            <p><strong>Genres:</strong> {movie.genres && movie.genres.length > 0 ? movie.genres.map(g => g.name).join(', ') : 'N/A'}</p>
            <p><strong>Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
            <p><strong>Revenue:</strong> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</p>
          </div>
          {movie.homepage && (
            <p className={styles.homepageLink}>
              <a href={movie.homepage} target="_blank" rel="noopener noreferrer">Visit Homepage</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;