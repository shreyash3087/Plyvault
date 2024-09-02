import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    await dbConnect();
    const {
      title,
      description,
      price,
      originalPrice,
      discount,
      company,
      specification,
      design,
      imageUrl,
    } = await req.json();


    if (!title || !description || !price || !originalPrice || !discount || !company) {
      return NextResponse.json(
        { message: 'Title, description, price, original price, discount, and company are required.' },
        { status: 400 }
      );
    }

  
    const newProduct = new Product({
      title,
      description,
      price,
      originalPrice,
      discount,
      company,
      specification, 
      design,
      imageUrl,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        message: 'Product created successfully.',
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the product.' },
      { status: 500 }
    );
  }
}