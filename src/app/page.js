'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Star, Flame, ArrowRight } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import MovieGrid from '@/components/MovieGrid';
import MovieDetailModal from '@/components/MovieDetailModal';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch('/api/movies/trending').then(res => res.json()),
      fetch('/api/movies/popular').then(res => res.json()),
      fetch('/api/movies/search?sortBy=vote_average.desc&minRating=8').then(res => res.json())
    ])
      .then(([trendingRes, popularRes, topRatedRes]) => {
        if (isMounted) {
          if (trendingRes.success) setTrending(trendingRes.results || []);
          if (popularRes.success) setPopular(popularRes.results || []);
          if (topRatedRes.success) setTopRated(topRatedRes.results || []);
        }
      })
      .catch(err => console.error('Error fetching home page movies:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const featuredMovie = trending.length > 0 ? trending[0] : popular[0];

  return (
    <div className="container" style={{ paddingTop: '0.5rem' }}>
      {/* Featured Hero Banner */}
      {featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}

      {/* Recommendations Callout Banner */}
      <div className="glass-panel" style={{
        padding: '1.5rem 2rem',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        borderColor: 'rgba(245, 197, 24, 0.3)',
        background: 'linear-gradient(90deg, rgba(245, 197, 24, 0.1) 0%, rgba(18, 24, 36, 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: '#f5c518',
            color: '#000',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f3f4f6' }}>
              Unlock Personalized Recommendations
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginTop: '0.2rem' }}>
              Favorite or rate any movies to get instant AI-matched recommendations tailored to your taste.
            </p>
          </div>
        </div>

        <Link href="/for-you" className="btn-primary">
          Check "For You" Feed <ArrowRight size={16} />
        </Link>
      </div>

      {/* Trending Movies Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Flame size={24} color="#e50914" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Trending Today</h2>
          </div>
          <Link href="/discover" style={{ fontSize: '0.9rem', color: '#f5c518', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Explore All <ArrowRight size={14} />
          </Link>
        </div>

        <MovieGrid
          movies={trending.slice(0, 10)}
          loading={loading}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      </section>

      {/* Popular Movies Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={24} color="#3b82f6" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Popular Right Now</h2>
          </div>
        </div>

        <MovieGrid
          movies={popular.slice(0, 10)}
          loading={loading}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      </section>

      {/* Top Rated Masterpieces */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Star size={24} fill="#f5c518" color="#f5c518" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Top Rated Masterpieces</h2>
          </div>
        </div>

        <MovieGrid
          movies={topRated.slice(0, 10)}
          loading={loading}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      </section>

      {/* Detail Modal Overlay */}
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
