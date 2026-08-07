import { NextResponse } from 'next/server';
import { generateRecommendations } from '@/lib/recommendationEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const favorites = body.favorites || [];
    const ratings = body.ratings || {};

    const recommendations = await generateRecommendations(favorites, ratings);
    return NextResponse.json({ success: true, results: recommendations });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
