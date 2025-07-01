// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import {
  getPopularMovies,
  searchMovies,
  getPopularSeries, // NEW
  searchSeries      // NEW
} from '../services/movieApi.js';
import MovieList from '../components/MovieList/MovieList.jsx';
import styles from './Home.module.css';

const Home = () => {
  const [content, setContent] = useState([]); // Renamed from 'movies' to 'content' for generality
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const location = useLocation(); // Get the current location object
  const isSeriesPage = location.pathname === '/series'; // Check if it's the /series path
  const contentType = isSeriesPage ? 'series' : 'movie'; // Determine current content type

  // Helper to adapt series data to 'movie' structure for MovieList component
  const adaptContentForDisplay = (items) => {
    return items.map(item => ({
      ...item,
      title: item.title || item.name, // Use 'title' for movies, 'name' for series
      release_date: item.release_date || item.first_air_date // Use correct date field
      // Add other common fields if needed, e.g., vote_average, overview
    }));
  };

  // Effect to fetch popular movies/series on initial load or path change
  useEffect(() => {
    const fetchInitialContent = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (contentType === 'series') {
          data = await getPopularSeries();
        } else {
          data = await getPopularMovies();
        }
        setContent(adaptContentForDisplay(data.results || []));
      } catch (err) {
        setError(`Failed to fetch popular ${contentType}s. Please try again later.`);
        console.error(`Error fetching popular ${contentType}s:`, err);
      } finally {
        setLoading(false);
      }
    };
    // Reset search term and results when navigating between movies/series
    setSearchTerm('');
    setSearchResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchInitialContent();
  }, [contentType]); // Rerun when contentType changes (i.e., path changes between /movies and /series)


  // Effect for fetching search suggestions with debouncing
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchTerm.trim() !== '') {
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          let data;
          if (contentType === 'series') {
            data = await searchSeries(searchTerm);
          } else {
            data = await searchMovies(searchTerm);
          }
          setSuggestions(adaptContentForDisplay(data.results ? data.results.slice(0, 10) : []));
          setShowSuggestions(true);
        } catch (err) {
          console.error(`Error fetching ${contentType} search suggestions:`, err);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);

    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, contentType]); // Also rerun if content type changes

  // Function to handle the main content search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setSearching(false);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      let data;
      if (contentType === 'series') {
        data = await searchSeries(searchTerm);
      } else {
        data = await searchMovies(searchTerm);
      }
      setSearchResults(adaptContentForDisplay(data.results || []));
      setShowSuggestions(false);
    } catch (err) {
      setError(`Failed to search for ${contentType}s. Please check your network or try a different term.`);
      console.error(`Error searching ${contentType}s:`, err);
      setSearchResults([]);
    } finally {
      setTimeout(() => setSearching(false), 500);
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (movieTitle) => { // Still named movieTitle, but it's content title now
    setSearchTerm(movieTitle);
    setSearchResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    handleSearch(); // Auto-search on click
  };

  // Decide which content to display: search results if active, else popular content
  const displayContent = searchTerm.trim() !== '' ? searchResults : content;
  const displayTitle = searchTerm.trim() !== ''
    ? `Search Results for "${searchTerm}" in ${contentType === 'movie' ? 'Movies' : 'TV Series'}`
    : `Popular ${contentType === 'movie' ? 'Movies' : 'TV Series'}`;

  if (loading && !searching && searchTerm.trim() === '') {
    return <div className={styles.container}>Loading popular {contentType}s...</div>;
  }

  if (error && !searching && displayContent.length === 0) {
    return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV series'}...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          onFocus={() => {
            if (searchTerm.trim() !== '' && suggestions.length > 0) {
                setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 100);
          }}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton} disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((item) => ( // Changed 'movie' to 'item' for generality
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.title)} // Use item.title (after adaptation)
                className={styles.suggestionItem}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className={styles.sectionTitle}>{displayTitle}</h2>

      {searching && searchTerm.trim() !== '' && searchResults.length === 0 ? (
        <div className={styles.loadingMessage}>Searching...</div>
      ) : displayContent.length > 0 ? (
        <MovieList movies={displayContent} /> 
      ) : (
        <div className={styles.noResults}>
          No {contentType === 'movie' ? 'movies' : 'TV series'} found. Try a different search term or check popular {contentType === 'movie' ? 'movies' : 'TV series'}.
        </div>
      )}
    </div>
  );
};

export default Home;