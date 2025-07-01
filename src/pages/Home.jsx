import React, { useEffect, useState } from 'react';
import { getPopularMovies, searchMovies } from '../../src/services/movieApi.js'; // Corrected path
import MovieList from '../../src/components/MovieList/MovieList.jsx'; // Corrected path
import styles from './Home.module.css'; // Assuming you have a Home.module.css for styling

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [searching, setSearching] = useState(false); // State to indicate if a search is active

  // Effect to fetch popular movies on initial load
  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        setLoading(true);
        const data = await getPopularMovies();
        setMovies(data);
      } catch (err) {
        setError("Failed to fetch popular movies. Please try again later.");
        console.error("Error fetching popular movies:", err);
      } finally {
        setLoading(false);
      }
    };
    getPopularMovies();
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle movie search
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]); // Clear results if search term is empty
      setSearching(false); // No longer searching
      return; // Do nothing if search term is empty
    }

    try {
      setSearching(true); // Indicate that a search is active
      setError(null); // Clear previous errors
      const data = await searchMovies(searchTerm);
      setSearchResults(data);
    } catch (err) {
      setError("Failed to search for movies. Please check your network or try a different term.");
      console.error("Error searching movies:", err);
      setSearchResults([]); // Clear results on error
    } finally {
      // Small delay to ensure loading state is visible for quick searches
      setTimeout(() => setSearching(false), 500); 
    }
  };

  // Decide which movies to display
  const displayMovies = searchTerm.trim() !== '' ? searchResults : movies;
  const displayTitle = searchTerm.trim() !== '' ? `Search Results for "${searchTerm}"` : 'Popular Movies';

  if (loading) {
    return <div className={styles.container}>Loading popular movies...</div>;
  }

  if (error && !searching) { // Show error only if not actively searching
    return <div className={styles.container} style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => { // Optional: Search on Enter key press
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton} disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      <h2 className={styles.sectionTitle}>{displayTitle}</h2>

      {searching && searchTerm.trim() !== '' ? (
        <div className={styles.loadingMessage}>Searching...</div>
      ) : displayMovies.length > 0 ? (
        <MovieList movies={displayMovies} />
      ) : (
        <div className={styles.noResults}>No movies found. Try a different search term or check popular movies.</div>
      )}
    </div>
  );
};

export default Home;