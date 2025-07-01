// src/pages/ContentDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
// Import both movie and series detail functions
import { getMovieDetails, getSeriesDetails } from '../services/movieApi.js';
import Spinner from '../components/UI/Spinner.jsx'; // Assuming Spinner is in UI folder
import './MovieDetails.css'; // You might want to rename this to ContentDetails.css later

// Renamed from MovieDetails to ContentDetails
const ContentDetails = () => {
  // Get both contentType and id from the URL parameters
  const { contentType, id } = useParams();
  const [content, setContent] = useState(null); // Changed 'movie' to 'content' for generality
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        let data;
        if (contentType === 'movie') {
          data = await getMovieDetails(id);
        } else if (contentType === 'series') {
          data = await getSeriesDetails(id);
        } else {
          // Handle unknown content type (e.g., if someone types a wrong URL)
          setError("Invalid content type specified in URL.");
          setLoading(false);
          return;
        }
        setContent(data);
      } catch (err) {
        console.error(`Failed to fetch ${contentType} details:`, err);
        setError(`Failed to load ${contentType} details. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if id and contentType are available
    if (id && contentType) {
      fetchDetails();
    }
  }, [id, contentType]); // Re-run effect if ID or content type changes

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-center" style={{ color: 'var(--primary-color)' }}>{error}</p>;
  }

  if (!content) {
    return <p className="text-center">Content not found.</p>;
  }

  // --- Dynamic data display based on content type ---
  const isMovie = contentType === 'movie';

  const title = isMovie ? content.title : content.name;
  const year = isMovie
    ? (content.release_date ? content.release_date.substring(0, 4) : 'N/A')
    : (content.first_air_date ? content.first_air_date.substring(0, 4) : 'N/A');

  const durationInfo = isMovie
    ? (content.runtime ? `${content.runtime} minutes` : 'N/A')
    : (content.number_of_seasons ? `${content.number_of_seasons} seasons` : (content.episode_run_time && content.episode_run_time.length > 0 ? `${content.episode_run_time[0]} minutes per episode` : 'N/A'));

  const posterUrl = content.poster_path
    ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
    : 'https://via.placeholder.com/400x600?text=No+Image';

  const backdropUrl = content.backdrop_path
    ? `https://image.tmdb.org/t/p/original${content.backdrop_path}`
    : 'https://via.placeholder.com/1280x720?text=No+Background';

  return (
    <motion.div
      className="movie-details-page" // You might want to rename this CSS class too
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="backdrop-header" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="overlay"></div>
        <div className="details-content">
          <img src={posterUrl} alt={title} className="details-poster" />
          <div className="info">
            <h1>{title} ({year})</h1>
            {content.tagline && <p className="tagline">{content.tagline}</p>} {/* Tagline is movie-specific */}
            <p><strong>Rating:</strong> {content.vote_average ? content.vote_average.toFixed(1) : 'N/A'} / 10 ({content.vote_count} votes)</p>
            <p><strong>Genres:</strong> {content.genres ? content.genres.map(g => g.name).join(', ') : 'N/A'}</p>
            <p><strong>Duration:</strong> {durationInfo}</p> {/* Dynamic duration info */}
            <h3>Overview</h3>
            <p>{content.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentDetails;