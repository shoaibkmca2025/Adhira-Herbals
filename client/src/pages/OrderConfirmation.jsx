import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Package } from 'lucide-react';
import { ordersApi } from '../api/endpoints.js';
import { formatPrice } from '../utils/format.js';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    ordersApi.byId(id).then(({ order }) => setOrder(order));
  }, [id]);

  if (!order) return <div className="container-page py-20 text-center text-forest-700/60">Loading…</div>;

  return (
    <div className="container-page py-16 max-w-2xl">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto bg-forest-100 rounded-full flex items-center justify-center text-forest-600">
          <Check size={26} />
        </div>
        <h1 className="font-serif text-4xl text-forest-700 mt-5">Thank you for your order</h1>
        <p className="mt-2 text-forest-700/70">
          Order <b>{order.orderNumber}</b> — we&apos;ll email a confirmation shortly.
        </p>
      </div>

      <div className="mt-10 bg-cream-50/80 border border-forest-600/10 rounded-2xl p-6">
        <h2 className="font-serif text-xl text-forest-700 flex items-center gap-2">
          <Package size={18} /> Order summary
        </h2>
        <ul className="mt-4 divide-y divide-forest-600/10">
          {order.items.map((i, idx) => (
            <li key={idx} className="py-3 flex items-center gap-4">
              {i.image && <img src={i.image} alt="" className="w-12 h-12 rounded object-cover" />}
              <div className="flex-1">
                <div className="font-medium text-forest-700">{i.name}</div>
                <div className="text-xs text-forest-700/60">
                  {i.variantLabel || 'Standard'} × {i.quantity}
                </div>
              </div>
              <div className="text-sm">{formatPrice(i.unitPrice * i.quantity)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Shipping" value={order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)} />
          <Row label="Total" value={formatPrice(order.total)} bold />
        </div>
        <div className="mt-4 text-sm text-forest-700/70">
          Payment: <b className="text-forest-700">{order.paymentMethod.toUpperCase()}</b> ·
          Status: <b className="text-forest-700">{order.paymentStatus}</b>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link to="/shop" className="btn-outline">Keep Shopping</Link>
        <Link to="/account/orders" className="btn-primary">View My Orders</Link>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'text-forest-700 font-medium' : 'text-forest-700/70'}>{label}</span>
      <span className={bold ? 'text-forest-700 font-medium' : ''}>{value}</span>
    </div>
  );
}
