import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Leaf } from 'lucide-react';
import { useCart } from '../store/cart.js';
import { useAuth } from '../store/auth.js';

const nav = [
  { to: '/shop', label: 'Shop', isRoute: true },
  { to: '/#benefits', label: 'Benefits', isRoute: false },
  { to: '/our-story', label: 'Our Story', isRoute: true },
  { to: '/#journal', label: 'Learn', isRoute: false },
  { to: '/#faq', label: 'FAQ', isRoute: false },
];

export default function Header() {
  const { openDrawer, count } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const itemCount = count();

  function handleAnchorClick(e, to) {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const hash = to.slice(1); // "#benefits"
      if (pathname !== '/') {
        navigate('/' + hash);
      } else {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur border-b border-forest-600/5">
      <div className="container-page flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-forest-600 flex items-center justify-center">
            <Leaf size={18} className="text-cream-50" strokeWidth={1.6} />
          </div>
          <span className="font-serif text-2xl sm:text-[26px] text-forest-700 leading-none">
            Adhira Herbals
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {nav.map((n) =>
            n.isRoute ? (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-forest-700' : 'text-forest-700/80 hover:text-forest-700'}`
                }
              >
                {n.label}
              </NavLink>
            ) : (
              <a
                key={n.to}
                href={n.to}
                onClick={(e) => handleAnchorClick(e, n.to)}
                className="text-sm font-medium text-forest-700/80 hover:text-forest-700 transition cursor-pointer"
              >
                {n.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Cart"
            onClick={openDrawer}
            className="relative w-10 h-10 rounded-full border border-forest-600/15 bg-cream-50 hover:bg-cream-200 flex items-center justify-center transition"
          >
            <ShoppingBag size={16} className="text-forest-700" strokeWidth={1.6} />
            <span className="absolute -top-1 -right-1 bg-mustard-400 text-forest-800 text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>

          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/account') : '/shop'}
            className="btn-primary !py-2.5 !px-5"
          >
            {user ? (user.role === 'admin' ? 'Admin' : 'Account') : 'Shop Now'}
          </Link>
        </div>
      </div>
    </header>
  );
}
