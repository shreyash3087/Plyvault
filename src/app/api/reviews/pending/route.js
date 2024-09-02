import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Review from '@/models/Review';

export async function GET() {
  try {
    await dbConnect();
    const pendingReviews = await Review.find({ status: 'pending' });
    return NextResponse.json({ success: true, reviews: pendingReviews });
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch pending reviews' }, { status: 500 });
  }
}
