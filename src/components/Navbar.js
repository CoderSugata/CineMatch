'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Film, Sparkles, Bookmark, Compass, Search, Heart, Star } from 'lucide-react';
import { getFavorites, getRatings } from '@/lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [favCount, setFavCount] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);

  const updateCounts = () => {
    setFavCount(getFavorites().length);
    setRatedCount(Object.keys(getRatings()).length);
  };

  useEffect(() => {
    updateCounts();
    const handleStorage = () => updateCounts();
    window.addEventListener('cinematch_storage_change', handleStorage);
    return () => window.removeEventListener('cinematch_storage_change', handleStorage);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link href="/" className="brand-logo">
          <Film size={30} className="text-accent-gold" color="#f5c518" />
          <span>Cine</span>Match
        </Link>

        <nav className="nav-links">
          <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <Compass size={18} />
            Home
          </Link>
          <Link href="/discover" className={`nav-item ${pathname === '/discover' ? 'active' : ''}`}>
            <Search size={18} />
            Discover
          </Link>
          <Link href="/for-you" className={`nav-item ${pathname === '/for-you' ? 'active' : ''}`}>
            <Sparkles size={18} color="#f5c518" />
            For You
          </Link>
          <Link href="/my-list" className={`nav-item ${pathname === '/my-list' ? 'active' : ''}`}>
            <Bookmark size={18} />
            My List
            {(favCount > 0 || ratedCount > 0) && (
              <span style={{
                background: '#f5c518',
                color: '#000',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.75rem',
                fontWeight: '800'
              }}>
                {favCount + ratedCount}
              </span>
            )}
          </Link>
        </nav>

        <form onSubmit={handleSearchSubmit} className="nav-search">
          <Search size={16} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search movies, actors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
