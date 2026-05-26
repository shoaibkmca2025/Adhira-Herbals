import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, Truck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart.js';
import { formatPrice } from '../utils/format.js';

const FREE_SHIPPING_AT = 4000;

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, cart, update, remove } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-earth-900/30 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[440px] h-full bg-cream-100 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-forest-600/5">
              <h2 className="font-serif text-2xl text-forest-700">Your Cart</h2>
              <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-cream-200">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 bg-blush-100/60 border-b border-forest-600/5">
              <div className="flex items-center justify-between text-sm text-forest-700">
                <span>
                  {remaining > 0 ? (
                    <>
                      You&apos;re <b>{formatPrice(remaining)}</b> away from free shipping
                    </>
                  ) : (
                    <b>You&apos;ve unlocked free shipping</b>
                  )}
                </span>
                <Truck size={16} />
              </div>
              <div className="mt-2 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.items.length === 0 ? (
                <div className="text-center text-forest-700/60 mt-12">
                  Your cart is empty.
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                      {item.product?.images?.[0]?.url && (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg text-forest-700 truncate">
                          {item.product?.name}
                        </h3>
                        <button onClick={() => remove(item._id)} className="text-forest-700/40 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-forest-700/60">
                        {item.variantLabel || 'Standard'} · Sustainably Harvested
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-forest-600/15 rounded-full">
                          <button
                            onClick={() => update(item._id, item.quantity - 1)}
                            className="p-1.5 hover:bg-cream-200 rounded-l-full"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => update(item._id, item.quantity + 1)}
                            className="p-1.5 hover:bg-cream-200 rounded-r-full"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.items.length > 0 && (
              <div className="border-t border-forest-600/5 p-6 bg-cream-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-forest-700">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-center text-forest-700/60 mb-4">
                  Taxes and shipping calculated at checkout
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/checkout');
                  }}
                  className="btn-primary w-full"
                >
                  Checkout <ArrowRight size={16} />
                </button>
                <button
                  onClick={closeDrawer}
                  className="block w-full text-center text-sm text-forest-700/80 underline underline-offset-4 mt-4"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
