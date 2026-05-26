import { NavLink, Link } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../store/auth.js';
import { useCart } from '../store/cart.js';

const nav = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/shop?category=immunity', label: 'Blog' }, // placeholder until blog ships
];

export default function Header() {
  const { user } = useAuth();
  const { openDrawer, count } = useCart();
  const itemCount = count();

  return (
    <header className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur border-b border-forest-600/5">
      <div className="container-page flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="font-serif text-2xl sm:text-3xl text-forest-700 leading-none">
          Adhira Herbals
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-forest-700 border-b-2 border-gold-500 pb-1' : 'text-forest-700/80 hover:text-forest-700'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 text-forest-700">
          <button aria-label="Search" className="p-2 hover:bg-cream-200 rounded-full transition">
            <Search size={18} />
          </button>
          <button
            aria-label="Cart"
            onClick={openDrawer}
            className="relative p-2 hover:bg-cream-200 rounded-full transition"
          >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/login'}
            aria-label="Account"
            className="p-2 hover:bg-cream-200 rounded-full transition"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
