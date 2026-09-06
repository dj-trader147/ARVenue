const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  colorHex: { type: String, default: '#111111' },
  size: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, default: '' }
})

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
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 4
        },
        message: 'Maximum 4 images allowed per product'
      },
      default: []
    },
    video: { type: String, default: '' },
    variants: [variantSchema],
    style: {
      type: String,
      enum: ['Casual', 'Formal', 'Exclusive', 'All'],
      default: 'Casual'
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 }
  },
  { timestamps: true }
)

productSchema.virtual('inStock').get(function () {
  if (!this.variants || this.variants.length === 0) return false
  return this.variants.some(function (v) {
    return v.stock > 0
  })
})

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Product', productSchema)
