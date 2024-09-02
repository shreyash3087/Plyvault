import dbConnect from '@/utils/dbConnect';
import Contact from '@/models/Contact'; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
