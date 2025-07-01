// src/services/movieApi.js

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to make API requests
const fetchTmdb = async (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);

  url.searchParams.append('api_key', API_KEY);
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') { // Only append if param has a value
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

// NEW: Get Movie Genres
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

// NEW: Get TV Series Genres
export const getSeriesGenres = async () => {
  const data = await fetchTmdb('/genre/tv/list');
  return data.genres; // TMDB returns { genres: [...] }
};

// NEW: Discover Movies (will be used for filtering)
export const discoverMovies = async (filters = {}, page = 1) => {
  const params = {
    page: page,
    with_genres: filters.genreId, // TMDB expects comma-separated IDs
    'primary_release_year': filters.year, // For movies
    'vote_average.gte': filters.minRating, // Min rating
    sort_by: filters.sortBy || 'popularity.desc' // Default sort
  };
  return fetchTmdb(`/discover/movie`, params);
};

// NEW: Discover TV Series (will be used for filtering)
export const discoverSeries = async (filters = {}, page = 1) => {
  const params = {
    page: page,
    with_genres: filters.genreId, // TMDB expects comma-separated IDs
    'first_air_date_year': filters.year, // For TV series
    'vote_average.gte': filters.minRating, // Min rating
    sort_by: filters.sortBy || 'popularity.desc' // Default sort
  };
  return fetchTmdb(`/discover/tv`, params);
};