import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Shield, Sparkles, Leaf, Heart, ArrowRight, Sprout,
  Beaker, Ban, Package, ShieldCheck,
} from 'lucide-react';
import { productsApi } from '../api/endpoints.js';
import TrustStrip from '../components/TrustStrip.jsx';
import Testimonials from '../components/Testimonials.jsx';
import JournalSection from '../components/JournalSection.jsx';
import FAQSection from '../components/FAQSection.jsx';
import NewsletterCTA from '../components/NewsletterCTA.jsx';

const benefits = [
  {
    icon: Shield,
    title: 'Immunity Boost',
    body: "Loaded with antioxidants and vitamin C to naturally fortify your body's natural defenses.",
  },
  {
    icon: Sparkles,
    title: 'Energy Support',
    body: 'Plant-powered iron and B-vitamins for clean, sustained daily energy.',
  },
  {
    icon: Leaf,
    title: 'Rich in Nutrients',
    body: '90+ nutrients including calcium, protein and essential amino acids.',
  },
  {
    icon: Heart,
    title: 'Skin & Hair',
    body: 'Bioactive compounds that nourish skin elasticity and hair strength from within.',
  },
];

const craftedCards = [
  {
    icon: Sprout,
    title: 'Organically Sourced',
    body: 'From family-run farms practising regenerative agriculture.',
  },
  {
    icon: Beaker,
    title: 'Lab Tested',
    body: 'Every batch tested for purity, potency and heavy metals.',
  },
  {
    icon: Leaf,
    title: 'Chemical Free',
    body: 'No additives, fillers, preservatives or artificial colour.',
  },
  {
    icon: ShieldCheck,
    title: 'Sustainable Packaging',
    body: 'Recyclable kraft pouches with food-grade inner lining.',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const { hash } = useLocation();

  useEffect(() => {
    productsApi.bySlug('organic-moringa-powder').then(({ product }) => setFeatured(product)).catch(() => {});
  }, []);

  // Smooth-scroll to anchor when navigating with hash
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [hash]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-page grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="pill-badge">
              <Sprout size={14} className="text-forest-600" /> 100% Organic · Farm to Pack
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-forest-700 mt-6 leading-[1.05]">
              Pure Moringa Powder for <em>everyday wellness.</em>
            </h1>
            <p className="mt-6 text-forest-700/75 max-w-md leading-relaxed">
              Hand-harvested moringa leaves, shade-dried and stone-milled into a nutrient-dense
              superfood — crafted in small batches by Adhira Herbals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                <ShoppingBag size={15} /> Shop Now
              </Link>
              <a href="#benefits" className="btn-outline">Explore Benefits</a>
            </div>

            <div className="mt-12 pt-6 border-t border-forest-600/10 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Happy customers" value="12k+" />
              <Stat label="Avg. rating" value="4.9★" />
              <Stat label="Lab tested" value="100%" />
            </div>
          </motion.div>

          {/* Hero image with floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[5/4] rounded-3xl overflow-hidden shadow-float">
              <img
                src="/images/moringa-bowl.jpg"
                alt="Organic moringa powder in wooden bowl"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="absolute -bottom-5 left-5 sm:left-10 bg-cream-50 rounded-2xl shadow-card px-5 py-4 flex items-center gap-3 max-w-[260px]"
            >
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-forest-700">
                <ShieldCheck size={18} strokeWidth={1.6} />
              </div>
              <div>
                <div className="font-semibold text-forest-700 text-sm">Lab certified</div>
                <div className="text-xs text-forest-700/70">Heavy-metal & pesticide free</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <TrustStrip />

      {/* Benefits */}
      <section id="benefits" className="container-page py-20">
        <div className="text-center">
          <p className="section-label">WHY MORINGA</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-700 mt-3">
            One leaf. <em>Ninety nutrients.</em>
          </h2>
          <p className="mt-3 text-forest-700/70 max-w-2xl mx-auto">
            Known in Ayurveda as the &ldquo;tree of life&rdquo; — a single spoonful supports immunity,
            energy and everyday vitality.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-cream-200/60 rounded-2xl p-6"
            >
              <div className="w-11 h-11 rounded-full bg-cream-50 flex items-center justify-center text-forest-700">
                <b.icon size={18} strokeWidth={1.6} />
              </div>
              <h3 className="font-serif text-2xl text-forest-700 mt-5">{b.title}</h3>
              <p className="text-sm text-forest-700/75 mt-2 leading-relaxed">{b.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured product spotlight */}
      {featured && (
        <section className="container-page py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden grid md:grid-cols-2 bg-cream-50 shadow-card"
          >
            <div className="aspect-square md:aspect-auto md:h-full">
              <img
                src={featured.images?.[0]?.url}
                alt={featured.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <p className="section-label">BESTSELLER</p>
              <h3 className="font-serif text-3xl md:text-4xl text-forest-700 mt-3">
                {featured.name}
              </h3>
              <p className="mt-4 text-forest-700/75 leading-relaxed">{featured.description}</p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-medium text-forest-700">
                  ₹{featured.price}
                </span>
                {featured.compareAtPrice && (
                  <span className="text-lg text-forest-700/40 line-through">
                    ₹{featured.compareAtPrice}
                  </span>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/product/${featured.slug}`} className="btn-primary">
                  <ShoppingBag size={15} /> View Product
                </Link>
                <Link to="/shop" className="btn-outline">All Botanicals</Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Crafted with care */}
      <section className="container-page py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="/images/moringa-leaves.jpg"
                alt="Moringa leaves on branch"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 right-5 bg-cream-50 rounded-2xl shadow-card px-5 py-4 max-w-[260px]">
              <div className="font-serif text-xl text-forest-700">Farm to Pack</div>
              <div className="text-xs text-forest-700/70 mt-1">Traceable from soil to spoon</div>
            </div>
          </motion.div>

          <div>
            <p className="section-label">WHY ADHIRA HERBALS</p>
            <h2 className="font-serif text-4xl md:text-5xl text-forest-700 mt-3">
              Crafted with care. <em>Rooted in tradition.</em>
            </h2>
            <p className="mt-4 text-forest-700/75 leading-relaxed max-w-lg">
              Every step — from harvest to packaging — is designed to preserve the natural potency
              of moringa, the way Ayurveda intended.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {craftedCards.map((c) => (
                <div key={c.title} className="bg-cream-200/60 rounded-2xl p-5">
                  <c.icon size={20} strokeWidth={1.6} className="text-forest-600" />
                  <h4 className="font-serif text-xl text-forest-700 mt-3">{c.title}</h4>
                  <p className="text-sm text-forest-700/70 mt-1.5 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <JournalSection />
      <FAQSection />
      <NewsletterCTA />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="font-serif text-3xl text-forest-700">{value}</div>
      <div className="text-xs text-forest-700/60 mt-0.5">{label}</div>
    </div>
  );
}
