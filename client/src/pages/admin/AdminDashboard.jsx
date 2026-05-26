import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react';
import { adminApi } from '../../api/endpoints.js';
import { formatPrice } from '../../utils/format.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminApi.stats().then(setStats);
  }, []);

  if (!stats) return <div className="text-forest-700/60">Loading…</div>;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp },
    { label: 'Paid Orders', value: stats.paidOrders, icon: ShoppingBag },
    { label: 'Customers', value: stats.userCount, icon: Users },
    { label: 'Products', value: stats.productCount, icon: Package },
  ];

  const max = Math.max(...stats.last30.map((d) => d.revenue), 1);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-forest-700">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-forest-600/10 rounded-xl p-5">
            <c.icon size={18} className="text-forest-600/70" />
            <div className="mt-3 text-xs tracking-wider-2 text-forest-700/60 uppercase">{c.label}</div>
            <div className="mt-1 text-2xl font-medium text-forest-700">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-forest-600/10 rounded-xl p-6">
        <h2 className="font-serif text-xl text-forest-700">Last 30 days</h2>
        <div className="mt-4 h-40 flex items-end gap-1">
          {stats.last30.length === 0 && (
            <p className="text-forest-700/50 text-sm self-center mx-auto">No orders yet.</p>
          )}
          {stats.last30.map((d) => (
            <div
              key={d._id}
              className="flex-1 bg-forest-600/80 rounded-t hover:bg-forest-600 transition"
              style={{ height: `${(d.revenue / max) * 100}%` }}
              title={`${d._id}: ${formatPrice(d.revenue)} · ${d.orders} orders`}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-forest-600/10 rounded-xl p-6">
          <h3 className="font-serif text-lg text-forest-700">Recent Orders</h3>
          <ul className="mt-3 divide-y divide-forest-600/10">
            {stats.recentOrders.length === 0 && <li className="text-forest-700/50 py-3 text-sm">None yet.</li>}
            {stats.recentOrders.map((o) => (
              <li key={o._id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-forest-700">{o.orderNumber}</div>
                  <div className="text-xs text-forest-700/60">{o.user?.name || 'Guest'} · {o.status}</div>
                </div>
                <div className="text-sm font-medium">{formatPrice(o.total)}</div>
              </li>
            ))}
          </ul>
          <Link to="/admin/orders" className="text-xs text-forest-700 underline underline-offset-4 mt-3 inline-block">
            View all orders →
          </Link>
        </div>
        <div className="bg-white border border-forest-600/10 rounded-xl p-6">
          <h3 className="font-serif text-lg text-forest-700 flex items-center gap-2">
            <AlertTriangle size={16} className="text-gold-500" />
            Low Stock
          </h3>
          <ul className="mt-3 divide-y divide-forest-600/10">
            {stats.lowStock.length === 0 && <li className="text-forest-700/50 py-3 text-sm">All products well stocked.</li>}
            {stats.lowStock.map((p) => (
              <li key={p._id} className="py-3 flex justify-between items-center">
                <div className="text-sm font-medium text-forest-700">{p.name}</div>
                <div className="text-sm text-gold-500">{p.stock} left</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
