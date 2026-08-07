'use client';

import { useState, useEffect } from 'react';
import { Tv } from 'lucide-react';
import { getPosterUrl } from '@/lib/tmdb';

const REGIONS = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' }
];

export default function WatchProviders({ providers = {} }) {
  const [region, setRegion] = useState('IN');
  const [activeTab, setActiveTab] = useState('flatrate'); // flatrate, rent, buy

  // Determine current region data (defaults to IN -> US -> first available region)
  const currentRegionData = providers[region] || providers['IN'] || providers['US'] || Object.values(providers)[0] || {};
  const flatrate = currentRegionData.flatrate || [];
  const rent = currentRegionData.rent || [];
  const buy = currentRegionData.buy || [];

  // Auto-switch to an available tab if flatrate is empty for selected region
  useEffect(() => {
    if (flatrate.length > 0) setActiveTab('flatrate');
    else if (rent.length > 0) setActiveTab('rent');
    else if (buy.length > 0) setActiveTab('buy');
    else setActiveTab('flatrate');
  }, [region, providers]);

  const currentList = activeTab === 'flatrate' ? flatrate : activeTab === 'rent' ? rent : buy;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tv size={20} color="#f5c518" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Where to Watch (JustWatch)</h3>
        </div>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="filter-select"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
        >
          {REGIONS.map(r => (
            <option key={r.code} value={r.code}>{r.name} ({r.code})</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('flatrate')}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: '600',
            background: activeTab === 'flatrate' ? '#f5c518' : 'transparent',
            color: activeTab === 'flatrate' ? '#000' : '#9ca3af'
          }}
        >
          Stream ({flatrate.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rent')}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: '600',
            background: activeTab === 'rent' ? '#f5c518' : 'transparent',
            color: activeTab === 'rent' ? '#000' : '#9ca3af'
          }}
        >
          Rent ({rent.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('buy')}
          style={{
            padding: '0.4rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: '600',
            background: activeTab === 'buy' ? '#f5c518' : 'transparent',
            color: activeTab === 'buy' ? '#000' : '#9ca3af'
          }}
        >
          Buy ({buy.length})
        </button>
      </div>

      {/* Provider Badges */}
      {currentList.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
          {currentList.map(item => (
            <div
              key={item.provider_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#121824',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {item.logo_path && (
                <img
                  src={getPosterUrl(item.logo_path, 'w92')}
                  alt={item.provider_name}
                  style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                />
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f3f4f6' }}>
                {item.provider_name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic', padding: '0.5rem 0' }}>
          No {activeTab} providers listed for this region.
        </div>
      )}

      {currentRegionData.link && (
        <div style={{ marginTop: '0.85rem', textAlign: 'right' }}>
          <a
            href={currentRegionData.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.78rem', color: '#f5c518', textDecoration: 'underline' }}
          >
            Data provided by JustWatch ↗
          </a>
        </div>
      )}
    </div>
  );
}
