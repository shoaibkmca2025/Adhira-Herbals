import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi } from '../api/endpoints.js';
import ProductCard from '../components/ProductCard.jsx';
import { classNames } from '../utils/format.js';

const FILTERS = [
  { id: 'all', label: 'All Products' },
  { id: 'immunity', label: 'Immunity' },
  { id: 'energy', label: 'Energy' },
  { id: 'digestion', label: 'Digestion' },
  { id: 'calm', label: 'Calm' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('category') || 'all';
  const [category, setCategory] = useState(initial);
  const [sort, setSort] = useState('featured');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsApi
      .list({ category, sort, limit: 24 })
      .then(({ items }) => setItems(items))
      .finally(() => setLoading(false));
    const next = new URLSearchParams(params);
    if (category === 'all') next.delete('category');
    else next.set('category', category);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  return (
    <div className="container-page py-12">
      <h1 className="font-serif text-5xl text-forest-700">Apothecary</h1>
      <p className="mt-3 text-forest-700/70 max-w-xl">
        Discover our curated selection of organic, wild-harvested botanicals designed to support your daily wellness rituals.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-600/10 pb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="label">FILTER BY:</span>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setCategory(f.id)}
              className={classNames('chip', category === f.id ? 'chip-on' : 'chip-off')}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="label">Sort By</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-cream-200 rounded-2xl" />
                <div className="mt-4 h-4 w-1/2 bg-cream-200 rounded" />
                <div className="mt-2 h-3 w-1/3 bg-cream-200 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-forest-700/60">No products match that filter yet.</div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            <AnimatePresence>
              {items.map((p) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <div className="mt-16 text-center">
        <button className="btn-outline">Load More Botanicals</button>
      </div>
    </div>
  );
}
