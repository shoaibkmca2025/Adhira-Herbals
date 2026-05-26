import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    stock: { type: Number, default: 0 },
    sku: String,
  },
  { _id: true }
);

const benefitSchema = new mongoose.Schema(
  { title: String, description: String },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    tagline: String,
    description: String,
    longDescription: String,
    category: {
      type: String,
      enum: ['immunity', 'energy', 'digestion', 'calm', 'skincare', 'superfood'],
      default: 'superfood',
      index: true,
    },
    price: { type: Number, required: true },
    compareAtPrice: Number,
    currency: { type: String, default: 'INR' },
    images: [{ url: String, alt: String }],
    variants: [variantSchema],
    benefits: [benefitSchema],
    ingredients: [String],
    nutritionalFacts: [
      {
        label: String,
        value: String,
      },
    ],
    usage: String,
    storage: String,
    badges: [String],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Product', productSchema);
