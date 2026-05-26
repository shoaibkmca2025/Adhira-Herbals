import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, maxlength: 120 },
    body: { type: String, maxlength: 2000 },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.recalcProduct = async function (productId) {
  const agg = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        avg: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);
  const Product = mongoose.model('Product');
  if (agg.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(agg[0].avg * 10) / 10,
      reviewCount: agg[0].count,
    });
  }
};

export default mongoose.model('Review', reviewSchema);
