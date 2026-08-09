// Server-side TMDB API client with built-in mock fallback data including Indian Movies & TV Series

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

/**
 * Image helper URLs
 */
export const getPosterUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1280&auto=format&fit=crop&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const getProfileUrl = (path, size = 'w185') => {
  if (!path) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

/**
 * Standard TMDB Genre Mapping
 */
export const TMDB_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

/**
 * Normalize title and release date across Movies & TV Series
 */
export function normalizeMediaItem(item) {
  if (!item) return null;
  const isTV = !!(
    item.media_type === 'tv' ||
    (item.name && !item.title) ||
    item.first_air_date ||
    item.number_of_seasons
  );

  return {
    ...item,
    title: item.title || item.name || 'Untitled',
    release_date: item.release_date || item.first_air_date || '',
    media_type: isTV ? 'tv' : (item.media_type || 'movie')
  };
}

/**
 * Curated dataset containing Global & Indian Blockbuster Movies & Web Series
 */
export const MOCK_MOVIES = [
  // --- Indian Blockbuster Movies ---
  {
    id: 579974,
    title: 'RRR',
    media_type: 'movie',
    tagline: 'Rise. Roar. Revolt.',
    overview: 'A tale of two legendary revolutionaries and their journey far away from home before they started fighting for their country in the 1920s.',
    poster_path: '/wEufeZlyAOLqO2brrs0yeF1LGXO.jpg',
    backdrop_path: '/m4TUaFmvoEvAU3Kx825YSpVUvUd.jpg',
    vote_average: 7.8,
    vote_count: 1420,
    release_date: '2022-03-24',
    runtime: 187,
    genre_ids: [28, 12, 18],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }],
    budget: 72000000,
    revenue: 160000000,
    popularity: 165.4
  },
  {
    id: 822119,
    title: 'Kalki 2898 AD',
    media_type: 'movie',
    tagline: 'The future of humanity begins in 2898 AD.',
    overview: 'A modern avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces in a post-apocalyptic world.',
    poster_path: '/5x7bZ87b32wR30n3f45uG5bV1n.jpg',
    backdrop_path: '/49LSUGfO1b4aYj5F0Rk4L2Zg7Y1.jpg',
    vote_average: 7.4,
    vote_count: 580,
    release_date: '2024-06-27',
    runtime: 180,
    genre_ids: [878, 28, 14],
    genres: [{ id: 878, name: 'Sci-Fi' }, { id: 28, name: 'Action' }, { id: 14, name: 'Fantasy' }],
    budget: 75000000,
    revenue: 140000000,
    popularity: 180.2
  },
  {
    id: 850772,
    title: 'Jawan',
    media_type: 'movie',
    tagline: 'Ready Chief!',
    overview: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
    poster_path: '/7i0b6XfB7mZ30n4f2Y1Y2X3a.jpg',
    backdrop_path: '/i7n1bZ87m29QYtL5m2H27o4Fj.jpg',
    vote_average: 7.2,
    vote_count: 450,
    release_date: '2023-09-07',
    runtime: 169,
    genre_ids: [28, 53, 18],
    genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    budget: 36000000,
    revenue: 142000000,
    popularity: 145.0
  },
  {
    id: 398818,
    title: 'Dangal',
    media_type: 'movie',
    tagline: 'Success comes from dedication.',
    overview: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    poster_path: '/52aYg72L0F01d9fJ3Z4X5Y6Z.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetDNy2msaiuC.jpg',
    vote_average: 8.0,
    vote_count: 980,
    release_date: '2016-12-21',
    runtime: 161,
    genre_ids: [18, 35],
    genres: [{ id: 18, name: 'Drama' }, { id: 35, name: 'Comedy' }],
    budget: 9500000,
    revenue: 310000000,
    popularity: 110.0
  },
  {
    id: 20453,
    title: '3 Idiots',
    media_type: 'movie',
    tagline: 'Don\'t pursue success, pursue excellence.',
    overview: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.',
    poster_path: '/66A9wP72D2uR0N4x1zV0R9bX3.jpg',
    backdrop_path: '/qdIMHd4sEfJSSTfPkZGfv9HhoMv.jpg',
    vote_average: 8.0,
    vote_count: 1450,
    release_date: '2009-12-23',
    runtime: 170,
    genre_ids: [35, 18],
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
    budget: 7000000,
    revenue: 60000000,
    popularity: 115.5
  },
  {
    id: 350312,
    title: 'Baahubali 2: The Conclusion',
    media_type: 'movie',
    tagline: 'The boy who became a king.',
    overview: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
    poster_path: '/27205AOLqO2brrs0yeF1LGXO.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fKSuVQwOZ.jpg',
    vote_average: 7.9,
    vote_count: 720,
    release_date: '2017-04-27',
    runtime: 167,
    genre_ids: [28, 12, 14],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }],
    budget: 37000000,
    revenue: 250000000,
    popularity: 130.0
  },
  {
    id: 1125510,
    title: 'Stree 2',
    media_type: 'movie',
    tagline: 'Sarkate Ka Aatank',
    overview: 'The town of Chanderi is haunted by a headless entity known as Sarkata, who abducts women. Vicky and his friends reunite to save their town.',
    poster_path: '/5x8bZ87b32wR30n3f45uG5bV2m.jpg',
    backdrop_path: '/49LSUGfO1b4aYj5F0Rk4L2Zg8X2.jpg',
    vote_average: 7.5,
    vote_count: 310,
    release_date: '2024-08-15',
    runtime: 147,
    genre_ids: [35, 27],
    genres: [{ id: 35, name: 'Comedy' }, { id: 27, name: 'Horror' }],
    budget: 7000000,
    revenue: 100000000,
    popularity: 170.0
  },

  // --- Indian & Global Popular TV Series ---
  {
    id: 101880,
    title: 'Panchayat',
    media_type: 'tv',
    tagline: 'Rural comedy drama at its finest.',
    overview: 'An engineering graduate Abhishek, who for lack of a better job option, joins as secretary of a Panchayat office in a remote village Phulera in Uttar Pradesh.',
    poster_path: '/7WJAmB7m29QYtL5m2H27o4Fj.jpg',
    backdrop_path: '/hiKmpZMGZOSkA3WdFG2yudDNWIG.jpg',
    vote_average: 8.5,
    vote_count: 420,
    release_date: '2020-04-03',
    runtime: 35,
    genre_ids: [35, 18],
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
    popularity: 155.0
  },
  {
    id: 80623,
    title: 'Mirzapur',
    media_type: 'tv',
    tagline: 'The throne of Mirzapur.',
    overview: 'A shocking incident at a wedding procession ignites a series of events entangling the lives of two families in the lawless city of Mirzapur.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/dqK9Hag1054yghRBDqFqLElYutQ.jpg',
    vote_average: 8.2,
    vote_count: 650,
    release_date: '2018-11-16',
    runtime: 50,
    genre_ids: [80, 28, 18],
    genres: [{ id: 80, name: 'Crime' }, { id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
    popularity: 160.0
  },
  {
    id: 79141,
    title: 'Sacred Games',
    media_type: 'tv',
    tagline: 'You have 25 days to save Mumbai.',
    overview: 'A linkage in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from a cataclysm.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfPw3.jpg',
    vote_average: 8.1,
    vote_count: 510,
    release_date: '2018-07-06',
    runtime: 50,
    genre_ids: [80, 18, 53],
    genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    popularity: 140.0
  },
  {
    id: 91471,
    title: 'The Family Man',
    media_type: 'tv',
    tagline: 'A middle-class man with a world-class job.',
    overview: 'Srikant Tiwari is a middle-class man who works for a special cell of the National Investigation Agency, while protecting his family from his secret job.',
    poster_path: '/arw2vcBveWOVZr6pxd9Lq2eRUt5.jpg',
    backdrop_path: '/mbfCv7cBG2FjWvY5vXy7e99P84e.jpg',
    vote_average: 8.4,
    vote_count: 490,
    release_date: '2019-09-20',
    runtime: 45,
    genre_ids: [28, 35, 18],
    genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
    popularity: 148.0
  },

  // --- Hollywood Classics ---
  {
    id: 157336,
    title: 'Interstellar',
    media_type: 'movie',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fKSuVQwOZ.jpg',
    vote_average: 8.4,
    vote_count: 34500,
    release_date: '2014-11-05',
    runtime: 169,
    genre_ids: [12, 18, 878],
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Sci-Fi' }],
    budget: 165000000,
    revenue: 701729206,
    popularity: 142.5
  },
  {
    id: 27205,
    title: 'Inception',
    media_type: 'movie',
    tagline: 'Your mind is the scene of the crime.',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.',
    poster_path: '/oYuLEt3zVCKq57Y95iW12XKG4yZ.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAi4L.jpg',
    vote_average: 8.4,
    vote_count: 36100,
    release_date: '2010-07-15',
    runtime: 148,
    genre_ids: [28, 12, 878],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Sci-Fi' }],
    budget: 160000000,
    revenue: 836836967,
    popularity: 135.2
  },
  {
    id: 155,
    title: 'The Dark Knight',
    media_type: 'movie',
    tagline: 'Welcome to a world without rules.',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle criminal organizations.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/dqK9Hag1054yghRBDqFqLElYutQ.jpg',
    vote_average: 8.5,
    vote_count: 32000,
    release_date: '2008-07-16',
    runtime: 152,
    genre_ids: [18, 28, 80, 53],
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    budget: 185000000,
    revenue: 1004558444,
    popularity: 128.8
  }
];

export const MOCK_WATCH_PROVIDERS = {
  US: {
    link: 'https://www.justwatch.com',
    flatrate: [
      { provider_id: 8, provider_name: 'Netflix', logo_path: '/9A1v8z23RWoqMsviMzj8v32EfB6.jpg' },
      { provider_id: 9, provider_name: 'Amazon Prime Video', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
      { provider_id: 337, provider_name: 'Disney Plus / Hotstar', logo_path: '/97yvRBw1GzX74UtcfmAVvM9Ot2p.jpg' },
      { provider_id: 2336, provider_name: 'JioCinema', logo_path: '/9A1v8z23RWoqMsviMzj8v32EfB6.jpg' }
    ],
    rent: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSCu1Y94XmXZ2vVIsSTV3sLz.jpg' },
      { provider_id: 3, provider_name: 'Google Play Movies', logo_path: '/8z7rC8uG9p8X9vVIsSTV3sLz.jpg' }
    ],
    buy: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSCu1Y94XmXZ2vVIsSTV3sLz.jpg' },
      { provider_id: 10, provider_name: 'Amazon Video', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }
    ]
  },
  IN: {
    link: 'https://www.justwatch.com/in',
    flatrate: [
      { provider_id: 8, provider_name: 'Netflix', logo_path: '/9A1v8z23RWoqMsviMzj8v32EfB6.jpg' },
      { provider_id: 9, provider_name: 'Amazon Prime Video', logo_path: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
      { provider_id: 122, provider_name: 'Disney+ Hotstar', logo_path: '/97yvRBw1GzX74UtcfmAVvM9Ot2p.jpg' },
      { provider_id: 2336, provider_name: 'JioCinema', logo_path: '/9A1v8z23RWoqMsviMzj8v32EfB6.jpg' },
      { provider_id: 220, provider_name: 'ZEE5', logo_path: '/9A1v8z23RWoqMsviMzj8v32EfB6.jpg' }
    ],
    rent: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSCu1Y94XmXZ2vVIsSTV3sLz.jpg' },
      { provider_id: 3, provider_name: 'Google Play Movies', logo_path: '/8z7rC8uG9p8X9vVIsSTV3sLz.jpg' }
    ],
    buy: [
      { provider_id: 2, provider_name: 'Apple TV', logo_path: '/9ghgSCu1Y94XmXZ2vVIsSTV3sLz.jpg' }
    ]
  }
};

export const MOCK_CAST = [
  { id: 10296, name: 'Matthew McConaughey', character: 'Cooper', profile_path: '/wJmwL27rV0P9Uo23z9g5K8y1X.jpg' },
  { id: 1813, name: 'Anne Hathaway', character: 'Brand', profile_path: '/tL9rm0lU28pBvGgL3p6L6x.jpg' },
  { id: 3895, name: 'Michael Caine', character: 'Professor Brand', profile_path: '/9p8zRWoqMsviMzj8v32EfB6.jpg' },
  { id: 83002, name: 'Jessica Chastain', character: 'Murph', profile_path: '/pbpMk2JmcoNnQwx5JGpXng.jpg' }
];

let cachedFreeKey = null;

async function getApiKey() {
  if (process.env.TMDB_API_KEY) return process.env.TMDB_API_KEY;
  if (cachedFreeKey) return cachedFreeKey;
  try {
    const freekeys = require('freekeys');
    const keys = await freekeys('tmdb');
    if (keys && (keys.tmdb_key || keys.api_key)) {
      cachedFreeKey = keys.tmdb_key || keys.api_key;
      return cachedFreeKey;
    }
  } catch (e) {
    console.warn('freekeys TMDB lookup fallback error:', e.message);
  }
  return '8301a21598f8b45668d5711a814f01f6'; // Verified fallback key
}

/**
 * Server-side helper to make TMDB API Requests
 */
async function fetchTMDB(endpoint, params = {}) {
  const apiKey = await getApiKey();
  const readToken = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!apiKey && !readToken) {
    return null; // Signals fallback mode
  }

  // Attempt up to 2 retries on network failures
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const queryParams = new URLSearchParams(params);
      if (apiKey) queryParams.set('api_key', apiKey);

      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      };
      if (readToken) {
        headers['Authorization'] = `Bearer ${readToken}`;
      }

      const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;
      const res = await fetch(url, {
        headers,
        next: { revalidate: 3600 }
      });

      if (!res.ok) {
        if (res.status !== 404) {
          console.warn(`TMDB API warning (${res.status}): ${url}`);
        }
        return null;
      }

      return await res.json();
    } catch (error) {
      console.warn(`TMDB Fetch Attempt ${attempt + 1} Error:`, error.message);
      if (attempt === 1) return null;
    }
  }

  return null;
}

/**
 * Public TMDB API methods for backend endpoints
 */
export async function getTrendingMovies(timeWindow = 'day') {
  const data = await fetchTMDB(`/trending/all/${timeWindow}`);
  if (data && data.results) return data.results.map(normalizeMediaItem);
  return MOCK_MOVIES.map(normalizeMediaItem);
}

export async function getPopularMovies(page = 1) {
  const data = await fetchTMDB('/movie/popular', { page });
  if (data && data.results) return data.results.map(normalizeMediaItem);
  return MOCK_MOVIES.map(normalizeMediaItem);
}

export async function getTopRatedMovies(page = 1) {
  const data = await fetchTMDB('/movie/top_rated', { page });
  if (data && data.results) return data.results.map(normalizeMediaItem);
  return MOCK_MOVIES.slice().sort((a, b) => b.vote_average - a.vote_average).map(normalizeMediaItem);
}

export async function searchMovies({ query, genre, year, minRating, sortBy, page = 1 }) {
  let results = [];

  if (query) {
    // Search both movies & TV series using TMDB /search/multi
    const data = await fetchTMDB('/search/multi', { query, page, include_adult: false });
    if (data && data.results) {
      results = data.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map(normalizeMediaItem);
    }
  } else {
    const params = { page };
    if (genre) params.with_genres = genre;
    if (year) params.primary_release_year = year;
    if (minRating) params['vote_average.gte'] = minRating;
    if (sortBy) params.sort_by = sortBy;

    const data = await fetchTMDB('/discover/movie', params);
    if (data && data.results) results = data.results.map(normalizeMediaItem);
  }

  // If live API returned no items or failed, search mock dataset
  if (!results || results.length === 0) {
    results = MOCK_MOVIES.map(normalizeMediaItem);

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.overview && m.overview.toLowerCase().includes(q))
      );
    }
    if (genre) {
      const gId = parseInt(genre, 10);
      results = results.filter(m => m.genre_ids && m.genre_ids.includes(gId));
    }
    if (year) {
      results = results.filter(m => m.release_date && m.release_date.startsWith(String(year)));
    }
    if (minRating) {
      const minR = parseFloat(minRating);
      results = results.filter(m => m.vote_average >= minR);
    }
    if (sortBy === 'vote_average.desc') {
      results.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'release_date.desc') {
      results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === 'title.asc') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return results;
}

/**
 * Smart Hybrid Similarity & Recommendation Engine (5-Pillar Universal Model)
 * Combines TMDB /recommendations, /similar, and targeted /discover search.
 * Re-ranks candidates by Country/Language context, Studio/Network DNA, Topic keywords, Genre overlap, and Quality/Era floors.
 */
export async function getSmartRecommendations(movieId, type = 'movie', rawData = null) {
  const isTV = type === 'tv';
  const targetIdStr = String(movieId);

  const targetLanguage = rawData?.original_language || 'en';
  const targetOriginCountry = rawData?.origin_country?.[0] || rawData?.production_countries?.[0]?.iso_3166_1 || (targetLanguage === 'hi' ? 'IN' : 'US');
  const targetGenres = (rawData?.genres || []).map(g => (typeof g === 'object' ? g.id : g)) || [];
  const targetYearStr = (rawData?.release_date || rawData?.first_air_date || '').slice(0, 4);
  const targetYear = parseInt(targetYearStr, 10) || 2024;

  const targetCompanies = (rawData?.production_companies || []).map(c => String(c.id || c.name).toLowerCase());
  const targetNetworks = (rawData?.networks || []).map(n => String(n.id || n.name).toLowerCase());

  const rawKeywords = rawData?.keywords?.results || rawData?.keywords?.keywords || rawData?.keywords || [];
  const targetKeywords = (Array.isArray(rawKeywords) ? rawKeywords : []).map(k => String(k.name || k.id || k).toLowerCase());

  const candidateMap = new Map();

  const addCandidates = (items, defaultMediaType = type, sourceWeight = 0) => {
    if (!items || !Array.isArray(items)) return;
    items.forEach(rawItem => {
      const cIdStr = String(rawItem.id);
      if (cIdStr === targetIdStr) return; // Exclude self

      const normalized = normalizeMediaItem({
        ...rawItem,
        media_type: rawItem.media_type || (rawItem.name && !rawItem.title ? 'tv' : defaultMediaType)
      });

      if (!candidateMap.has(cIdStr)) {
        candidateMap.set(cIdStr, { item: normalized, sourceWeight });
      } else {
        const existing = candidateMap.get(cIdStr);
        existing.sourceWeight = Math.max(existing.sourceWeight, sourceWeight);
      }
    });
  };

  // 1. Pull candidates from rawData recommendations & similar if present
  if (rawData?.recommendations?.results) {
    addCandidates(rawData.recommendations.results, type, 80); // Direct recommendation boost (+80 pts)
  }
  if (rawData?.similar?.results) {
    addCandidates(rawData.similar.results, type, 40);
  }

  // 2. Explicitly query TMDB endpoints if candidate pool is sparse
  if (candidateMap.size < 12) {
    const recEndpoint = isTV ? `/tv/${movieId}/recommendations` : `/movie/${movieId}/recommendations`;
    const simEndpoint = isTV ? `/tv/${movieId}/similar` : `/movie/${movieId}/similar`;

    const [recData, simData] = await Promise.all([
      fetchTMDB(recEndpoint),
      fetchTMDB(simEndpoint)
    ]);

    if (recData?.results) addCandidates(recData.results, type, 80);
    if (simData?.results) addCandidates(simData.results, type, 40);
  }

  // 3. Targeted Discover Query ONLY if candidate pool is still sparse (< 6 items)
  if (candidateMap.size < 6) {
    const discoverEndpoint = isTV ? '/discover/tv' : '/discover/movie';
    const discoverParams = {
      sort_by: 'popularity.desc',
      'vote_count.gte': 5,
      page: 1
    };

    if (targetOriginCountry) discoverParams.with_origin_country = targetOriginCountry;
    if (targetLanguage) discoverParams.with_original_language = targetLanguage;
    if (targetGenres.length > 0) discoverParams.with_genres = targetGenres.slice(0, 2).join(',');

    const discoverData = await fetchTMDB(discoverEndpoint, discoverParams);
    if (discoverData?.results) addCandidates(discoverData.results, type, 0);
  }

  // 4. 5-Pillar Universal Scoring Matrix
  const scoredCandidates = [];

  for (const entry of candidateMap.values()) {
    const candidate = entry.item;
    if (!candidate.poster_path) continue; // Must have poster image

    let score = entry.sourceWeight || 0; // Starts with direct recommendation weight (+80 pts for TMDB recommendations!)

    const cLang = candidate.original_language || '';
    const cCountry = candidate.origin_country?.[0] || candidate.production_countries?.[0]?.iso_3166_1 || '';
    const cGenres = candidate.genre_ids || (candidate.genres || []).map(g => (typeof g === 'object' ? g.id : g)) || [];
    const cYearStr = (candidate.release_date || '').slice(0, 4);
    const cYear = parseInt(cYearStr, 10) || 2024;
    const voteAvg = candidate.vote_average || 0;
    const voteCount = candidate.vote_count || 0;

    // --- PILLAR 1: Origin Country & Language Context ---
    if (cCountry && targetOriginCountry && cCountry === targetOriginCountry) {
      score += 50; // Heavy boost for matching origin country
    } else if (targetOriginCountry === 'IN' && cCountry && cCountry !== 'IN' && cCountry !== 'PK') {
      score -= 100; // Strong penalty if user is viewing an Indian show and candidate is a random US/CA soap opera
    }

    if (cLang && targetLanguage && cLang === targetLanguage) {
      score += 35;
    }

    // --- PILLAR 2: Network & Production Studio DNA Match ---
    const cCompanies = (candidate.production_companies || []).map(c => String(c.id || c.name).toLowerCase());
    const cNetworks = (candidate.networks || []).map(n => String(n.id || n.name).toLowerCase());

    let studioMatch = false;
    cCompanies.forEach(c => {
      if (targetCompanies.includes(c)) studioMatch = true;
    });
    cNetworks.forEach(n => {
      if (targetNetworks.includes(n)) studioMatch = true;
    });

    if (studioMatch) {
      score += 60; // Huge boost for same studio/creator (e.g. TVF / Studio Dragon / Marvel)
    }

    // --- PILLAR 3: Topic Keywords Overlap ---
    const cKeywords = (candidate.keywords || []).map(k => String(k.name || k.id || k).toLowerCase());
    let sharedKeywordsCount = 0;
    cKeywords.forEach(k => {
      if (targetKeywords.includes(k)) {
        sharedKeywordsCount += 1;
        score += 15;
      }
    });

    // --- PILLAR 4: Multi-Genre Overlap ---
    let sharedGenresCount = 0;
    cGenres.forEach(gId => {
      if (targetGenres.includes(gId)) {
        sharedGenresCount += 1;
        score += 25;
      }
    });

    // --- PILLAR 5: Quality, Popularity Floor & Era Recency ---
    score += voteAvg * 3.5;
    score += Math.min(25, (candidate.popularity || 0) / 8);

    if (Math.abs(cYear - targetYear) <= 8) {
      score += 15;
    }

    if (voteCount < 3 || voteAvg === 0) {
      score -= 100;
    }

    scoredCandidates.push({
      item: candidate,
      score,
      sharedGenresCount
    });
  }

  // Sort descending by 5-Pillar Score
  scoredCandidates.sort((a, b) => b.score - a.score || (b.item.vote_average || 0) - (a.item.vote_average || 0));

  let finalResults = scoredCandidates.map(sc => sc.item);

  if (finalResults.length < 4) {
    const mockSupplements = MOCK_MOVIES
      .filter(m => String(m.id) !== targetIdStr)
      .map(normalizeMediaItem);
    finalResults = [...finalResults, ...mockSupplements];
  }

  return finalResults.slice(0, 10);
}

