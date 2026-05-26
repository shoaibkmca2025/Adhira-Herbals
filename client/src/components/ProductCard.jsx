import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/format.js';
import StarRating from './StarRating.jsx';

export default function ProductCard({ product }) {
  const img = product.images?.[0]?.url;
  const badge = product.badges?.[0];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative rounded-2xl overflow-hidden bg-cream-200/50 aspect-square">
          {img && (
            <img
              src={img}
              alt={product.images?.[0]?.alt || product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          {badge && (
            <span className="absolute top-3 left-3 bg-cream-50/90 text-forest-700 text-[10px] tracking-wider-2 font-semibold px-3 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl text-forest-700">{product.name}</h3>
            {product.tagline && (
              <p className="text-sm text-forest-700/70 mt-1">{product.tagline}</p>
            )}
            {product.reviewCount > 0 && (
              <StarRating value={product.rating} count={product.reviewCount} className="mt-2" />
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-base font-medium text-forest-700">
              {formatPrice(product.price, product.currency)}
            </div>
            {product.compareAtPrice && (
              <div className="text-xs text-forest-700/40 line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
