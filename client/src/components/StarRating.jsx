import { Star } from 'lucide-react';
import { classNames } from '../utils/format.js';

export default function StarRating({ value = 0, count, size = 14, className }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={classNames('inline-flex items-center gap-1.5 text-gold-500', className)}>
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              strokeWidth={1.4}
              className={filled ? 'fill-gold-500' : 'fill-transparent'}
            />
          );
        })}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-forest-700/70">({count})</span>
      )}
    </div>
  );
}