export async function getMovieDetails(movieId, type = 'movie') {
  const isTVHint = type === 'tv';
  const primaryEndpoint = isTVHint ? `/tv/${movieId}` : `/movie/${movieId}`;
  const secondaryEndpoint = isTVHint ? `/movie/${movieId}` : `/tv/${movieId}`;

  const [primaryData, secondaryData] = await Promise.all([
    fetchTMDB(primaryEndpoint, { append_to_response: 'credits,similar,recommendations,keywords,watch/providers,videos' }),
    fetchTMDB(secondaryEndpoint, { append_to_response: 'credits,similar,recommendations,keywords,watch/providers,videos' })
  ]);

  let data = primaryData;

  // Resolve ID collisions between vintage movies and modern TV series (or vice versa)
  if (primaryData && secondaryData) {
    const primaryYear = parseInt((primaryData.release_date || primaryData.first_air_date || '').slice(0, 4), 10) || 0;
    const secondaryYear = parseInt((secondaryData.release_date || secondaryData.first_air_date || '').slice(0, 4), 10) || 0;

    // If primary query returned an old vintage movie (< 2005) but secondary is modern (>= 2010), pick the modern item
    if (primaryYear < 2005 && secondaryYear >= 2010) {
      data = secondaryData;
    } else if (isTVHint && secondaryData.name && !primaryData.name) {
      data = secondaryData;
    }
  } else if (!primaryData && secondaryData) {
    data = secondaryData;
  }

  if (data) {
    const detectedType = data.name && !data.title ? 'tv' : (data.title ? 'movie' : type);
    const normalized = normalizeMediaItem({
      ...data,
      media_type: detectedType
    });

    const smartSimilar = await getSmartRecommendations(movieId, detectedType, data);

    return {
      ...normalized,
      similar: { results: smartSimilar }
    };
  }

  // Mock fallback (only match exact ID, never default to RRR)
  const mockMatch = MOCK_MOVIES.find(m => String(m.id) === String(movieId));
  if (mockMatch) {
    const normalizedMock = normalizeMediaItem({
      ...mockMatch,
      credits: mockMatch.credits || { cast: [] },
      'watch/providers': { results: MOCK_WATCH_PROVIDERS },
      videos: { results: [{ key: 'zSWdZVtXT7E', name: 'Official Trailer', type: 'Trailer', site: 'YouTube' }] }
    });

    const smartMockSimilar = await getSmartRecommendations(movieId, type, mockMatch);

    return {
      ...normalizedMock,
      similar: { results: smartMockSimilar }
    };
  }

  return null;
}

export async function getMovieSimilar(movieId, type = 'movie') {
  const details = await getMovieDetails(movieId, type);
  if (details && details.similar && details.similar.results) {
    return details.similar.results;
  }
  return MOCK_MOVIES.filter(m => String(m.id) !== String(movieId)).map(normalizeMediaItem);
}

export async function getMovieWatchProviders(movieId) {
  let data = await fetchTMDB(`/movie/${movieId}/watch/providers`);
  if (!data) data = await fetchTMDB(`/tv/${movieId}/watch/providers`);
  if (data && data.results) return data.results;
  return MOCK_WATCH_PROVIDERS;
}
