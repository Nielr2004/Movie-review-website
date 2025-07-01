import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

const MovieList = ({ movies, title }) => {
  if (!movies || movies.length === 0) {
    return <p className="text-center">No movies to display.</p>;
  }

  return (
    <div className="movie-list-section container">
      {title && <h2>{title}</h2>}
      <div className="movie-list-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;