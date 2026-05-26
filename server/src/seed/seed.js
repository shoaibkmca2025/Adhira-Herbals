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
    price: 1990, // INR
    compareAtPrice: 2299,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80',
        alt: 'Bowl of moringa powder',
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Moringa drink',
      },
      {
        url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Moringa powder mound',
      },
    ],
    description:
      'Known in Ayurveda as Shigru, our shade-dried Moringa preserves the delicate cellular structure of the leaves for maximum nutrient retention.',
    longDescription:
      'Adhira Herbals Moringa is harvested from biodynamic farms in southern India, hand-sorted, and gently shade-dried in small batches to preserve its full vitamin and chlorophyll profile.',
    variants: [
      { label: '100g', price: 990, compareAtPrice: 1199, stock: 120 },
      { label: '250g', price: 1990, compareAtPrice: 2299, stock: 85 },
      { label: '500g', price: 3490, compareAtPrice: 3999, stock: 40 },
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
  {
    name: 'Ashwagandha Extract',
    slug: 'ashwagandha-extract',
    tagline: 'Stress Relief & Calm',
    category: 'calm',
    price: 2490,
    compareAtPrice: 2799,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611073761666-3e3eaf75bef2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Ashwagandha tincture',
      },
    ],
    description: 'Premium KSM-66 ashwagandha root extract for stress, sleep, and recovery.',
    longDescription:
      'Standardized to 5% withanolides. Each dropper delivers a clinically meaningful dose of ashwagandha rhizome extract from biodynamic farms.',
    variants: [
      { label: '30ml', price: 2490, stock: 60 },
      { label: '60ml', price: 4290, stock: 35 },
    ],
    benefits: [
      { title: 'Stress Relief', description: 'Clinically shown to lower cortisol and support a calm mind.' },
      { title: 'Better Sleep', description: 'Supports deeper, more restorative sleep cycles.' },
    ],
    ingredients: ['Ashwagandha root extract (Withania somnifera)', 'Vegetable glycerin', 'Purified water'],
    usage: '15–20 drops in water, twice daily.',
    storage: 'Keep in original glass bottle, away from sunlight.',
    badges: ['Lab Tested'],
    isFeatured: true,
    stock: 95,
    rating: 4.6,
    reviewCount: 94,
  },
  {
    name: 'Golden Turmeric Blend',
    slug: 'golden-turmeric-blend',
    tagline: 'Immunity & Inflammation',
    category: 'immunity',
    price: 2190,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
        alt: 'Golden turmeric blend',
      },
    ],
    description: 'High-curcumin turmeric paired with black pepper and ginger for maximum bioavailability.',
    longDescription:
      'A traditional Ayurvedic blend designed to support joint comfort and immune resilience. Curcumin is paired with piperine (4%) to dramatically boost absorption.',
    variants: [
      { label: '150g', price: 2190, stock: 50 },
      { label: '300g', price: 3990, stock: 25 },
    ],
    benefits: [
      { title: 'Joint Comfort', description: 'Curcumin supports a healthy inflammatory response.' },
      { title: 'Immunity', description: 'Daily defense from antioxidant-rich whole spices.' },
    ],
    ingredients: ['Organic turmeric (Curcuma longa)', 'Black pepper', 'Ginger root'],
    usage: '1/2 tsp in warm milk or water before bed.',
    storage: 'Airtight container, cool dry place.',
    badges: ['NEW'],
    isFeatured: true,
    stock: 75,
    rating: 4.7,
    reviewCount: 42,
  },
  {
    name: 'Triphala Digest',
    slug: 'triphala-digest',
    tagline: 'Digestion & Detox',
    category: 'digestion',
    price: 1690,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599909533675-3cf68f9d5b35?auto=format&fit=crop&w=1200&q=80',
        alt: 'Triphala powder and fruits',
      },
    ],
    description: 'The classic three-fruit blend for gentle daily digestion and cleansing.',
    longDescription:
      'Triphala — Amalaki, Bibhitaki, Haritaki — has been used in Ayurveda for over 2000 years to support gentle elimination, gut tone, and assimilation.',
    variants: [
      { label: '100g', price: 1690, stock: 70 },
      { label: '250g', price: 2990, stock: 45 },
    ],
    benefits: [
      { title: 'Daily Detox', description: 'Supports gentle, natural elimination.' },
      { title: 'Digestive Tone', description: 'Strengthens the gut wall and promotes assimilation.' },
    ],
    ingredients: ['Amalaki', 'Bibhitaki', 'Haritaki'],
    usage: '1/2 tsp in warm water before bed.',
    storage: 'Cool, dry place.',
    badges: [],
    isFeatured: false,
    stock: 115,
    rating: 4.5,
    reviewCount: 87,
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
