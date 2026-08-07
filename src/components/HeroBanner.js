'use client';

import { useState } from 'react';
import { Play, Info, Heart, Star, Sparkles } from 'lucide-react';
import { getBackdropUrl } from '@/lib/tmdb';
import { isFavorite, toggleFavorite } from '@/lib/storage';

export default function HeroBanner({ movie, onSelectMovie }) {
  const [fav, setFav] = useState(movie ? isFavorite(movie.id) : false);

  if (!movie) return null;

  const backdrop = getBackdropUrl(movie.backdrop_path);
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleFavClick = (e) => {
    e.stopPropagation();
    const updated = toggleFavorite(movie);
    setFav(updated);
  };

  return (
    <div
      className="hero-banner"
      style={{ backgroundImage: `url(${backdrop})` }}
      onClick={() => onSelectMovie && onSelectMovie(movie)}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> FEATURED SPOTLIGHT
          </div>

          <h1 className="hero-title">{movie.title}</h1>

          <div className="hero-meta">
            <div className="rating-badge">
              <Star size={16} fill="#f5c518" color="#f5c518" />
              <span>{voteAverage} / 10</span>
            </div>
            <span>{releaseYear}</span>
            <span>{movie.genres?.map(g => g.name || g).join(', ') || 'Sci-Fi / Drama'}</span>
          </div>

          <p className="hero-overview">{movie.overview}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelectMovie && onSelectMovie(movie);
              }}
            >
              <Info size={18} /> View Details & Streaming
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleFavClick}
              style={{ color: fav ? '#e50914' : '#fff', borderColor: fav ? '#e50914' : 'rgba(255,255,255,0.1)' }}
            >
              <Heart size={18} fill={fav ? '#e50914' : 'none'} color={fav ? '#e50914' : '#fff'} />
              {fav ? 'In Favorites' : 'Add to List'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
