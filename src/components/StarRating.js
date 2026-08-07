'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, max = 10, size = 15, readOnly = false, showScore = true }) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
      <div
        className="star-rating-control"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2px',
          maxWidth: '100%'
        }}
      >
        {Array.from({ length: max }, (_, i) => {
          const starNum = i + 1;
          const isFilled = starNum <= displayValue;

          return (
            <button
              key={starNum}
              type="button"
              disabled={readOnly}
              className={`star-btn ${isFilled ? 'filled' : ''}`}
              style={{ cursor: readOnly ? 'default' : 'pointer', background: 'none', border: 'none', padding: '1px' }}
              onMouseEnter={() => !readOnly && setHoverValue(starNum)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              onClick={() => !readOnly && onChange && onChange(starNum === value ? 0 : starNum)}
              title={`${starNum} / ${max} Stars`}
            >
              <Star
                size={size}
                fill={isFilled ? '#f5c518' : 'none'}
                color={isFilled ? '#f5c518' : '#4b5563'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>

      {showScore && value > 0 && (
        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#f5c518', background: 'rgba(245, 197, 24, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
          {value} / {max}
        </span>
      )}
    </div>
  );
}
