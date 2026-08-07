'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FilterBar from '@/components/FilterBar';
import MovieGrid from '@/components/MovieGrid';
import MovieDetailModal from '@/components/MovieDetailModal';
import { Compass } from 'lucide-react';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popularity.desc');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movies based on current filters
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (selectedGenre) params.set('genre', selectedGenre);
    if (selectedYear) params.set('year', selectedYear);
    if (minRating) params.set('minRating', minRating);
    if (sortBy) params.set('sortBy', sortBy);

    fetch(`/api/movies/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setMovies(data.results || []);
        }
      })
      .catch(err => console.error('Failed to search movies:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [query, selectedGenre, selectedYear, minRating, sortBy]);

  const handleReset = () => {
    setQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    setMinRating('');
    setSortBy('popularity.desc');
    router.push('/discover');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Compass size={32} color="#f5c518" />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900' }}>Discover & Search Movies</h1>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            Filter thousands of movies by genre, release year, ratings, or keyword.
          </p>
        </div>
      </div>

      <FilterBar
        query={query}
        setQuery={setQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        minRating={minRating}
        setMinRating={setMinRating}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleReset}
      />

      <MovieGrid
        movies={movies}
        loading={loading}
        onSelectMovie={(m) => setSelectedMovie(m)}
        emptyMessage={query ? `No movies found matching "${query}"` : 'No movies found matching selected filters'}
      />

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: '2rem', color: '#9ca3af' }}>Loading discovery filters...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
