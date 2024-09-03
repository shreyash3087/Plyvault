import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import Review from '@/models/Review';
import User from '@/models/User';
import { cookies } from 'next/headers';
export async function GET(req) {
  const cookieStore = cookies();
  const tokenObject = cookieStore.get('token');
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
    const user = await User.findOne({ email: decoded.email });
    const submissions = await Review.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return NextResponse.json({ submissions: [] }, { status: 500 });
  }
}
