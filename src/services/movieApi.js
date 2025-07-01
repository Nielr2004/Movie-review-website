import axios from 'axios';

// IMPORTANT: Access environment variables using import.meta.env
// The variable name MUST start with VITE_
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.error("TMDB API key is missing! Please set VITE_TMDB_API_KEY in your .env.local file.");
}

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getPopularMovies = async () => {
  try {
    const response = await tmdb.get('/movie/popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ID ${movieId}:`, error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await tmdb.get('/search/movie', {
      params: {
        query: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching movies for query "${query}":`, error);
    throw error;
  }
};