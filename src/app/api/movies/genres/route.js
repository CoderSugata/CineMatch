import { NextResponse } from 'next/server';
import { TMDB_GENRES } from '@/lib/tmdb';

export async function GET() {
  return NextResponse.json({ success: true, genres: TMDB_GENRES });
}
