'use client';

import { Search, Filter, Sliders, RefreshCw } from 'lucide-react';
import { TMDB_GENRES } from '@/lib/tmdb';

const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015', '2010', '2000', '1994'];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Release Date (Newest)' },
  { value: 'title.asc', label: 'Title (A - Z)' }
];

export default function FilterBar({
  query,
  setQuery,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  onReset
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Search by movie title, keyword, or actor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            background: '#121824',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f3f4f6',
            padding: '0.9rem 1rem 0.9rem 3.2rem',
            borderRadius: '12px',
            fontSize: '1rem'
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '0.85rem'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Genre Pills Row */}
      <div className="genre-pills">
        <button
          type="button"
          className={`genre-pill ${!selectedGenre ? 'active' : ''}`}
          onClick={() => setSelectedGenre('')}
        >
          All Genres
        </button>
        {TMDB_GENRES.map(g => (
          <button
            key={g.id}
            type="button"
            className={`genre-pill ${String(selectedGenre) === String(g.id) ? 'active' : ''}`}
            onClick={() => setSelectedGenre(String(g.id) === String(selectedGenre) ? '' : String(g.id))}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Advanced Select Dropdowns & Slider */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Min Rating:</span>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="filter-select"
          >
            <option value="">Any Rating</option>
            <option value="8">8+ Stars (Masterpieces)</option>
            <option value="7">7+ Stars (Great)</option>
            <option value="6">6+ Stars (Good)</option>
            <option value="5">5+ Stars (Average)</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {(query || selectedGenre || selectedYear || minRating || sortBy !== 'popularity.desc') && (
          <button
            type="button"
            onClick={onReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#f5c518',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginLeft: 'auto'
            }}
          >
            <RefreshCw size={14} /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
