import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: true,
  },
  specification: {
    headings: [String], 
    specs: [String],    
  },
  design: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
