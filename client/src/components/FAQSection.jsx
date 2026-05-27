import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Moringa?',
    a: 'Moringa oleifera — known as Shigru in Ayurveda or "the tree of life" — is a fast-growing tropical tree whose leaves are exceptionally dense in vitamins, minerals, and plant protein. Our powder uses only the leaves, gently shade-dried to preserve their full nutrient and chlorophyll profile.',
  },
  {
    q: 'How do I consume it?',
    a: 'Start with 1 teaspoon (~3g) daily. Stir into water, smoothies, juice or warm (not hot) milk. You can also sprinkle it over salads or curries. Mornings work best for most people — its natural energy lift is gentle and caffeine-free.',
  },
  {
    q: 'Is it certified organic?',
    a: 'Yes. Every batch is sourced from USDA-certified organic farms in southern India and independently lab-tested for purity, heavy metals, and pesticide residue. Every pack has a batch ID you can trace.',
  },
  {
    q: 'What are the delivery timelines?',
    a: 'Standard delivery takes 3–5 business days across India; express is 1–2 days for metro cities. International shipping is available on request. You will receive tracking the moment your order ships.',
  },
  {
    q: 'How does the subscription work?',
    a: 'Subscribe & save 15%. We ship a fresh pack every 30 days, automatically. You can pause, skip, or cancel any time from your account — no questions asked.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="container-page py-20">
      <div className="text-center">
        <p className="section-label">FAQ</p>
        <h2 className="font-serif text-4xl md:text-5xl text-forest-700 mt-2">
          Everything you wanted to ask.
        </h2>
      </div>

      <div className="mt-12 max-w-3xl mx-auto space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="bg-cream-50 rounded-2xl border border-forest-600/5 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-serif text-xl text-forest-700">{f.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-forest-700/60"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 text-sm text-forest-700/80 leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
