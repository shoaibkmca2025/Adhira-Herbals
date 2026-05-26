import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../store/auth.js';
import { classNames } from '../../utils/format.js';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-cream-100">
      <aside className="bg-earth-900 text-cream-100 p-6 flex flex-col">
        <Link to="/" className="font-serif text-2xl text-white">Adhira Admin</Link>
        <nav className="mt-10 space-y-1 flex-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition',
                  isActive ? 'bg-cream-100/10 text-white' : 'text-cream-100/70 hover:bg-cream-100/5 hover:text-white'
                )
              }
            >
              <n.icon size={16} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-cream-100/10 pt-4 text-xs text-cream-100/60">
          <div className="font-medium text-cream-100">{user?.name}</div>
          <div>{user?.email}</div>
          <Link to="/" className="mt-3 flex items-center gap-2 text-cream-100/70 hover:text-white">
            <ExternalLink size={12} /> View site
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="mt-2 flex items-center gap-2 text-cream-100/70 hover:text-white"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>
      <main className="p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
