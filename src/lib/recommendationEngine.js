import { getMovieDetails, getMovieSimilar, getPopularMovies, getTopRatedMovies, getTrendingMovies, MOCK_MOVIES } from './tmdb';

/**
 * Recommendation scoring matrix & candidate generator
 */
export async function generateRecommendations(favorites = [], ratings = {}) {
  // Combine favorited and rated items
  const ratedItems = Object.values(ratings);
  const interactedMovieIds = new Set([
    ...favorites.map(f => String(f.id)),
    ...ratedItems.map(r => String(r.movie.id))
  ]);

  // If user has no interactions, return default curated recommendations
  if (favorites.length === 0 && ratedItems.length === 0) {
    const popular = await getPopularMovies();
    return popular.slice(0, 12).map(m => ({
      ...m,
      matchScore: 88 + Math.floor(Math.random() * 8),
      matchReason: 'Popular pick to kickstart your recommendations'
    }));
  }

  // 1. Compute Genre Weight Table
  const genreWeights = {};
  
  // Process favorites (+3 weight per genre)
  favorites.forEach(fav => {
    (fav.genre_ids || []).forEach(gId => {
      genreWeights[gId] = (genreWeights[gId] || 0) + 3;
    });
  });

  // Process ratings
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
  const seedMovies = [
    ...favorites,
    ...ratedItems.filter(r => r.rating >= 7).map(r => r.movie)
  ];

  const candidateMap = new Map();

  // 2. Query TMDB similar endpoint for top seed movies (limit to top 5 seeds to keep fast)
  const topSeeds = seedMovies.slice(0, 5);
  for (const seed of topSeeds) {
    const similar = await getMovieSimilar(seed.id);
    (similar || []).forEach(candidate => {
      const cIdStr = String(candidate.id);
      if (interactedMovieIds.has(cIdStr)) return; // Skip already favorited/rated

      if (!candidateMap.has(cIdStr)) {
        candidateMap.set(cIdStr, {
          movie: candidate,
          seedSources: [seed.title],
          occurrenceCount: 1
        });
      } else {
        const existing = candidateMap.get(cIdStr);
        existing.seedSources.push(seed.title);
        existing.occurrenceCount += 1;
      }
    });
  }

  // If candidate map is sparse, supplement with trending/top-rated movies
  if (candidateMap.size < 8) {
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
  }

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

    // Convert raw score to realistic match percentage (72% to 99%)
    const matchPercentage = Math.min(99, Math.max(72, Math.round(50 + score * 0.4)));

    // Rationale description
    let matchReason = '';
    if (entry.seedSources.length > 0) {
      matchReason = `Because you liked ${entry.seedSources[0]}`;
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

  return scoredCandidates.slice(0, 20);
}
