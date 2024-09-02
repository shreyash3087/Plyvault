import dbConnect from '@/utils/dbConnect';
import Review from '@/models/Review';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const reviews = await Review.find({}); 
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ message: 'An error occurred while fetching reviews.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log('Received request body:', body);

    const {
      productId,
      title,
      description,
      originalPrice,
      discount,
      imageUrl,
      userId,
      company,
      specification,
      design
    } = body;

  
    if (!productId || !title || !description || !originalPrice || !discount || !imageUrl || !userId) {
      console.log("Validation failed:", { productId, title, description, originalPrice, discount, imageUrl, userId });
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    let price = originalPrice;
    if (!isNaN(originalPrice) && !isNaN(discount)) {
      price = originalPrice - (originalPrice * (discount / 100));
      price = price.toFixed(2);
    } else {
      return NextResponse.json({ message: 'Invalid original price or discount.' }, { status: 400 });
    }

    const newReview = new Review({
      productId,
      userId,
      title,
      description,
      price,           
      originalPrice,    
      discount,        
      imageUrl,
      company,
      specification,
      design,
      status: 'pending',
    });

    const savedReview = await newReview.save();

    return NextResponse.json({
      message: 'Review submitted successfully.',
      review: savedReview,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ message: 'An error occurred while submitting the review.' }, { status: 500 });
  }
}
