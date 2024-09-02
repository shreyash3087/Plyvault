import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import Review from '@/models/Review';

export async function GET(req) {
  const tokenObject = req.cookies.get('token');
  const token = tokenObject ? tokenObject.value : null;

  if (!token) {
    return NextResponse.json({ submissions: [] }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ submissions: [] }, { status: 401 });
    }

    const submissions = await Review.find({ userId: decoded.id }).sort({ createdAt: -1 });
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return NextResponse.json({ submissions: [] }, { status: 500 });
  }
}
