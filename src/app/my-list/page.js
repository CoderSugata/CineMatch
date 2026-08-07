'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Heart, Star, Trash2, Compass, Film } from 'lucide-react';
import { getFavorites, getRatings, toggleFavorite, setRating } from '@/lib/storage';
import MovieGrid from '@/components/MovieGrid';
import MovieDetailModal from '@/components/MovieDetailModal';

export default function MyListPage() {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'ratings'
  const [favorites, setFavorites] = useState([]);
  const [ratingsMap, setRatingsMap] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  const loadData = () => {
    setFavorites(getFavorites());
    setRatingsMap(getRatings());
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('cinematch_storage_change', handleStorage);
    return () => window.removeEventListener('cinematch_storage_change', handleStorage);
  }, []);

  const ratedItemsList = Object.values(ratingsMap).map(item => ({
    ...item.movie,
    userRating: item.rating,
    ratedAt: item.ratedAt
  }));

  const displayedMovies = activeTab === 'favorites' ? favorites : ratedItemsList;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Bookmark size={34} color="#f5c518" />
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '900' }}>My List & Ratings</h1>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              Your personal watch list and star ratings, persisted locally in your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '700',
            background: activeTab === 'favorites' ? '#f5c518' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'favorites' ? '#000' : '#9ca3af',
            transition: 'all 0.2s ease'
          }}
        >
          <Heart size={18} fill={activeTab === 'favorites' ? '#000' : 'none'} color={activeTab === 'favorites' ? '#000' : '#e50914'} />
          Favorites ({favorites.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ratings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '700',
            background: activeTab === 'ratings' ? '#f5c518' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'ratings' ? '#000' : '#9ca3af',
            transition: 'all 0.2s ease'
          }}
        >
          <Star size={18} fill={activeTab === 'ratings' ? '#000' : '#f5c518'} color={activeTab === 'ratings' ? '#000' : '#f5c518'} />
          My Ratings ({ratedItemsList.length})
        </button>
      </div>

      {/* Movie Grid / Empty State */}
      {displayedMovies.length > 0 ? (
        <MovieGrid
          movies={displayedMovies}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem 0' }}>
          <Film size={48} color="#6b7280" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f3f4f6', marginBottom: '0.5rem' }}>
            {activeTab === 'favorites' ? 'Your Favorites list is empty' : 'You haven\'t rated any movies yet'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            {activeTab === 'favorites'
              ? 'Click the heart icon on any movie poster to save it to your personal watch list.'
              : 'Open any movie detail card to give it a 1 to 10 star rating.'}
          </p>
          <Link href="/discover" className="btn-primary">
            <Compass size={18} /> Discover Movies
          </Link>
        </div>
      )}

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
