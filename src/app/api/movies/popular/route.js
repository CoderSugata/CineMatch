import { NextResponse } from 'next/server';
import { getPopularMovies } from '@/lib/tmdb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const movies = await getPopularMovies(page);
    return NextResponse.json({ success: true, results: movies });
  } catch (error) {
    console.error('Popular API route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch popular movies' }, { status: 500 });
  }
}
