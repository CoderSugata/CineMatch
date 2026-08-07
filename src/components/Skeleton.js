export function MovieCardSkeleton() {
  return (
    <div className="movie-card">
      <div className="skeleton" style={{ aspectRatio: '2/3', width: '100%' }} />
      <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ height: '16px', width: '80%' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%' }} />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
