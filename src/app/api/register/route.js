import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { hashPassword, createToken } from '@/utils/jwt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password, role } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    const token = createToken({ id: newUser._id, email: newUser.email, role: newUser.role });

    const response = NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 500 });
  }
}
