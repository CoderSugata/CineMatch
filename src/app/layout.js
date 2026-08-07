import './globals.css';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CineMatch — Smart Movie Discovery & Recommendations',
  description: 'Discover trending movies, filter by genre, check streaming availability via JustWatch, and get personalized recommendations. MSc Computer Science Final Semester Project by Sugata Mondal (2019).',
  keywords: ['movies', 'recommendations', 'TMDB', 'JustWatch', 'streaming', 'IMDb', 'Plex', 'watch list', 'Sugata Mondal']
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 72px)', paddingBottom: '80px' }}>
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
