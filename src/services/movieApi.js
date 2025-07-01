// my-movie-app/src/services/movieApi.js
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Accessing the environment variable

// Function to fetch popular movies
export const fetchPopularMovies = async () => {
  if (!API_KEY) {
    console.error("TMDb API Key is missing. Please set VITE_TMDB_API_KEY in your .env.local file.");
    throw new Error("TMDb API Key not configured.");
  }
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  if (!response.ok) {
    // Attempt to read error message from API if available
    const errorData = await response.json().catch(() => ({}));
    console.error("Error fetching popular movies:", response.status, errorData);
    throw new Error(`HTTP error! status: ${response.status} - ${errorData.status_message || 'Unknown error'}`);
  }
  const data = await response.json();
  return data.results;
};

// Function to search movies
export const searchMovies = async (query) => {
  if (!API_KEY) {
    console.error("TMDb API Key is missing. Please set VITE_TMDB_API_KEY in your .env.local file.");
    throw new Error("TMDb API Key not configured.");
  }
  if (!query) return []; // Return empty array if query is empty
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error searching movies:", response.status, errorData);
    throw new Error(`HTTP error! status: ${response.status} - ${errorData.status_message || 'Unknown error'}`);
  }
  const data = await response.json();
  return data.results;
};

// Function to fetch movie details by ID
export const fetchMovieDetails = async (id) => {
  if (!API_KEY) {
    console.error("TMDb API Key is missing. Please set VITE_TMDB_API_KEY in your .env.local file.");
    throw new Error("TMDb API Key not configured.");
  }
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Error fetching movie details for ID ${id}:`, response.status, errorData);
    throw new Error(`HTTP error! status: ${response.status} - ${errorData.status_message || 'Unknown error'}`);
  }
  return response.json();
};