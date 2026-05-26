import { motion } from 'framer-motion';
import { Leaf, Recycle, Eye, Sparkles } from 'lucide-react';

const journey = [
  {
    title: 'Sustainable Harvesting',
    body: 'We partner with ethical farmers who respect the land, harvesting at peak potency to ensure maximum efficacy without depleting resources.',
    img: 'https://images.unsplash.com/photo-1605265541283-2c1c8c0f7a7e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Sun Drying',
    body: 'Our herbs are naturally dried under the sun, preserving their volatile oils and intrinsic prana exactly as nature intended.',
    img: null,
    icon: '☀',
  },
  {
    title: 'Mindful Packaging',
    body: 'Packaged in eco-conscious, minimal materials that protect the integrity of the herbs while honoring our commitment to the planet.',
    img: null,
    icon: '📦',
  },
];

const principles = [
  { icon: Leaf, label: 'ORGANIC', body: 'Grown without synthetic chemicals.' },
  { icon: Recycle, label: 'SUSTAINABLE', body: 'Earth-first packaging and practices.' },
  { icon: Eye, label: 'TRANSPARENT', body: 'Clear sourcing, no hidden blends.' },
  { icon: Sparkles, label: 'AYURVEDIC', body: 'Rooted in 5000 years of healing science.' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[42vh] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1530092285049-1c42085fd395?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100/30 to-cream-100/80" />
        <div className="container-page relative pb-16 text-center w-full">
          <h1 className="font-serif text-5xl text-forest-700">Rooted in Wisdom, Grown with Care.</h1>
          <p className="mt-3 text-forest-700/70">
            Discover the ancient healing power of Ayurveda, reimagined for the modern soul.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-serif text-3xl text-forest-700">The Ayurveda Soul Story</h2>
          <p className="mt-4 text-forest-700/80 leading-relaxed">
            Born from a deep reverence for ancient Ayurvedic principles, Adhira Herbals was founded on a simple belief:
            nature holds the key to true wellness. Our journey began in the lush, sun-drenched gardens where traditional wisdom meets the earth.
          </p>
          <p className="mt-4 text-forest-700/80 leading-relaxed">
            We are committed to demystifying Ayurveda, transforming it from an ancient text into a daily practice.
            By curating the purest botanicals and crafting them with intention, we aim to bring balanced, holistic
            healing to your modern lifestyle, one thoughtful ritual at a time.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="aspect-square rounded-2xl bg-blush-200/60 flex items-center justify-center"
        >
          <Leaf className="text-forest-600/40" size={80} strokeWidth={1} />
        </motion.div>
      </section>

      {/* Journey */}
      <section className="bg-blush-100 py-20">
        <div className="container-page text-center">
          <h2 className="font-serif text-3xl text-forest-700">The Farm-to-Pack Journey</h2>
          <p className="mt-3 text-forest-700/70 max-w-xl mx-auto">
            Transparency in every leaf. See how we sustainably source our ingredients directly from earth to your hands.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            {journey.map((j, i) => (
              <motion.div
                key={j.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-blush-200 flex items-center justify-center text-5xl text-forest-600/40">
                  {j.img ? (
                    <img src={j.img} alt={j.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>{j.icon}</span>
                  )}
                </div>
                <h3 className="font-serif text-xl text-forest-700 mt-5">
                  {i + 1}. {j.title}
                </h3>
                <p className="mt-2 text-sm text-forest-700/70">{j.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Science */}
      <section className="container-page py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] rounded-2xl bg-cream-200 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&w=900&q=80"
            alt="Lab testing"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl text-forest-700">Ancient Wisdom, Rigorous Science</h2>
          <p className="mt-4 text-forest-700/80 leading-relaxed">
            We believe that purity should never be assumed; it must be proven. Every batch of Adhira Herbals
            undergoes strict laboratory testing to ensure zero heavy metals, pesticides, or contaminants.
          </p>
          <p className="mt-4 text-forest-700/80 leading-relaxed">
            Our quality control merges modern analytical techniques with traditional organoleptic assessment
            (taste, sight, smell) to guarantee you receive the most authentic, potent herbal experience possible.
          </p>
          <button className="btn-primary mt-6">View Our Standards</button>
        </div>
      </section>

      {/* Principles */}
      <section className="container-page pb-20 text-center">
        <h2 className="font-serif text-3xl text-forest-700">Our Guiding Principles</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {principles.map((p) => (
            <div key={p.label}>
              <div className="w-10 h-10 mx-auto bg-blush-200 rounded-full flex items-center justify-center text-forest-600">
                <p.icon size={18} />
              </div>
              <div className="mt-3 text-xs tracking-wider-2 font-semibold text-forest-700">{p.label}</div>
              <p className="text-xs text-forest-700/70 mt-1 max-w-[160px] mx-auto">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
