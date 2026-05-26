import { useEffect, useState } from 'react';
import { adminApi } from '../../api/endpoints.js';
import { formatPrice, classNames } from '../../utils/format.js';
import toast from 'react-hot-toast';

const STATUSES = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', paymentStatus: '', q: '' });

  async function load() {
    setLoading(true);
    const params = {};
    if (filter.status) params.status = filter.status;
    if (filter.paymentStatus) params.paymentStatus = filter.paymentStatus;
    if (filter.q) params.q = filter.q;
    const { orders } = await adminApi.orders.list(params);
    setOrders(orders);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status, filter.paymentStatus]);

  async function updateStatus(id, status) {
    try {
      await adminApi.orders.updateStatus(id, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-forest-700">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <input
            className="input w-64"
            placeholder="Search order number…"
            value={filter.q}
            onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
          />
        </form>
        <select className="input w-40" value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input w-44" value={filter.paymentStatus} onChange={(e) => setFilter((f) => ({ ...f, paymentStatus: e.target.value }))}>
          <option value="">All payments</option>
          {['pending', 'paid', 'failed', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 bg-white border border-forest-600/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-200/50 text-forest-700/70 text-xs uppercase tracking-wider-2">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Payment</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-600/10">
            {loading && (
              <tr><td colSpan={6} className="p-8 text-center text-forest-700/60">Loading…</td></tr>
            )}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-forest-700/60">No orders yet.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-cream-200/30">
                <td className="px-5 py-3">
                  <div className="font-medium text-forest-700">{o.orderNumber}</div>
                  <div className="text-xs text-forest-700/60">
                    {new Date(o.createdAt).toLocaleString()}
                  </div>
                </td>
                <td className="px-5 py-3">
                  {o.user?.name || 'Guest'}
                  <div className="text-xs text-forest-700/60">{o.user?.email}</div>
                </td>
                <td className="px-5 py-3 font-medium">{formatPrice(o.total)}</td>
                <td className="px-5 py-3">
                  <div>{o.paymentMethod.toUpperCase()}</div>
                  <span className={classNames(
                    'text-[10px] uppercase tracking-wider-2 font-semibold px-2 py-0.5 rounded-full',
                    o.paymentStatus === 'paid' ? 'bg-forest-100 text-forest-700' :
                    o.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' :
                    'bg-cream-200 text-forest-700/60'
                  )}>{o.paymentStatus}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs bg-blush-200 text-forest-700 px-2 py-0.5 rounded-full">
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="text-xs border border-forest-600/15 rounded-md px-2 py-1 bg-white"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
