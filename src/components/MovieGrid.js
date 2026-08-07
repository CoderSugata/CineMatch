'use client';

import MovieCard from './MovieCard';
import { MovieGridSkeleton } from './Skeleton';
import { Film } from 'lucide-react';

export default function MovieGrid({
  movies = [],
  loading = false,
  onSelectMovie,
  showMatchScore = false,
  emptyMessage = 'No movies found matching your criteria.'
}) {
  if (loading) {
    return <MovieGridSkeleton count={12} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem 0' }}>
        <Film size={48} color="#6b7280" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f3f4f6', marginBottom: '0.5rem' }}>
          {emptyMessage}
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          Try clearing your search query or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={onSelectMovie}
          showMatchScore={showMatchScore}
        />
      ))}
    </div>
  );
}
