import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import User from '@/models/User';

export async function GET(req) {
  const tokenObject = req.cookies.get('token');
  const token = tokenObject ? tokenObject.value : null;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
