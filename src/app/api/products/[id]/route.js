import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const updateData = await req.json();
    const cleanedUpdateData = {};
    const fieldsToUpdate = [
      'title', 
      'price', 
      'originalPrice', 
      'discount', 
      'imageUrl', 
      'description', 
      'company', 
      'specification', 
      'design'
    ];
    if (updateData.discount !== undefined && updateData.originalPrice !== undefined) {
      const originalPrice = parseFloat(updateData.originalPrice.new);
      const discount = parseFloat(updateData.discount.new);

      if (!isNaN(originalPrice) && !isNaN(discount)) {
        const price = originalPrice - (originalPrice * (discount / 100));
        cleanedUpdateData.price = price.toFixed(2);
      }
    }
    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'specification') {
          cleanedUpdateData[field] = updateData[field];
        } 
        else if (field !== 'price') {
          cleanedUpdateData[field] = updateData[field].new;
        }
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(id, cleanedUpdateData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
