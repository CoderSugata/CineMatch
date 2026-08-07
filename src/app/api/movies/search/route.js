import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const genre = searchParams.get('genre') || '';
    const year = searchParams.get('year') || '';
    const minRating = searchParams.get('minRating') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const movies = await searchMovies({ query, genre, year, minRating, sortBy, page });
    return NextResponse.json({ success: true, results: movies });
  } catch (error) {
    console.error('Search API route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search movies' }, { status: 500 });
  }
}
