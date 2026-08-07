'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Sparkles, Bookmark } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="mobile-nav">
      <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Compass size={20} />
        Home
      </Link>
      <Link href="/discover" className={`mobile-nav-item ${pathname === '/discover' ? 'active' : ''}`}>
        <Search size={20} />
        Discover
      </Link>
      <Link href="/for-you" className={`mobile-nav-item ${pathname === '/for-you' ? 'active' : ''}`}>
        <Sparkles size={20} />
        For You
      </Link>
      <Link href="/my-list" className={`mobile-nav-item ${pathname === '/my-list' ? 'active' : ''}`}>
        <Bookmark size={20} />
        My List
      </Link>
    </div>
  );
}
