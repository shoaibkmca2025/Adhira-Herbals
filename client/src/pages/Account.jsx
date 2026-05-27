import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Package, MapPin, User, LogOut } from 'lucide-react';
import { ordersApi, authApi } from '../api/endpoints.js';
import { useAuth } from '../store/auth.js';
import { formatPrice, classNames } from '../utils/format.js';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-page py-12 grid md:grid-cols-[200px_1fr] gap-10">
      <aside>
        <h2 className="font-serif text-2xl text-forest-700">Hello, {user?.name?.split(' ')[0]}</h2>
        <nav className="mt-6 space-y-1 text-sm">
          {[
            { to: '/account/orders', label: 'My Orders', icon: Package },
            { to: '/account/addresses', label: 'Addresses', icon: MapPin },
            { to: '/account/profile', label: 'Profile', icon: User },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-2 px-3 py-2 rounded-md transition',
                  isActive ? 'bg-blush-100 text-forest-700' : 'text-forest-700/70 hover:bg-cream-200'
                )
              }
            >
              <l.icon size={14} /> {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 px-3 py-2 text-forest-700/70 hover:text-red-700 w-full"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </nav>
      </aside>
      <section>
        <Routes>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<OrdersTab />} />
          <Route path="addresses" element={<AddressesTab user={user} setUser={setUser} />} />
          <Route path="profile" element={<ProfileTab user={user} setUser={setUser} />} />
        </Routes>
      </section>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    ordersApi.mine().then(({ orders }) => setOrders(orders));
  }, []);
  if (!orders) return <div className="text-forest-700/60">Loading…</div>;
  if (orders.length === 0)
    return (
      <div className="text-forest-700/60">
        No orders yet. <a href="/shop" className="underline">Start browsing</a>.
      </div>
    );
  return (
    <div className="space-y-5">
      {orders.map((o) => (
        <div key={o._id} className="bg-cream-50/80 border border-forest-600/10 rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-forest-600/10 bg-cream-200/40">
            <div>
              <div className="font-medium text-forest-700">{o.orderNumber}</div>
              <div className="text-xs text-forest-700/60">
                {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{o.items.length} item{o.items.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-forest-700">{formatPrice(o.total)}</div>
              <span
                className={classNames(
                  'inline-block mt-1 text-[10px] uppercase tracking-wider-2 font-semibold px-2 py-0.5 rounded-full',
                  o.status === 'delivered'
                    ? 'bg-forest-100 text-forest-700'
                    : o.status === 'cancelled'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-blush-200 text-forest-700'
                )}
              >
                {o.status}
              </span>
            </div>
          </div>

          {/* Items with images */}
          <ul className="divide-y divide-forest-600/10">
            {o.items.map((it, idx) => (
              <li key={idx} className="px-5 py-3 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-cream-200 overflow-hidden shrink-0">
                  {it.image ? (
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-forest-700 truncate">{it.name}</div>
                  <div className="text-xs text-forest-700/60">
                    {it.variantLabel || 'Standard'} · Qty {it.quantity}
                  </div>
                </div>
                <div className="text-sm font-medium text-forest-700 shrink-0">
                  {formatPrice(it.unitPrice * it.quantity)}
                </div>
              </li>
            ))}
          </ul>

          {/* Footer: payment info */}
          <div className="px-5 py-3 text-xs text-forest-700/60 flex flex-wrap gap-4 bg-cream-200/30 border-t border-forest-600/10">
            <span>Payment: <b className="text-forest-700">{(o.paymentMethod || '').toUpperCase()}</b></span>
            <span>· Status: <b className="text-forest-700">{o.paymentStatus}</b></span>
            {o.shippingMethod && <span>· Shipping: <b className="text-forest-700">{o.shippingMethod}</b></span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddressesTab({ user, setUser }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', line1: '', city: '', state: '', pincode: '', phone: '' });
  async function add() {
    const { user: updated } = await authApi.addAddress(form);
    setUser(updated);
    toast.success('Address saved');
    setForm({ firstName: '', lastName: '', line1: '', city: '', state: '', pincode: '', phone: '' });
  }
  async function remove(id) {
    const { user: updated } = await authApi.deleteAddress(id);
    setUser(updated);
  }
  return (
    <div>
      <div className="space-y-3">
        {user?.addresses?.length === 0 && <p className="text-forest-700/60">No addresses saved yet.</p>}
        {user?.addresses?.map((a) => (
          <div key={a._id} className="bg-cream-50/80 border border-forest-600/10 rounded-xl p-4 flex justify-between">
            <div className="text-sm text-forest-700">
              <div className="font-medium">{a.firstName} {a.lastName} {a.isDefault && <span className="text-[10px] ml-2 bg-blush-200 px-2 py-0.5 rounded-full">DEFAULT</span>}</div>
              <div className="text-forest-700/70">{a.line1}{a.line2 && `, ${a.line2}`}</div>
              <div className="text-forest-700/70">{a.city}, {a.state} {a.pincode}</div>
              <div className="text-forest-700/70">{a.phone}</div>
            </div>
            <button onClick={() => remove(a._id)} className="text-xs text-red-700/80 hover:underline self-start">Remove</button>
          </div>
        ))}
      </div>
      <h3 className="font-serif text-xl text-forest-700 mt-8">Add new address</h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {['firstName', 'lastName', 'line1', 'city', 'state', 'pincode', 'phone'].map((k) => (
          <input
            key={k}
            className="input"
            placeholder={k}
            value={form[k]}
            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
          />
        ))}
      </div>
      <button onClick={add} className="btn-primary mt-4">Save Address</button>
    </div>
  );
}

function ProfileTab({ user, setUser }) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  async function save() {
    const { user: updated } = await authApi.updateProfile({ name, phone });
    setUser(updated);
    toast.success('Profile updated');
  }
  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="label">NAME</label>
        <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="label">EMAIL</label>
        <input className="input mt-1" value={user?.email} disabled />
      </div>
      <div>
        <label className="label">PHONE</label>
        <input className="input mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button onClick={save} className="btn-primary">Save Changes</button>
    </div>
  );
}
