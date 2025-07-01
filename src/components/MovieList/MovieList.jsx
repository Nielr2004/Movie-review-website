// src/components/MovieList/MovieList.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './MovieList.module.css'; // Make sure to import your CSS module

// Accept a new 'contentType' prop
const MovieList = ({ movies, contentType }) => {
  if (!movies || movies.length === 0) {
    return <p>No {contentType === 'movie' ? 'movies' : 'TV series'} to display.</p>;
  }

  return (
    <div className={styles.movieGrid}> {/* Apply the grid class here */}
      {movies.map((movie) => (
        // Use the contentType prop to build the URL
        <Link to={`/${contentType}/${movie.id}`} key={movie.id} className={styles.movieItem}>
          <img
            src={movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : 'https://via.placeholder.com/300x450?text=No+Poster'}
            alt={movie.title} // movie.title is already adapted in Home.jsx
            className={styles.moviePoster}
          />
          <h3 className={styles.movieTitle}>{movie.title}</h3> {/* movie.title is already adapted in Home.jsx */}
        </Link>
      ))}
    </div>
  );
};

export default MovieList;