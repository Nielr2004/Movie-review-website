// src/pages/Home.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  searchMovies,
  searchSeries,
  getMovieGenres,
  getSeriesGenres,
  discoverMovies,
  discoverSeries
} from '../services/movieApi.js';
import MovieList from '../components/MovieList/MovieList.jsx';
import styles from './Home.module.css';

const Home = () => {
  // General states for the current primary content display (Movies/Series pages or Search Results)
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize to true as content will load on mount
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // States for search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const location = useLocation();
  const isSeriesPage = location.pathname === '/series';
  const isMoviesPage = location.pathname === '/movies';
  const isHomePage = location.pathname === '/';
  const contentType = isSeriesPage ? 'tv' : 'movie'; // Corrected to 'tv' for TMDB series API

  // States for filters (used on Movies/Series pages)
  const [genresList, setGenresList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMinRating, setSelectedMinRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  // NEW STATES for Home Page specific content recommendations
  const [popularMoviesHome, setPopularMoviesHome] = useState([]);
  const [popularSeriesHome, setPopularSeriesHome] = useState([]);
  const [hindiMovies, setHindiMovies] = useState([]);
  const [koreanMovies, setKoreansMovies] = useState([]);
  const [teluguMovies, setTeluguMovies] = useState([]);
  const [hindiSeries, setHindiSeries] = useState([]);
  const [koreanSeries, setKoreanSeries] = useState([]);
  const [teluguSeries, setTeluguSeries] = useState([]);

  // --- States for Load More / Pagination ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // True if there are potentially more pages
  const loader = useRef(null); // Ref for the element to observe for infinite scroll

  // Helper to adapt content data for display (movies and series have different key names)
  const adaptContentForDisplay = (items) => {
    return items.map(item => ({
      ...item,
      title: item.title || item.name,
      release_date: item.release_date || item.first_air_date,
      // Ensure 'id' is always present, and 'media_type' for routing
      media_type: item.media_type || (item.title ? 'movie' : 'tv')
    }));
  };

  // --- Main Content Fetching Logic (Refactored to use discover API) ---
  // This function is for /movies and /series pages, and for search results
  const fetchPrimaryContent = useCallback(async (currentPage = 1) => {
    // Prevent fetching if already loading or no more content, unless it's a new search/filter (page 1)
    if (loading && currentPage > 1) return;
    if (!hasMore && currentPage > 1 && searchTerm.trim() === '') return; // Only stop if no more content for filtered lists
    if (searching) return;

    setLoading(true);
    setError(null);

    let data;
    const filters = {
      genreId: selectedGenre,
      year: selectedYear,
      minRating: selectedMinRating,
      sortBy: sortBy,
      page: currentPage, // Pass the current page
    };

    try {
      if (searchTerm.trim() !== '') {
        // If search term is active, prioritize search over filters/discover
        // For a true "load more" on search, searchMovies/searchSeries would need a 'page' parameter too.
        // For now, search results will replace current content and not paginate.
        if (currentPage === 1) { // Only re-fetch if it's the first page of a new search
          setSearching(true);
          if (contentType === 'tv') {
            data = await searchSeries(searchTerm);
          } else {
            data = await searchMovies(searchTerm);
          }
          setSearchResults(adaptContentForDisplay(data.results || []));
          setContent([]); // Clear main content when search results are displayed
          setHasMore(false); // Assume no more search results after initial fetch (adjust if your search API supports pagination)
        }
      } else {
        // No search term, apply filters using discover endpoint for Movies/Series pages
        if (contentType === 'tv') {
          data = await discoverSeries(filters);
        } else {
          data = await discoverMovies(filters);
        }

        const newContent = adaptContentForDisplay(data.results || []);
        if (currentPage === 1) {
          setContent(newContent); // Replace for first page
        } else {
          setContent((prevContent) => [...prevContent, ...newContent]); // Append for subsequent pages
        }
        setHasMore(data.page < data.total_pages); // Check if there are more pages
      }
    } catch (err) {
      setError(`Failed to fetch ${contentType}s. Please try again later.`);
      console.error(`Error fetching ${contentType}s:`, err);
      if (currentPage === 1) { // Only clear if initial fetch failed
        if (searchTerm.trim() !== '') {
          setSearchResults([]);
        } else {
          setContent([]);
        }
      }
      setHasMore(false); // No more content if there's an error
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [searchTerm, contentType, selectedGenre, selectedYear, selectedMinRating, sortBy, loading, hasMore, searching]);

  // --- Effect to fetch data based on current page (Home, Movies, Series) ---
  useEffect(() => {
    // Reset general search/filter states when navigating between pages
    // This ensures a clean state when switching routes
    setSearchTerm('');
    setSearchResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedMinRating('');
    setSortBy('popularity.desc');
    setPage(1); // Reset page for new content fetch
    setHasMore(true); // Assume more content when starting a new fetch
    setError(null); // Clear previous errors
    setLoading(true); // Set loading true for the new page content

    const fetchHomePageSections = async () => {
      try {
        // Fetch Popular Movies for Home
        const movieData = await discoverMovies({ sortBy: 'popularity.desc' });
        setPopularMoviesHome(adaptContentForDisplay(movieData.results || []));

        // Fetch Popular Series for Home
        const seriesData = await discoverSeries({ sortBy: 'popularity.desc' });
        setPopularSeriesHome(adaptContentForDisplay(seriesData.results || []));

        // Fetch Regional Movies (limiting to top 10 for display)
        const hindiM = await discoverMovies({ with_original_language: 'hi', sortBy: 'popularity.desc' });
        setHindiMovies(adaptContentForDisplay(hindiM.results ? hindiM.results.slice(0, 10) : []));

        const koreanM = await discoverMovies({ with_original_language: 'ko', sortBy: 'popularity.desc' });
        setKoreansMovies(adaptContentForDisplay(koreanM.results ? koreanM.results.slice(0, 10) : []));

        const teluguM = await discoverMovies({ with_original_language: 'te', sortBy: 'popularity.desc' });
        setTeluguMovies(adaptContentForDisplay(teluguM.results ? teluguM.results.slice(0, 10) : []));

        // Fetch Regional Series (limiting to top 10 for display)
        const hindiS = await discoverSeries({ with_original_language: 'hi', sortBy: 'popularity.desc' });
        setHindiSeries(adaptContentForDisplay(hindiS.results ? hindiS.results.slice(0, 10) : []));

        const koreanS = await discoverSeries({ with_original_language: 'ko', sortBy: 'popularity.desc' });
        setKoreanSeries(adaptContentForDisplay(koreanS.results ? koreanS.results.slice(0, 10) : []));

        const teluguS = await discoverSeries({ with_original_language: 'te', sortBy: 'popularity.desc' });
        setTeluguSeries(adaptContentForDisplay(teluguS.results ? teluguS.results.slice(0, 10) : []));

      } catch (err) {
        setError("Failed to fetch home page content. Please try again later.");
        console.error("Error fetching home page content:", err);
        // Clear all home page content states on error
        setPopularMoviesHome([]);
        setPopularSeriesHome([]);
        setHindiMovies([]);
        setKoreansMovies([]);
        setTeluguMovies([]);
        setHindiSeries([]);
        setKoreanSeries([]);
        setTeluguSeries([]);
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch genres for Movies/Series pages
    const fetchGenres = async () => {
      try {
        let genresData;
        if (contentType === 'movie') {
          genresData = await getMovieGenres();
        } else {
          genresData = await getSeriesGenres();
        }
        setGenresList(genresData);
      } catch (err) {
        console.error(`Error fetching ${contentType} genres:`, err);
        setGenresList([]);
      }
    };

    // Conditional logic based on the current path
    if (isHomePage) {
      fetchHomePageSections();
      // Clear states relevant only to /movies or /series pages
      setContent([]);
      setSearchResults([]);
      setGenresList([]); // No filters, so no genres needed for Home page
    } else {
      // If on /movies or /series, run the primary content fetch (which uses discover/filters)
      fetchGenres(); // Fetch genres only for movie/series pages
      fetchPrimaryContent(1); // Fetch first page
      // Clear home page specific content when navigating away
      setPopularMoviesHome([]);
      setPopularSeriesHome([]);
      setHindiMovies([]);
      setKoreansMovies([]);
      setTeluguMovies([]);
      setHindiSeries([]);
      setKoreanSeries([]);
      setTeluguSeries([]);
    }
    // Dependency array: Re-run when route changes or content type changes
  }, [isHomePage, contentType, fetchPrimaryContent]);

  // --- Effect for Infinite Scroll (Intersection Observer) ---
  useEffect(() => {
    // Only run infinite scroll on /movies or /series pages, and not during an active search
    if (isHomePage || searchTerm.trim() !== '') {
      // If we're on the home page or actively searching, unobserve the loader
      if (loader.current) {
        const currentObserver = new IntersectionObserver(() => {}); // Dummy observer
        currentObserver.unobserve(loader.current);
      }
      return;
    }

    const options = {
      root: null, // relative to the viewport
      rootMargin: '0px 0px 200px 0px', // When 200px from bottom of viewport, trigger
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      // Trigger fetch if loader is intersecting, not currently loading, and there's more content
      if (target.isIntersecting && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1); // Increment page to fetch next
      }
    }, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
    // Dependencies: Re-run if loading state, hasMore flag, or page type changes
  }, [loading, hasMore, isHomePage, searchTerm]);

  // Effect to fetch more primary content when page state changes
  useEffect(() => {
    // Only fetch if page has incremented beyond 1, and we are not on the home page, and not actively searching
    if (page > 1 && !isHomePage && searchTerm.trim() === '') {
      fetchPrimaryContent(page);
    }
  }, [page, isHomePage, searchTerm, fetchPrimaryContent]);


  // Effect for fetching search suggestions with debouncing (existing logic)
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchTerm.trim() !== '') {
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          let data;
          if (contentType === 'tv') {
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
  }, [searchTerm, contentType]);

  // --- Handlers for Filter Changes (used on Movies/Series pages) ---
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setSearchTerm(''); // Clear search term when a filter is applied
    setPage(1); // Reset page for new filtered results
    setHasMore(true); // Assume more for new filter
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSearchTerm(''); // Clear search term when a filter is applied
    setPage(1); // Reset page for new filtered results
    setHasMore(true); // Assume more for new filter
  };

  const handleMinRatingChange = (e) => {
    setSelectedMinRating(e.target.value);
    setSearchTerm(''); // Clear search term when a filter is applied
    setPage(1); // Reset page for new filtered results
    setHasMore(true); // Assume more for new filter
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setSearchTerm(''); // Clear search term when a filter is applied
    setPage(1); // Reset page for new filtered results
    setHasMore(true); // Assume more for new filter
  };

  // NEW: Handler to clear all filters
  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedMinRating('');
    setSortBy('popularity.desc'); // Reset to default sort
    setSearchTerm(''); // Also clear search term if active, so content refreshes with filters gone
    setPage(1); // Reset page for initial filtered results
    setHasMore(true); // Assume more for cleared filters
  };


  // Function to handle the main content search (triggered by button or enter key)
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setPage(1); // Reset page for new search
      setHasMore(true); // Assume more for new search (though current search API isn't paginated)
      fetchPrimaryContent(1); // Triggers the search path within fetchPrimaryContent
    } else {
      // If search term is empty, clear search results and re-fetch filtered content
      setSearchResults([]);
      setPage(1); // Reset page to 1
      setHasMore(true); // Assume more
      fetchPrimaryContent(1); // Triggers the discover path within fetchPrimaryContent
    }
    setShowSuggestions(false); // Hide suggestions after search is initiated
  };

  // Handle clicking on a suggestion (existing logic)
  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setSuggestions([]);
    setShowSuggestions(false);
    handleSearch(); // Auto-search on click
  };

  // Determine which content array to display for the main view (Movies/Series pages)
  const displayContent = searchTerm.trim() !== '' ? searchResults : content;

  // Dynamic title based on active search, content type, or if it's the home page
  const displayTitle = isHomePage
    ? `Welcome to CineScope` // Main title for the root home page
    : searchTerm.trim() !== ''
      ? `Search Results for "${searchTerm}" in ${contentType === 'movie' ? 'Movies' : 'TV Series'}`
      : `Popular ${contentType === 'movie' ? 'Movies' : 'TV Series'}`; // Default for /movies or /series pages

  // --- Loading and Error States for primary content ---
  // Only show full-page loading/error if no content is loaded yet (first page)
  if (loading && page === 1 && !isHomePage && searchTerm.trim() === '') {
    return <div className={styles.loadingMessage}>Loading {contentType === 'movie' ? 'movies' : 'TV series'}...</div>;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i); // Generate years like 2024, 2023, ..., 2005

  // Determine if filters should be displayed (only on /movies or /series pages, and not when searching)
  const areFiltersActive = selectedGenre || selectedYear || selectedMinRating || (sortBy !== 'popularity.desc');
  const shouldShowFilters = (isMoviesPage || isSeriesPage); // Filters always visible on these pages
  const shouldShowClearButton = areFiltersActive && (isMoviesPage || isSeriesPage); // Clear button only if filters are applied on movies/series pages

  // Determine which content to show in the primary display area
  const showPrimaryContentGrid = !isHomePage && (loading || displayContent.length > 0 || error || searchTerm.trim() !== '');

  return (
    <div className={styles.homeContainer}>
      {/* Search Bar Container - always present */}
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV series'}...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // Clear filter selections when user starts typing a search term
            setSelectedGenre('');
            setSelectedYear('');
            setSelectedMinRating('');
            setSortBy('popularity.desc');
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

        {showSuggestions && suggestions.length > 0 && (
          <ul className={styles.suggestionsList}>
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.title)}
                className={styles.suggestionItem}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filter Options Container - Conditionally rendered only on /movies or /series pages */}
      {shouldShowFilters && (
        <div className={styles.filtersContainer}>
          {/* Genre Filter */}
          <div className={styles.filterGroup}>
            <label htmlFor="genre-select">Genre:</label>
            <select id="genre-select" value={selectedGenre} onChange={handleGenreChange} className={styles.filterSelect}>
              <option value="">All Genres</option>
              {genresList.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className={styles.filterGroup}>
            <label htmlFor="year-select">Year:</label>
            <select id="year-select" value={selectedYear} onChange={handleYearChange} className={styles.filterSelect}>
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Min Rating Filter */}
          <div className={styles.filterGroup}>
            <label htmlFor="rating-select">Min Rating:</label>
            <select id="rating-select" value={selectedMinRating} onChange={handleMinRatingChange} className={styles.filterSelect}>
              <option value="">Min Rating</option>
              <option value="8">8.0+</option>
              <option value="7">7.0+</option>
              <option value="6">6.0+</option>
              <option value="5">5.0+</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className={styles.filterGroup}>
            <label htmlFor="sort-select">Sort By:</label>
            <select id="sort-select" value={sortBy} onChange={handleSortByChange} className={styles.filterSelect}>
              <option value="popularity.desc">Popularity (Desc)</option>
              <option value="popularity.asc">Popularity (Asc)</option>
              <option value="vote_average.desc">Rating (Desc)</option>
              <option value="vote_average.asc">Rating (Asc)</option>
              <option value={contentType === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'}>Newest</option>
              <option value={contentType === 'movie' ? 'primary_release_date.asc' : 'first_air_date.asc'}>Oldest</option>
            </select>
          </div>

          {/* Clear Filters Button - only shown if filters are active */}
          {shouldShowClearButton && (
            <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Main Content Display Area (for /movies, /series, or search results) */}
      {showPrimaryContentGrid && (
        <>
          <h2 className={styles.sectionTitle}>{displayTitle}</h2>
          {error && displayContent.length === 0 ? (
            <div className={styles.error}>{error}</div>
          ) : searching && searchTerm.trim() !== '' && searchResults.length === 0 ? (
            <div className={styles.loadingMessage}>Searching...</div>
          ) : displayContent.length > 0 ? (
            <MovieList movies={displayContent} contentType={contentType} />
          ) : (
            <div className={styles.noResults}>
              No {contentType === 'movie' ? 'movies' : 'TV series'} found matching your criteria.
            </div>
          )}

          {/* Load More Trigger (for infinite scroll on /movies or /series pages) */}
          {hasMore && !searchTerm.trim() && (
            <div ref={loader} className={styles.loadMoreTrigger}>
              {loading && page > 1 && <div className={styles.loadingMessage}>Loading more...</div>}
              {/* Optional: Show a manual load more button here as an alternative or fallback */}
              {/* {!loading && <button onClick={() => setPage(prev => prev + 1)} className={styles.loadMoreButton}>Load More</button>} */}
            </div>
          )}
          {/* Message when no more content is available */}
          {!hasMore && !loading && displayContent.length > 0 && !searchTerm.trim() && (
            <div className={styles.noMoreResults}>You've reached the end of the list!</div>
          )}
        </>
      )}

      {/* NEW: Home Page Specific Sections - Conditionally rendered only on '/' */}
      {isHomePage && searchTerm.trim() === '' && (
        <div className={styles.homePageSections}>
          {loading ? ( // Check loading specific to home page sections
            <div className={styles.loadingMessage}>Loading home page recommendations...</div>
          ) : error ? ( // Check error specific to home page sections
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>Popular Movies</h2>
              {popularMoviesHome.length > 0 ? (
                <MovieList movies={popularMoviesHome} contentType="movie" />
              ) : <p className={styles.noResults}>No popular movies found.</p>}

              <h2 className={styles.sectionTitle}>Popular TV Series</h2>
              {popularSeriesHome.length > 0 ? (
                <MovieList movies={popularSeriesHome} contentType="tv" />
              ) : <p className={styles.noResults}>No popular TV series found.</p>}

              <h2 className={styles.sectionTitle}>Hindi Movies</h2>
              {hindiMovies.length > 0 ? (
                <MovieList movies={hindiMovies} contentType="movie" />
              ) : <p className={styles.noResults}>No Hindi movies found.</p>}

              <h2 className={styles.sectionTitle}>Hindi Series</h2>
              {hindiSeries.length > 0 ? (
                <MovieList movies={hindiSeries} contentType="tv" />
              ) : <p className={styles.noResults}>No Hindi series found.</p>}

              <h2 className={styles.sectionTitle}>Korean Movies</h2>
              {koreanMovies.length > 0 ? (
                <MovieList movies={koreanMovies} contentType="movie" />
              ) : <p className={styles.noResults}>No Korean movies found.</p>}

              <h2 className={styles.sectionTitle}>Korean Series</h2>
              {koreanSeries.length > 0 ? (
                <MovieList movies={koreanSeries} contentType="tv" />
              ) : <p className={styles.noResults}>No Korean series found.</p>}

              <h2 className={styles.sectionTitle}>Telugu Movies</h2>
              {teluguMovies.length > 0 ? (
                <MovieList movies={teluguMovies} contentType="movie" />
              ) : <p className={styles.noResults}>No Telugu movies found.</p>}

              <h2 className={styles.sectionTitle}>Telugu Series</h2>
              {teluguSeries.length > 0 ? (
                <MovieList movies={teluguSeries} contentType="tv" />
              ) : <p className={styles.noResults}>No Telugu series found.</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;