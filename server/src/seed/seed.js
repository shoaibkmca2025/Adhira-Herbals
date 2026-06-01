import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

const products = [
  {
    name: 'Organic Moringa Powder',
    slug: 'organic-moringa-powder',
    tagline: 'Energy & Vitality',
    category: 'superfood',
    price: 600, // INR — matches 250g default
    images: [
      { url: '/images/adhira-pouch.jpg', alt: 'Adhira Herbals organic moringa powder pouch' },
    ],
    description:
      'Known in Ayurveda as Shigru, our shade-dried Moringa preserves the delicate cellular structure of the leaves for maximum nutrient retention.',
    longDescription:
      'Adhira Herbals Moringa is harvested from biodynamic farms in southern India, hand-sorted, and gently shade-dried in small batches to preserve its full vitamin and chlorophyll profile.',
    variants: [
      { label: '250g', price: 600, stock: 100 },
      { label: '500g', price: 1100, stock: 60 },
      { label: '1kg', price: 2000, stock: 30 },
    ],
    benefits: [
      { title: 'Sustained Energy', description: 'Rich in iron and B-vitamins to combat fatigue naturally — no caffeine crash.' },
      { title: 'Immunity Support', description: 'Packed with Vitamin C and powerful antioxidants to defend against environmental stressors.' },
      { title: 'Radiant Skin', description: 'High Vitamin A and E content promotes collagen production and cellular renewal.' },
    ],
    ingredients: ['100% Organic Moringa oleifera leaf powder'],
    nutritionalFacts: [
      { label: 'Protein', value: '27g / 100g' },
      { label: 'Calcium', value: '2003 mg / 100g' },
      { label: 'Iron', value: '28 mg / 100g' },
      { label: 'Vitamin A', value: '6780 µg / 100g' },
    ],
    usage: 'Mix 1 tsp (~3g) into water, smoothies, or warm (not hot) milk once daily, preferably in the morning.',
    storage: 'Store in a cool, dry place away from direct sunlight. Reseal tightly after use.',
    badges: ['BEST SELLER', '100% Organic', 'Lab Tested'],
    isFeatured: true,
    stock: 245,
    rating: 4.8,
    reviewCount: 128,
  },
];

async function run() {
  await connectDB();
  console.log('[seed] clearing collections...');
  await Promise.all([
    Product.deleteMany({}),
    User.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log('[seed] inserting products...');
  await Product.insertMany(products);

  console.log('[seed] creating admin + demo user...');
  const admin = new User({
    name: 'Adhira Admin',
    email: 'admin@adhiraherbals.com',
    role: 'admin',
  });
  await admin.setPassword('Admin@123');
  await admin.save();

  const demo = new User({
    name: 'Asha Patel',
    email: 'demo@adhiraherbals.com',
    role: 'user',
    addresses: [
      {
        label: 'Home',
        firstName: 'Asha',
        lastName: 'Patel',
        line1: '12 Lotus Lane',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        phone: '+919999999999',
        isDefault: true,
      },
    ],
  });
  await demo.setPassword('Demo@1234');
  await demo.save();

  console.log('[seed] done.');
  console.log('  admin: admin@adhiraherbals.com / Admin@123');
  console.log('  demo:  demo@adhiraherbals.com  / Demo@1234');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('[seed] failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
