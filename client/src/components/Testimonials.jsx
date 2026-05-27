import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    quote: 'Three weeks in and my energy is noticeably steadier through the day. Smells beautifully fresh.',
    name: 'Priya S.',
    city: 'Bengaluru',
  },
  {
    quote: 'Replaced my morning coffee with a moringa-lemon drink. My skin and sleep both feel better.',
    name: 'Arjun M.',
    city: 'Mumbai',
  },
  {
    quote: 'Finally a brand that feels honest. The packaging, the quality — it shows in every spoon.',
    name: 'Ritika V.',
    city: 'Delhi',
  },
  {
    quote: 'Subscribed after the first pack. The discount is a bonus, the consistency is the real win.',
    name: 'Sandeep K.',
    city: 'Pune',
  },
];

export default function Testimonials() {
  return (
    <section className="container-page py-20">
      <div className="text-center">
        <p className="section-label">LOVED BY 12,000+</p>
        <h2 className="font-serif text-4xl md:text-5xl text-forest-700 mt-3">
          Real people. <em>Real wellness.</em>
        </h2>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="bg-cream-50 rounded-2xl p-6 shadow-card"
          >
            <div className="flex gap-0.5 text-gold-500">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star key={n} size={14} className="fill-gold-500" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-4 text-sm text-forest-700/85 leading-relaxed">&quot;{r.quote}&quot;</p>
            <div className="mt-5 pt-4 border-t border-forest-600/10">
              <div className="font-semibold text-forest-700 text-sm">{r.name}</div>
              <div className="text-xs text-forest-700/60">{r.city}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
