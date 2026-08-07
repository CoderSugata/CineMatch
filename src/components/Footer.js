import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#070a0f',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2.5rem 1.5rem',
      marginTop: '4rem',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '0.88rem'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: '800', color: '#f3f4f6' }}>
          <Film size={24} color="#f5c518" />
          <span>Cine</span><span style={{ color: '#f5c518' }}>Match</span>
        </div>

        <p style={{ maxWidth: '620px', lineHeight: '1.6', color: '#9ca3af', fontSize: '0.86rem' }}>
          MSc. Computer Science Final Semester Project (2019) • Created by <strong>Sugata Mondal</strong>.
        </p>

        <div style={{ color: '#6b7280', fontSize: '0.78rem', marginTop: '0.2rem' }}>
          © 2026 Sugata Mondal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
