import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-xs text-forest-700/60 flex items-center gap-1.5">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} />}
          {item.to ? (
            <Link to={item.to} className="hover:text-forest-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-forest-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
