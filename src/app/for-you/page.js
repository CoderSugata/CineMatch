'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Star, Compass, RefreshCw } from 'lucide-react';
import { getFavorites, getRatings } from '@/lib/storage';
import MovieGrid from '@/components/MovieGrid';
import MovieDetailModal from '@/components/MovieDetailModal';

export default function ForYouPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favCount, setFavCount] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchRecommendations = () => {
    setLoading(true);
    const favorites = getFavorites();
    const ratings = getRatings();

    setFavCount(favorites.length);
    setRatedCount(Object.keys(ratings).length);

    fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorites, ratings })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecommendations(data.results || []);
        }
      })
      .catch(err => console.error('Failed to load recommendations:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecommendations();
    const handleStorage = () => fetchRecommendations();
    window.addEventListener('cinematch_storage_change', handleStorage);
    return () => window.removeEventListener('cinematch_storage_change', handleStorage);
  }, []);

  const totalInteractions = favCount + ratedCount;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f5c518 0%, #e50914 100%)',
            color: '#000',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(245, 197, 24, 0.3)'
          }}>
            <Sparkles size={26} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '900' }}>For You — Smart Match</h1>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              Personalized movie recommendations based on your {favCount} favorites & {ratedCount} star ratings.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Matches
        </button>
      </div>

      {/* Zero Interactions Banner */}
      {totalInteractions === 0 && (
        <div className="glass-panel" style={{
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '2.5rem',
          borderColor: 'rgba(245, 197, 24, 0.4)',
          background: 'radial-gradient(circle at center, rgba(245, 197, 24, 0.08) 0%, rgba(18, 24, 36, 0.9) 100%)'
        }}>
          <Sparkles size={42} color="#f5c518" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Build Your Taste Profile to Unlock Custom Recommendations
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            Click the <Heart size={15} color="#e50914" display="inline" /> heart icon on any movie poster or give star ratings <Star size={15} color="#f5c518" display="inline" /> to teach CineMatch what you love.
          </p>
          <Link href="/discover" className="btn-primary">
            <Compass size={18} /> Discover & Favorite Movies Now
          </Link>
        </div>
      )}

      {/* Recommendations Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <MovieGrid
          movies={recommendations}
          loading={loading}
          onSelectMovie={(m) => setSelectedMovie(m)}
          showMatchScore={true}
          emptyMessage="No recommendation matches found. Try favoriting a few more movies!"
        />
      </section>

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
