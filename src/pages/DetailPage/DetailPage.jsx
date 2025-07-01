// src/pages/DetailPage/DetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getSeriesDetails } from '../../services/movieApi';
import MovieList from '../../components/MovieList/MovieList'; // To display similar recommendations
import styles from './DetailPage.module.css';

const DetailPage = () => {
  const { mediaType, id } = useParams(); // Get mediaType (movie/series) and ID from URL
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (mediaType === 'movie') {
          data = await getMovieDetails(id);
        } else if (mediaType === 'tv') { // TMDB API uses 'tv' for series
          data = await getSeriesDetails(id);
        } else {
          throw new Error('Invalid media type');
        }
        setDetails(data);
      } catch (err) {
        console.error("Failed to fetch details:", err);
        setError("Failed to load details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    // Scroll to top when page loads/ID changes
    window.scrollTo(0, 0); 
  }, [mediaType, id]); // Re-fetch when mediaType or ID changes

  if (loading) {
    return <div className={styles.container}>Loading details...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
  }

  if (!details) {
    return <div className={styles.container}>No details found.</div>;
  }

  // Helper functions for displaying data
  const getReleaseDate = () => {
    return mediaType === 'movie' ? details.release_date : details.first_air_date;
  };

  const getTitle = () => {
    return mediaType === 'movie' ? details.title : details.name;
  };

  const getRuntime = () => {
    if (mediaType === 'movie' && details.runtime) {
      const hours = Math.floor(details.runtime / 60);
      const minutes = details.runtime % 60;
      return `${hours}h ${minutes}m`;
    } else if (mediaType === 'tv' && details.episode_run_time && details.episode_run_time.length > 0) {
      return `${details.episode_run_time[0]}m/episode`;
    }
    return 'N/A';
  };

  const getDirector = () => {
    if (details.credits && details.credits.crew) {
      const director = details.credits.crew.find(crew => crew.job === 'Director');
      return director ? director.name : 'N/A';
    }
    return 'N/A';
  };

  const getCast = () => {
    if (details.credits && details.credits.cast) {
      return details.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
    }
    return 'N/A';
  };

  const getTrailer = () => {
    if (details.videos && details.videos.results) {
      const trailer = details.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    }
    return null;
  };

  const getImdbLink = () => {
    if (details.imdb_id) {
      return `https://www.imdb.com/title/${details.imdb_id}/`;
    }
    return null;
  };

  const getSimilarContent = () => {
      // The 'similar' property comes from the append_to_response in movieApi.js
      return details.similar?.results || [];
  };

  return (
    <div className={styles.detailPage}>
      <div 
        className={styles.backdrop} 
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})` }}
      >
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.posterContainer}>
          <img 
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
            alt={getTitle()} 
            className={styles.poster} 
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.tagline}>{details.tagline}</p>
          
          <div className={styles.meta}>
            <span>⭐ {details.vote_average ? details.vote_average.toFixed(1) : 'N/A'}</span>
            <span>📅 {getReleaseDate()}</span>
            <span>🕒 {getRuntime()}</span>
          </div>

          <p className={styles.genres}>
            Genres: {details.genres && details.genres.map(g => g.name).join(', ')}
          </p>

          <p className={styles.overview}>{details.overview}</p>

          <div className={styles.castCrew}>
            <p><strong>Director:</strong> {getDirector()}</p>
            <p><strong>Starring:</strong> {getCast()}</p>
          </div>

          <div className={styles.buttons}>
            {getTrailer() && (
              <a href={getTrailer()} target="_blank" rel="noopener noreferrer" className={styles.button}>
                Watch Trailer
              </a>
            )}
            {getImdbLink() && (
              <a href={getImdbLink()} target="_blank" rel="noopener noreferrer" className={styles.button}>
                IMDb Page
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Similar Content / Recommendations Section */}
      {getSimilarContent().length > 0 && (
        <div className={styles.similarContent}>
          <h2 className={styles.sectionTitle}>More Like This</h2>
          <MovieList movies={getSimilarContent()} contentType={mediaType} />
        </div>
      )}

      {/* Future sections could go here: Cast/Crew full list, Reviews, etc. */}
    </div>
  );
};

export default DetailPage;