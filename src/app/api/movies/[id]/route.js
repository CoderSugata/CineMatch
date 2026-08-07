import { NextResponse } from 'next/server';
import { getMovieDetails } from '@/lib/tmdb';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const movieId = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie';

    if (!movieId) {
      return NextResponse.json({ success: false, error: 'Movie ID required' }, { status: 400 });
    }

    const movie = await getMovieDetails(movieId, type);
    return NextResponse.json({ success: true, movie });
  } catch (error) {
    console.error('Movie details API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
