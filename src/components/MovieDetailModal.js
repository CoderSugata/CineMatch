'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Star, Calendar, Clock, DollarSign, Users, Play, Film } from 'lucide-react';
import { getBackdropUrl, getPosterUrl, getProfileUrl } from '@/lib/tmdb';
import { isFavorite, toggleFavorite, getMovieRating, setRating } from '@/lib/storage';
import StarRating from './StarRating';
import WatchProviders from './WatchProviders';
import MovieCard from './MovieCard';

export default function MovieDetailModal({ movie, onClose, onSelectMovie }) {
  const [details, setDetails] = useState(movie || null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!movie?.id) return;

    let isMounted = true;
    setLoading(true);
    setFav(isFavorite(movie.id));
    setUserRating(getMovieRating(movie.id));

    const mediaType = movie.media_type || (movie.name && !movie.title ? 'tv' : 'movie');

    // Fetch complete details from server API endpoint with correct media type (movie vs tv)
    fetch(`/api/movies/${movie.id}?type=${mediaType}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.movie) {
          setDetails(data.movie);
        }
      })
      .catch(err => console.error('Failed to load movie details:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [movie]);

  if (!movie) return null;

  const handleFavClick = () => {
    const updated = toggleFavorite(details || movie);
    setFav(updated);
  };

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
    setRating(details || movie, newRating);
  };

  const backdrop = getBackdropUrl(details?.backdrop_path || movie.backdrop_path);
  const poster = getPosterUrl(details?.poster_path || movie.poster_path);
  const cast = details?.credits?.cast?.slice(0, 8) || [];
  const similar = details?.similar?.results?.slice(0, 6) || [];
  const providers = details?.['watch/providers']?.results || {};
  const trailerVideo = details?.videos?.results?.find(v => v.type === 'Trailer' || v.type === 'Teaser');

  const releaseDate = details?.release_date || movie.release_date || 'N/A';
  const runtimeHours = details?.runtime ? Math.floor(details.runtime / 60) : 0;
  const runtimeMins = details?.runtime ? details.runtime % 60 : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="modal-hero-banner" style={{ backgroundImage: `url(${backdrop})` }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, #121824 0%, rgba(18,24,36,0.5) 60%, rgba(0,0,0,0.4) 100%)'
          }} />

          {trailerVideo && (
            <button
              type="button"
              onClick={() => setShowTrailer(true)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(245, 197, 24, 0.9)',
                color: '#000',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(245, 197, 24, 0.5)',
                border: '2px solid #ffffff',
                transition: 'all 0.25s ease'
              }}
              title="Watch Trailer"
            >
              <Play size={26} fill="#000" style={{ marginLeft: '4px' }} />
            </button>
          )}
        </div>

        {/* Main Details Body */}
        <div className="modal-body-content">
          <div className="modal-grid-layout">
            {/* Poster & Quick Rating Box */}
            <div className="modal-poster-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <img
                src={poster}
                alt={details?.title || movie.title}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />

              {/* Personal Star Rating Card */}
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', overflow: 'hidden', width: '100%' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#9ca3af', marginBottom: '0.6rem' }}>
                  YOUR PERSONAL RATING
                </div>
                <StarRating value={userRating} onChange={handleRatingChange} size={15} showScore={false} />
                <div style={{ fontSize: '0.8rem', color: userRating > 0 ? '#f5c518' : '#6b7280', fontWeight: '700', marginTop: '0.5rem' }}>
                  {userRating > 0 ? `${userRating} / 10 Stars` : 'Click stars to rate'}
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <h1 className="modal-title-text">
                    {details?.title || movie.title}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {trailerVideo && (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => setShowTrailer(true)}
                      >
                        <Play size={16} fill="#000" /> Watch Trailer
                      </button>
                    )}

                    <button
                      type="button"
                      className={`btn-secondary ${fav ? 'active' : ''}`}
                      onClick={handleFavClick}
                      style={{
                        borderColor: fav ? '#e50914' : 'rgba(255,255,255,0.15)',
                        color: fav ? '#e50914' : '#fff'
                      }}
                    >
                      <Heart size={18} fill={fav ? '#e50914' : 'none'} color={fav ? '#e50914' : '#fff'} />
                      {fav ? 'In Favorites' : 'Add to Favorites'}
                    </button>
                  </div>
                </div>

                {details?.tagline && (
                  <p style={{ fontSize: '1rem', fontStyle: 'italic', color: '#f5c518', marginTop: '0.4rem' }}>
                    "{details.tagline}"
                  </p>
                )}
              </div>

              {/* Badges & Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
                <span className="rating-badge" style={{ fontSize: '1rem' }}>
                  <Star size={18} fill="#f5c518" color="#f5c518" />
                  {details?.vote_average ? details.vote_average.toFixed(1) : movie.vote_average} / 10
                  <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>({details?.vote_count || movie.vote_count} votes)</span>
                </span>

                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={15} /> {releaseDate}
                </span>

                {details?.runtime > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={15} /> {runtimeHours}h {runtimeMins}m
                  </span>
                )}
              </div>

              {/* Genre Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(details?.genres || movie.genres || []).map(g => (
                  <span
                    key={g.id || g}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    {g.name || g}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', color: '#f3f4f6' }}>Synopsis</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', color: '#d1d5db' }}>
                  {details?.overview || movie.overview}
                </p>
              </div>

              {/* Cast List */}
              {cast.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.85rem', color: '#f3f4f6' }}>Top Cast</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.85rem' }}>
                    {cast.map(c => (
                      <div key={c.id} style={{ textAlign: 'center', background: '#0b0e14', padding: '0.6rem', borderRadius: '8px' }}>
                        <img
                          src={getProfileUrl(c.profile_path)}
                          alt={c.name}
                          style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.4rem auto' }}
                        />
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.character}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JustWatch Streaming Availability */}
              <WatchProviders providers={providers} />

              {/* Similar Movies */}
              {similar.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem', color: '#f3f4f6' }}>Similar Movies</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                    {similar.map(sim => (
                      <MovieCard
                        key={sim.id}
                        movie={sim}
                        onClick={(m) => onSelectMovie && onSelectMovie(m)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trailer Video Player Overlay Modal */}
        {showTrailer && trailerVideo && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setShowTrailer(false)}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/9' }} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '0',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                ✕ Close Trailer
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
                title="Movie Trailer"
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '12px' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
