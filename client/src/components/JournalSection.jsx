import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    tag: 'HOW TO USE',
    title: 'Your daily moringa ritual in 3 simple ways',
    img: '/images/moringa-spoon.jpg',
  },
  {
    tag: 'RECIPES',
    title: 'Moringa lemon-honey morning tonic recipe',
    img: '/images/moringa-leaves.jpg',
  },
  {
    tag: 'WELLNESS',
    title: 'Moringa for women: hormones, hair & glow',
    img: '/images/moringa-bowl-rustic.jpg',
  },
];

export default function JournalSection() {
  return (
    <section id="journal" className="container-page py-20">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="section-label">THE ADHIRA JOURNAL</p>
          <h2 className="font-serif text-4xl md:text-5xl text-forest-700 mt-2">
            Learn <em>the leaf.</em>
          </h2>
        </div>
        <a href="#" className="text-sm text-forest-700 hover:underline underline-offset-4 inline-flex items-center gap-1">
          View all articles <ArrowRight size={14} />
        </a>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a, i) => (
          <motion.article
            key={a.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-cream-50 rounded-2xl overflow-hidden shadow-card group cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={a.img}
                alt={a.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <p className="section-label">{a.tag}</p>
              <h3 className="font-serif text-2xl text-forest-700 mt-2 leading-snug">{a.title}</h3>
              <span className="inline-flex items-center gap-1 mt-4 text-sm text-forest-700/80 group-hover:text-forest-700 group-hover:gap-2 transition-all">
                Read article <ArrowRight size={14} />
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
