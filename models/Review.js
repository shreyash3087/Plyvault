import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  price: Number,
  originalPrice: Number, 
  discount: Number, 
  imageUrl: String,
  company: String,
  specification: {
    headings: [String],
    specs: [String],   
  },
  design: String, 
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
