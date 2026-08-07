import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const window = searchParams.get('window') || 'day';
    const movies = await getTrendingMovies(window);
    return NextResponse.json({ success: true, results: movies });
  } catch (error) {
    console.error('Trending API route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch trending movies' }, { status: 500 });
  }
}
