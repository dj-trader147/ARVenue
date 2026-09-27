const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    department: {
      type: String,
      enum: ['mens', 'womens', 'kids', 'premium-lounge'],
      required: true
    },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    video: { type: String, default: '' },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    style: {
      type: String,
      enum: ['Casual', 'Formal', 'Exclusive', 'All'],
      default: 'Casual'
    },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
