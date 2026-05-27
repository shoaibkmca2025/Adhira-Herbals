import { motion } from 'framer-motion';
import { Leaf, Recycle, Eye, Sparkles, Sprout } from 'lucide-react';

const journey = [
  {
    title: 'Sustainable Harvesting',
    body: 'We partner with ethical farmers who respect the land, harvesting at peak potency to ensure maximum efficacy without depleting resources.',
    img: '/images/moringa-leaves.jpg',
  },
  {
    title: 'Sun Drying',
    body: 'Our herbs are naturally shade-dried under controlled conditions, preserving their volatile oils and intrinsic prana exactly as nature intended.',
    img: '/images/moringa-spoon.jpg',
  },
  {
    title: 'Mindful Packaging',
    body: 'Packaged in eco-conscious, minimal materials that protect the integrity of the herbs while honoring our commitment to the planet.',
    img: '/images/adhira-pouch.jpg',
  },
];

const principles = [
  { icon: Leaf, label: 'ORGANIC', body: 'Grown without synthetic chemicals.' },
  { icon: Recycle, label: 'SUSTAINABLE', body: 'Earth-first packaging and practices.' },
  { icon: Eye, label: 'TRANSPARENT', body: 'Clear sourcing, no hidden blends.' },
  { icon: Sparkles, label: 'AYURVEDIC', body: 'Rooted in 5000 years of healing science.' },
];

export default function OurStory() {
  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/images/moringa-leaves.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-100/40 via-cream-100/60 to-cream-100" />
        </div>
        <div className="container-page relative py-28 text-center">
          <span className="pill-badge">
            <Sprout size={14} className="text-forest-600" /> Our Story
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-forest-700 mt-6">
            Rooted in wisdom, <em>grown with care.</em>
          </h1>
          <p className="mt-4 text-forest-700/70 max-w-xl mx-auto">
            Discover the ancient healing power of Ayurveda, reimagined for the modern soul.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="section-label">THE BEGINNING</p>
          <h2 className="font-serif text-4xl text-forest-700 mt-3">
            From an Ayurvedic <em>soul story.</em>
          </h2>
          <p className="mt-5 text-forest-700/80 leading-relaxed">
            Born from a deep reverence for ancient Ayurvedic principles, Adhira Herbals was founded
            on a simple belief: nature holds the key to true wellness. Our journey began in the lush,
            sun-drenched gardens where traditional wisdom meets the earth.
          </p>
          <p className="mt-4 text-forest-700/80 leading-relaxed">
            We are committed to demystifying Ayurveda, transforming it from an ancient text into a
            daily practice. By curating the purest botanicals and crafting them with intention, we
            aim to bring balanced, holistic healing to your modern lifestyle — one thoughtful ritual
            at a time.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="aspect-square rounded-3xl overflow-hidden"
        >
          <img
            src="/images/moringa-bowl-rustic.jpg"
            alt="Adhira herbs"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Journey */}
      <section className="bg-cream-200/60 py-20">
        <div className="container-page text-center">
          <p className="section-label">FARM TO PACK</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-700 mt-3">
            Traceable, <em>step by step.</em>
          </h2>
          <p className="mt-3 text-forest-700/70 max-w-xl mx-auto">
            Transparency in every leaf. See how we sustainably source our ingredients directly from
            earth to your hands.
          </p>
          <div className="mt-14 grid md:grid-cols-3 gap-6 text-left">
            {journey.map((j, i) => (
              <motion.div
                key={j.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-cream-50 rounded-2xl overflow-hidden shadow-card"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={j.img} alt={j.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-forest-600/60 text-sm">0{i + 1}</span>
                  <h3 className="font-serif text-2xl text-forest-700 mt-1">{j.title}</h3>
                  <p className="mt-2 text-sm text-forest-700/75 leading-relaxed">{j.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="container-page py-20 text-center">
        <p className="section-label">OUR GUIDING PRINCIPLES</p>
        <h2 className="font-serif text-4xl text-forest-700 mt-3">
          Ancient wisdom, <em>rigorous science.</em>
        </h2>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {principles.map((p) => (
            <div key={p.label} className="bg-cream-200/60 rounded-2xl p-6">
              <div className="w-11 h-11 mx-auto bg-cream-50 rounded-full flex items-center justify-center text-forest-700">
                <p.icon size={18} strokeWidth={1.6} />
              </div>
              <div className="mt-3 text-xs tracking-wider-2 font-bold text-forest-700">{p.label}</div>
              <p className="text-xs text-forest-700/70 mt-1.5">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
