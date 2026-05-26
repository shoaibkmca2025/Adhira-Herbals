import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, QrCode, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../store/cart.js';
import { useAuth } from '../store/auth.js';
import { ordersApi, paymentsApi } from '../api/endpoints.js';
import { formatPrice, classNames } from '../utils/format.js';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

const FREE_SHIPPING_AT = 4000;

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [method, setMethod] = useState('standard');
  const [payment, setPayment] = useState('upi');
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Pre-fill from default address if present
  useEffect(() => {
    const def = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
    if (def) {
      setShipping((s) => ({
        ...s,
        firstName: def.firstName || s.firstName,
        lastName: def.lastName || s.lastName,
        phone: def.phone || s.phone,
        line1: def.line1 || s.line1,
        line2: def.line2 || s.line2,
        city: def.city || s.city,
        state: def.state || s.state,
        pincode: def.pincode || s.pincode,
      }));
    }
  }, [user]);

  const subtotal = useMemo(
    () => cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [cart]
  );
  const shippingFee = method === 'express' ? 150 : subtotal >= FREE_SHIPPING_AT ? 0 : 49;
  const total = subtotal + shippingFee - discount;

  function set(k, v) {
    setShipping((s) => ({ ...s, [k]: v }));
  }

  function applyDiscount() {
    const code = discountCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success('Welcome discount applied');
    } else if (code) {
      setDiscount(0);
      toast.error('Invalid code');
    }
  }

  async function placeOrder() {
    if (cart.items.length === 0) return toast.error('Cart is empty');
    setSubmitting(true);
    try {
      const { order, gateway } = await ordersApi.create({
        shippingAddress: shipping,
        shippingMethod: method,
        paymentMethod: payment,
      });

      if (payment === 'cod' || !gateway) {
        toast.success('Order placed');
        navigate(`/order/${order._id}`);
        return;
      }

      // Mock gateway flow: simulate user completing checkout then verify
      const sim = await paymentsApi.simulate(gateway.orderId);
      await paymentsApi.verify({
        orderId: gateway.orderId,
        paymentId: sim.paymentId,
        signature: sim.signature,
        internalOrderId: order._id,
      });

      toast.success('Payment successful');
      navigate(`/order/${order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl text-forest-700">Your cart is empty</h1>
        <Link to="/shop" className="btn-primary mt-6 inline-flex">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl text-forest-700">Adhira Herbals</h1>
        <Link to="/shop" className="text-sm text-forest-700 inline-flex items-center gap-1 hover:underline">
          <ArrowLeft size={16} /> Return to Cart
        </Link>
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-10">
        {/* Form column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Shipping */}
          <section>
            <h2 className="font-serif text-2xl text-forest-700">Shipping Details</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Field label="EMAIL ADDRESS" full>
                <input
                  type="email"
                  className="input"
                  value={shipping.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="FIRST NAME">
                <input className="input" value={shipping.firstName} onChange={(e) => set('firstName', e.target.value)} />
              </Field>
              <Field label="LAST NAME">
                <input className="input" value={shipping.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </Field>
              <Field label="ADDRESS" full>
                <input className="input" placeholder="Street address or P.O. Box" value={shipping.line1} onChange={(e) => set('line1', e.target.value)} />
              </Field>
              <Field full>
                <input className="input" placeholder="Apartment, suite, unit, etc. (optional)" value={shipping.line2} onChange={(e) => set('line2', e.target.value)} />
              </Field>
              <Field label="CITY">
                <input className="input" value={shipping.city} onChange={(e) => set('city', e.target.value)} />
              </Field>
              <Field label="STATE">
                <select className="input" value={shipping.state} onChange={(e) => set('state', e.target.value)}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="PIN CODE">
                <input className="input" value={shipping.pincode} onChange={(e) => set('pincode', e.target.value)} />
              </Field>
              <Field label="PHONE NUMBER" full>
                <input className="input" placeholder="For delivery updates" value={shipping.phone} onChange={(e) => set('phone', e.target.value)} />
              </Field>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-serif text-2xl text-forest-700">Delivery Method</h2>
            <div className="mt-6 space-y-3">
              {[
                { id: 'standard', title: 'Standard Shipping', sub: '3–5 Business Days', price: subtotal >= FREE_SHIPPING_AT ? 0 : 49 },
                { id: 'express', title: 'Express Delivery', sub: '1–2 Business Days', price: 150 },
              ].map((m) => (
                <label
                  key={m.id}
                  className={classNames(
                    'flex items-center justify-between border rounded-lg px-4 py-4 cursor-pointer transition',
                    method === m.id ? 'border-forest-600 bg-blush-100' : 'border-forest-600/15'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="ship"
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="accent-forest-600"
                    />
                    <span>
                      <div className="text-sm font-medium text-forest-700">{m.title}</div>
                      <div className="text-xs text-forest-700/60">{m.sub}</div>
                    </span>
                  </span>
                  <span className="font-medium">{m.price === 0 ? 'Free' : formatPrice(m.price)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-serif text-2xl text-forest-700">Payment</h2>
            <p className="mt-1 text-sm text-forest-700/60">All transactions are secure and encrypted.</p>
            <div className="mt-6 border border-forest-600/15 rounded-lg overflow-hidden">
              <PaymentOption id="upi" label="UPI (GPay, PhonePe, Paytm)" icon={QrCode} payment={payment} setPayment={setPayment}>
                <p className="text-xs text-forest-700/70 text-center py-3">
                  After clicking &quot;Complete Purchase&quot; you will be redirected to Razorpay to complete your UPI transaction securely.
                </p>
              </PaymentOption>
              <PaymentOption id="card" label="Credit / Debit Card" icon={CreditCard} payment={payment} setPayment={setPayment} />
              <PaymentOption id="cod" label="Cash on Delivery (COD)" icon={Truck} payment={payment} setPayment={setPayment} />
            </div>
          </section>
        </div>

        {/* Summary column */}
        <aside className="lg:col-span-1">
          <div className="bg-cream-50/80 border border-forest-600/10 rounded-2xl p-6 sticky top-24">
            <h3 className="font-serif text-xl text-forest-700">Order Summary</h3>
            <ul className="mt-4 space-y-3">
              {cart.items.map((i) => (
                <li key={i._id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-md overflow-hidden bg-cream-200">
                    {i.product?.images?.[0]?.url && (
                      <img src={i.product.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-forest-700 truncate">{i.product?.name}</div>
                    <div className="text-xs text-forest-700/60">{i.variantLabel || 'Standard'}</div>
                  </div>
                  <div className="text-sm font-medium">{formatPrice(i.unitPrice * i.quantity)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                type="button"
                onClick={applyDiscount}
                className="px-4 rounded-md bg-blush-200 text-forest-700 text-sm font-medium hover:bg-blush-300 transition"
              >
                Apply
              </button>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shippingFee === 0 ? 'Free' : formatPrice(shippingFee)} />
              {discount > 0 && (
                <Row label="Welcome Discount (10%)" value={`-${formatPrice(discount)}`} highlight />
              )}
            </div>

            <div className="mt-5 border-t border-forest-600/10 pt-4 flex items-baseline justify-between">
              <div>
                <div className="text-base font-medium text-forest-700">Total</div>
                <div className="text-xs text-forest-700/50">Including taxes</div>
              </div>
              <div className="text-2xl text-forest-700 font-medium">{formatPrice(total)}</div>
            </div>

            <button onClick={placeOrder} disabled={submitting} className="btn-primary w-full mt-5">
              <Lock size={14} /> {submitting ? 'Processing…' : 'Complete Purchase'}
            </button>

            <div className="mt-4 flex items-center justify-around text-xs text-forest-700/60">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-gold-500" /> AYURVEDIC CERTIFIED</span>
              <span className="flex items-center gap-1.5"><Lock size={14} /> SECURE SSL ENCRYPTION</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      {label && <label className="label">{label}</label>}
      <div className={label ? 'mt-1' : ''}>{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className={highlight ? 'text-gold-500 font-medium' : 'text-forest-700/80'}>{label}</span>
      <span className={highlight ? 'text-gold-500 font-medium' : 'text-forest-700'}>{value}</span>
    </div>
  );
}

function PaymentOption({ id, label, icon: Icon, payment, setPayment, children }) {
  const active = payment === id;
  return (
    <div className={classNames('border-b last:border-b-0 border-forest-600/10 transition', active ? 'bg-blush-100' : 'bg-transparent')}>
      <label className="flex items-center justify-between px-4 py-3 cursor-pointer">
        <span className="flex items-center gap-3">
          <input
            type="radio"
            name="pay"
            checked={active}
            onChange={() => setPayment(id)}
            className="accent-forest-600"
          />
          <span className="text-sm text-forest-700">{label}</span>
        </span>
        <Icon size={16} className="text-forest-700/60" />
      </label>
      {active && children}
    </div>
  );
}
