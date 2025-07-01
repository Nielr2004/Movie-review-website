// src/components/MovieList/MovieList.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './MovieList.module.css'; // Make sure to import your CSS module

// It's a good practice to use a local placeholder image
// Make sure you have a placeholder.png (or .jpg) in src/assets/images/
// Example: import PLACEHOLDER_POSTER from '../../assets/images/placeholder_poster.png';
// For now, I'll keep the direct URL for simplicity, but consider the above.
const PLACEHOLDER_POSTER_URL = 'https://via.placeholder.com/300x450?text=No+Poster';

// Accept a new 'contentType' prop
const MovieList = ({ movies, contentType }) => {
  if (!movies || movies.length === 0) {
    return <p>No {contentType === 'movie' ? 'movies' : 'TV series'} to display.</p>;
  }

  return (
    <div className={styles.movieGrid}> {/* Apply the grid class here */}
      {movies.map((movie) => (
        // CORRECTED: Use movie.media_type if available (for 'similar' content), otherwise use contentType prop
        <Link 
          to={`/${movie.media_type || contentType}/${movie.id}`} 
          key={movie.id} 
          className={styles.movieItem}
        >
          <img
            src={movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : PLACEHOLDER_POSTER_URL // Use the defined placeholder constant
            }
            alt={movie.title || movie.name} // Use movie.title for movies, movie.name for series
            className={styles.moviePoster}
          />
          {/* Use movie.title for movies and movie.name for series */}
          <h3 className={styles.movieTitle}>{movie.title || movie.name}</h3> 
        </Link>
      ))}
    </div>
  );
};

export default MovieList;