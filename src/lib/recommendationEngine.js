import { getMovieDetails, getMovieSimilar, getPopularMovies, getTopRatedMovies, getTrendingMovies, MOCK_MOVIES } from './tmdb';

/**
 * Recommendation scoring matrix & candidate generator with dynamic refresh shuffling
 */
export async function generateRecommendations(favorites = [], ratings = {}, options = {}) {
  const isRefresh = options.refresh || false;

  // Combine favorited and rated items
  const ratedItems = Object.values(ratings);
  const interactedMovieIds = new Set([
    ...favorites.map(f => String(f.id)),
    ...ratedItems.map(r => String(r.movie.id))
  ]);

  // If user has no interactions, return default curated recommendations (shuffled on refresh)
  if (favorites.length === 0 && ratedItems.length === 0) {
    const popular = await getPopularMovies();
    let items = popular.slice(0, 20);
    if (isRefresh) {
      items = items.sort(() => Math.random() - 0.5);
    }
    return items.slice(0, 12).map(m => ({
      ...m,
      matchScore: 88 + Math.floor(Math.random() * 8),
      matchReason: 'Popular pick to kickstart your recommendations'
    }));
  }

  // 1. Compute Genre Weight Table
  const genreWeights = {};
  
  favorites.forEach(fav => {
    (fav.genre_ids || []).forEach(gId => {
      genreWeights[gId] = (genreWeights[gId] || 0) + 3;
    });
  });

  ratedItems.forEach(item => {
    const r = item.rating;
    const gIds = item.movie.genre_ids || [];
    let weight = 0;
    if (r >= 8) weight = 3;
    else if (r >= 6) weight = 1;
    else if (r <= 4) weight = -2;

    gIds.forEach(gId => {
      genreWeights[gId] = (genreWeights[gId] || 0) + weight;
    });
  });

  // Identify high-weighted seeds (movies user loved most)
  let seedMovies = [
    ...favorites,
    ...ratedItems.filter(r => r.rating >= 7).map(r => r.movie)
  ];

  // If refresh is requested, shuffle seeds to explore different recommendation anchors!
  if (isRefresh && seedMovies.length > 1) {
    seedMovies = [...seedMovies].sort(() => Math.random() - 0.5);
  }

  const candidateMap = new Map();

  // 2. Query TMDB similar endpoint for seed movies
  const topSeeds = seedMovies.slice(0, 6);
  for (const seed of topSeeds) {
    const sType = seed.media_type || (seed.name && !seed.title ? 'tv' : 'movie');
    const similar = await getMovieSimilar(seed.id, sType);
    (similar || []).forEach(candidate => {
      const cIdStr = String(candidate.id);
      if (interactedMovieIds.has(cIdStr)) return; // Skip already favorited/rated

      if (!candidateMap.has(cIdStr)) {
        candidateMap.set(cIdStr, {
          movie: candidate,
          seedSources: [seed.title || seed.name],
          occurrenceCount: 1
        });
      } else {
        const existing = candidateMap.get(cIdStr);
        existing.seedSources.push(seed.title || seed.name);
        existing.occurrenceCount += 1;
      }
    });
  }

  // Supplement candidate pool with trending/popular titles
  const trending = await getTrendingMovies();
  (trending || []).forEach(m => {
    const mIdStr = String(m.id);
    if (!interactedMovieIds.has(mIdStr) && !candidateMap.has(mIdStr)) {
      candidateMap.set(mIdStr, {
        movie: m,
        seedSources: [],
        occurrenceCount: 1
      });
    }
  });

  // 3. Score & Rank Candidates
  const scoredCandidates = [];

  for (const entry of candidateMap.values()) {
    const m = entry.movie;
    const gIds = m.genre_ids || m.genres?.map(g => g.id) || [];

    // Base score from TMDB vote average (scale 0-40)
    let score = (m.vote_average || 7) * 4;

    // Genre overlap score
    let genreBonus = 0;
    gIds.forEach(gId => {
      genreBonus += (genreWeights[gId] || 0) * 3;
    });
    score += genreBonus;

    // Multi-seed overlap bonus (+12 per seed match)
    score += (entry.occurrenceCount - 1) * 12;

    // Optional random variance on refresh for dynamic ordering
    if (isRefresh) {
      score += (Math.random() * 10 - 5);
    }

    // Convert raw score to realistic match percentage (72% to 99%)
    const matchPercentage = Math.min(99, Math.max(72, Math.round(50 + score * 0.4)));

    // Pick seed rationale
    let matchReason = '';
    if (entry.seedSources.length > 0) {
      const sourceTitle = isRefresh && entry.seedSources.length > 1
        ? entry.seedSources[Math.floor(Math.random() * entry.seedSources.length)]
        : entry.seedSources[0];
      matchReason = `Because you liked ${sourceTitle}`;
    } else {
      matchReason = 'Matches your genre preferences';
    }

    scoredCandidates.push({
      ...m,
      matchScore: matchPercentage,
      matchReason
    });
  }

  // Sort descending by match percentage & vote average
  scoredCandidates.sort((a, b) => b.matchScore - a.matchScore || b.vote_average - a.vote_average);

  // If refresh is requested, shuffle the candidate pool so EVERY click yields a fresh new set of recommendations!
  if (isRefresh && scoredCandidates.length > 5) {
    const candidatePool = scoredCandidates.slice(0, 40);
    const shuffled = candidatePool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  }

  return scoredCandidates.slice(0, 20);
}
