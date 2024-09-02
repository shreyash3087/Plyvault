import dbConnect from '@/utils/dbConnect';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const { id } = params;
  const { status, productUpdate, adminId } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'Review ID and status are required' }, { status: 400 });
  }

  try {
    await dbConnect();


    console.log('PUT Request Details:', { id, status, productUpdate, adminId });


    const reviewUpdateData = { status };
    if (adminId) {
      reviewUpdateData.adminId = adminId;
    }

    console.log('Updating review with data:', reviewUpdateData);
    const review = await Review.findByIdAndUpdate(id, reviewUpdateData, { new: true });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    console.log('Updated review:', review);

  
    if (status === 'approved' && productUpdate) {
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

      if (productUpdate.discount !== undefined && productUpdate.originalPrice !== undefined) {
        const originalPrice = parseFloat(productUpdate.originalPrice);
        const discount = parseFloat(productUpdate.discount);

        if (!isNaN(originalPrice) && !isNaN(discount)) {
          const price = originalPrice - (originalPrice * (discount / 100));
          cleanedUpdateData.price = price.toFixed(2);
        }
      }

      fieldsToUpdate.forEach(field => {
        if (productUpdate[field] !== undefined) {
          if (field === 'specification') {
            cleanedUpdateData[field] = productUpdate[field];
          } else if (field !== 'price') {
            cleanedUpdateData[field] = productUpdate[field];
          }
        }
      });

      console.log('Product update data:', cleanedUpdateData);

      const productUpdateRes = await Product.findByIdAndUpdate(review.productId, cleanedUpdateData, { new: true });

      if (!productUpdateRes) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      console.log('Updated product:', productUpdateRes);
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
