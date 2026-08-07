'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, Info, Tv } from 'lucide-react';
import { getPosterUrl } from '@/lib/tmdb';
import { isFavorite, toggleFavorite, getMovieRating } from '@/lib/storage';

export default function MovieCard({ movie, onClick, showMatchScore = false }) {
  const [fav, setFav] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (movie) {
      setFav(isFavorite(movie.id));
      setUserRating(getMovieRating(movie.id));
    }
  }, [movie]);

  const handleFavClick = (e) => {
    e.stopPropagation();
    const updated = toggleFavorite(movie);
    setFav(updated);
  };

  if (!movie) return null;

  const displayTitle = movie.title || movie.name || 'Untitled';
  const releaseYear = (movie.release_date || movie.first_air_date) ? (movie.release_date || movie.first_air_date).substring(0, 4) : '';
  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const isTV = movie.media_type === 'tv' || !!movie.name;

  return (
    <div className="movie-card" onClick={() => onClick && onClick(movie)}>
      <div className="poster-wrapper">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={displayTitle}
          className="poster-img"
          loading="lazy"
        />

        <button
          type="button"
          className={`quick-fav-btn ${fav ? 'active' : ''}`}
          onClick={handleFavClick}
          title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart size={18} fill={fav ? '#e50914' : 'none'} color={fav ? '#e50914' : '#ffffff'} />
        </button>

        {showMatchScore && movie.matchScore && (
          <div className="card-match-tag">
            {movie.matchScore}% Match
          </div>
        )}

        {isTV && (
          <div style={{
            position: 'absolute',
            bottom: '0.6rem',
            left: '0.6rem',
            zIndex: 10,
            background: 'rgba(59, 130, 246, 0.9)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            fontSize: '0.68rem',
            fontWeight: '800',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Tv size={10} /> TV Series
          </div>
        )}

        <div className="card-overlay-btn">
          <span className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
            <Info size={14} /> Quick View
          </span>
        </div>
      </div>

      <div className="card-info">
        <div className="card-title" title={displayTitle}>
          {displayTitle}
        </div>

        <div className="card-meta">
          <span>{releaseYear}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {userRating > 0 && (
              <span className="user-star-indicator" title={`Your Rating: ${userRating}/10`}>
                <Star size={13} fill="#f5c518" color="#f5c518" />
                {userRating}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f5c518', fontWeight: '700' }}>
              ★ {voteAverage}
            </span>
          </div>
        </div>

        {movie.matchReason && (
          <div style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '0.2rem', fontStyle: 'italic' }}>
            {movie.matchReason}
          </div>
        )}
      </div>
    </div>
  );
}
