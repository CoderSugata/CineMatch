// Client-side LocalStorage manager for Favorites and Personal Star Ratings

const FAVORITES_KEY = 'cinematch_favorites';
const RATINGS_KEY = 'cinematch_ratings';

/**
 * Get stored favorites list
 */
export function getFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse favorites from localStorage:', e);
    return [];
  }
}

/**
 * Toggle favorite movie (adds if missing, removes if present)
 */
export function toggleFavorite(movie) {
  if (typeof window === 'undefined' || !movie) return false;
  try {
    const favorites = getFavorites();
    const index = favorites.findIndex(item => String(item.id) === String(movie.id));
    let updated = [];
    let isFav = false;

    if (index >= 0) {
      updated = favorites.filter(item => String(item.id) !== String(movie.id));
      isFav = false;
    } else {
      const minMovieData = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids || movie.genres?.map(g => g.id) || [],
        addedAt: new Date().toISOString()
      };
      updated = [minMovieData, ...favorites];
      isFav = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('cinematch_storage_change'));
    return isFav;
  } catch (e) {
    console.error('Failed to update favorites:', e);
    return false;
  }
}

/**
 * Check if a movie is in favorites
 */
export function isFavorite(movieId) {
  if (typeof window === 'undefined' || !movieId) return false;
  const favorites = getFavorites();
  return favorites.some(item => String(item.id) === String(movieId));
}

/**
 * Get all personal ratings map { [movieId]: { rating: number, ratedAt: string, movie: object } }
 */
export function getRatings() {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(RATINGS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse ratings from localStorage:', e);
    return {};
  }
}

/**
 * Set star rating for a movie (1 - 10)
 */
export function setRating(movie, ratingValue) {
  if (typeof window === 'undefined' || !movie) return;
  try {
    const ratings = getRatings();
    const movieIdStr = String(movie.id);

    if (ratingValue <= 0) {
      delete ratings[movieIdStr];
    } else {
      ratings[movieIdStr] = {
        rating: Math.min(10, Math.max(1, ratingValue)),
        ratedAt: new Date().toISOString(),
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids || movie.genres?.map(g => g.id) || []
        }
      };
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    window.dispatchEvent(new Event('cinematch_storage_change'));
  } catch (e) {
    console.error('Failed to save rating:', e);
  }
}

/**
 * Get rating for a specific movie
 */
export function getMovieRating(movieId) {
  if (typeof window === 'undefined' || !movieId) return 0;
  const ratings = getRatings();
  return ratings[String(movieId)]?.rating || 0;
}
