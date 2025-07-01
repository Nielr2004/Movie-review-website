// src/services/movieApi.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make API requests
const fetchTmdb = async (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);

  url.searchParams.append('api_key', API_KEY);
  for (const key in params) {
    // Only append if param has a value and is not null/undefined/empty string
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await response.json();
      throw new Error(errorData.status_message || `HTTP error! status: ${response.status}`);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  return response.json();
};

// --- Movie API Functions ---

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  return fetchTmdb(`/movie/popular`, { page });
};

// Search movies
export const searchMovies = async (query, page = 1) => {
  return fetchTmdb(`/search/movie`, { query, page });
};

// Get movie details by ID
export const getMovieDetails = async (id) => {
  return fetchTmdb(`/movie/${id}`, { append_to_response: 'videos,credits,reviews,similar' });
};

// Get Movie Genres
export const getMovieGenres = async () => {
  const data = await fetchTmdb('/genre/movie/list');
  return data.genres; // TMDB returns { genres: [...] }
};


// --- TV Series API Functions ---

// Get popular TV series
export const getPopularSeries = async (page = 1) => {
  return fetchTmdb(`/tv/popular`, { page });
};

// Search TV series
export const searchSeries = async (query, page = 1) => {
  return fetchTmdb(`/search/tv`, { query, page });
};

// Get TV series details by ID
export const getSeriesDetails = async (id) => {
  return fetchTmdb(`/tv/${id}`, { append_to_response: 'videos,credits,reviews,similar' });
};

// Get TV Series Genres
export const getSeriesGenres = async () => {
  const data = await fetchTmdb('/genre/tv/list');
  return data.genres; // TMDB returns { genres: [...] }
};

// NEW: Discover Movies (now correctly handles 'page' from filters object)
export const discoverMovies = async (filters = {}) => { // Removed 'page = 1' from signature
  const params = {
    page: filters.page, // Use page directly from filters
    with_genres: filters.genreId,
    'primary_release_year': filters.year,
    'vote_average.gte': filters.minRating,
    sort_by: filters.sortBy || 'popularity.desc',
    with_original_language: filters.with_original_language
  };
  return fetchTmdb(`/discover/movie`, params);
};

// NEW: Discover TV Series (now correctly handles 'page' from filters object and fixed duplicate 'page' key)
export const discoverSeries = async (filters = {}) => { // Removed 'page = 1' from signature
  const params = {
    page: filters.page, // Use page directly from filters
    with_genres: filters.genreId,
    'first_air_date_year': filters.year,
    'vote_average.gte': filters.minRating,
    sort_by: filters.sortBy || 'popularity.desc',
    with_original_language: filters.with_original_language
  };
  return fetchTmdb(`/discover/tv`, params);
};