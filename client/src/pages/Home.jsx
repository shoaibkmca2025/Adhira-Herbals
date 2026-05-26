import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Leaf, Sparkles, Beaker, Ban, Globe } from 'lucide-react';
import { productsApi } from '../api/endpoints.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../store/cart.js';
import toast from 'react-hot-toast';

const benefits = [
  { icon: Shield, title: 'Immunity Support', body: 'Rich in antioxidants and Vitamin C to naturally fortify your body’s defenses.' },
  { icon: Zap, title: 'Sustained Energy', body: 'Caffeine-free vitality derived from bioavailable iron and essential amino acids.' },
  { icon: Leaf, title: 'Dense Nutrients', body: 'Packed with 90+ nutrients including calcium, potassium, and vitamins A & E.' },
  { icon: Sparkles, title: 'Radiant Skin', body: 'Promotes cellular health and combats oxidative stress for a natural glow.' },
];

const trust = [
  { icon: Leaf, label: '100% Organic' },
  { icon: Beaker, label: 'Lab Tested' },
  { icon: Ban, label: 'Chemical Free' },
  { icon: Globe, label: 'Sustainably Sourced' },
];

export default function Home() {
  const [hero, setHero] = useState(null);
  const [purchaseOption, setPurchaseOption] = useState('one-time');
  const { add } = useCart();

  useEffect(() => {
    productsApi.bySlug('organic-moringa-powder').then(({ product }) => setHero(product)).catch(() => {});
  }, []);

  async function handleAdd() {
    if (!hero) return;
    try {
      await add({ product: hero, variantLabel: hero.variants?.[1]?.label || null, quantity: 1 });
      toast.success('Added to cart');
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cream-100 via-cream-100 to-forest-100" />
        <div className="container-page relative grid md:grid-cols-2 gap-8 items-center py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-wider-2 text-forest-600 font-medium">100% ORGANIC ORIGIN</p>
            <h1 className="font-serif text-5xl md:text-6xl text-forest-700 mt-4 leading-[1.05]">
              Pure Moringa Powder for Everyday Wellness
            </h1>
            <p className="mt-6 text-forest-700/70 max-w-md leading-relaxed">
              Elevate your daily vitality with nature&apos;s most nutrient-dense superfood.
              Sustainably sourced, gently processed, and deeply nourishing.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/shop" className="btn-primary">Shop Now</Link>
              <a href="#benefits" className="btn-outline">Explore Benefits</a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=1200&q=80"
              alt="Pure Moringa Powder"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Miracle Tree benefits */}
      <section id="benefits" className="py-20">
        <div className="container-page text-center">
          <h2 className="font-serif text-4xl text-forest-700">The Miracle Tree</h2>
          <p className="mt-3 text-forest-700/70 max-w-2xl mx-auto">
            Discover why Moringa is celebrated in ancient Ayurvedic traditions for its comprehensive healing properties.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-blush-100 rounded-2xl p-6 text-left"
              >
                <div className="w-10 h-10 bg-forest-100/60 rounded-full flex items-center justify-center text-forest-600">
                  <b.icon size={18} />
                </div>
                <h3 className="font-serif text-xl text-forest-700 mt-5">{b.title}</h3>
                <p className="text-sm text-forest-700/70 mt-2 leading-relaxed">{b.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured product */}
      {hero && (
        <section className="bg-blush-200/60 py-20">
          <div className="container-page grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <img
                src={hero.images?.[0]?.url}
                alt={hero.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-cream-50 text-forest-700 text-xs tracking-wider-2 font-semibold px-3 py-1.5 rounded-full">
                Bestseller
              </span>
            </div>
            <div>
              <p className="text-xs tracking-wider-2 text-forest-600 font-medium">SIGNATURE BLEND</p>
              <h2 className="font-serif text-4xl text-forest-700 mt-3">{hero.name}</h2>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl text-forest-700 font-medium">{formatPrice(hero.price)}</span>
                {hero.compareAtPrice && (
                  <span className="text-base text-forest-700/40 line-through">
                    {formatPrice(hero.compareAtPrice)}
                  </span>
                )}
              </div>
              <p className="mt-5 text-forest-700/70 max-w-md leading-relaxed">{hero.description}</p>

              <div className="mt-6 space-y-3">
                {[
                  { id: 'one-time', label: 'One-time purchase', price: hero.price },
                  { id: 'subscribe', label: 'Subscribe & Save 15%', price: Math.round(hero.price * 0.85), note: 'Delivered every 30 days' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition
                      ${purchaseOption === opt.id ? 'border-forest-600 bg-cream-100' : 'border-forest-600/15 bg-cream-100/50'}`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="opt"
                        className="accent-forest-600"
                        checked={purchaseOption === opt.id}
                        onChange={() => setPurchaseOption(opt.id)}
                      />
                      <span>
                        <div className="text-sm text-forest-700">{opt.label}</div>
                        {opt.note && <div className="text-xs text-forest-700/60">{opt.note}</div>}
                      </span>
                    </span>
                    <span className="font-medium">{formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>

              <button onClick={handleAdd} className="btn-primary w-full mt-6">
                Add to Cart
              </button>
              <p className="mt-3 flex items-center justify-center gap-6 text-xs text-forest-700/70">
                <span>📦 Free Shipping over {formatPrice(4000)}</span>
                <span>↺ 30-Day Guarantee</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="py-16">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6">
          {trust.map((t) => (
            <div key={t.label} className="text-center">
              <t.icon size={22} className="mx-auto text-forest-600" />
              <div className="mt-2 text-sm text-forest-700">{t.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
