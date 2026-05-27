import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Check, ShoppingBag, Truck, ShieldCheck, Beaker,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi, reviewsApi } from '../api/endpoints.js';
import { useCart } from '../store/cart.js';
import { useAuth } from '../store/auth.js';
import { formatPrice, classNames } from '../utils/format.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useCart();

  const [data, setData] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [variant, setVariant] = useState(null);
  const [option, setOption] = useState('one-time');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productsApi.bySlug(slug).then((d) => {
      setData(d);
      const defaultVariant = d.product.variants?.find((v) => v.label === '250g') || d.product.variants?.[0];
      setVariant(defaultVariant?.label || null);
      setReviews(d.reviews || []);
    });
  }, [slug]);

  if (!data) {
    return <div className="container-page py-20 text-center text-forest-700/60">Loading…</div>;
  }

  const { product, related } = data;
  const selectedVariant = product.variants?.find((v) => v.label === variant);
  const basePrice = selectedVariant?.price ?? product.price;
  const subscribePrice = Math.round(basePrice * 0.85);
  const finalPrice = option === 'subscribe' ? subscribePrice : basePrice;

  async function handleAdd(buyNow = false) {
    try {
      await add({ product, variantLabel: variant, quantity: 1 });
      toast.success('Added to cart');
      if (buyNow) navigate('/checkout');
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!user) return toast.error('Please log in to leave a review');
    setSubmitting(true);
    try {
      const { review } = await reviewsApi.create(product._id, reviewForm);
      setReviews((r) => [review, ...r]);
      setReviewForm({ rating: 5, title: '', body: '' });
      toast.success('Thanks for your review!');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const bullets = product.benefits?.slice(0, 3) || [];

  return (
    <div>
      <div className="container-page py-6">
        <Breadcrumbs
          items={[
            { to: '/shop', label: 'Shop' },
            { to: `/shop?category=${product.category}`, label: capitalize(product.category) },
            { label: product.name },
          ]}
        />
      </div>

      {/* Main product area */}
      <section className="container-page pb-12 grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-cream-200"
          >
            <img
              src={product.images?.[activeImg]?.url}
              alt={product.images?.[activeImg]?.alt || product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={classNames(
                    'aspect-square rounded-xl overflow-hidden border-2 transition',
                    activeImg === i ? 'border-forest-600' : 'border-transparent hover:border-forest-600/30'
                  )}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div>
          {product.badges?.[0] && (
            <p className="section-label">{product.badges[0]}</p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl text-forest-700 mt-3">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex text-gold-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-gold-500' : ''} strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm text-forest-700/70">
              {product.rating} · {product.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          <p className="mt-5 text-forest-700/80 leading-relaxed">
            {product.description}
          </p>

          {bullets.length > 0 && (
            <ul className="mt-6 space-y-2.5">
              {bullets.map((b) => (
                <li key={b.title} className="flex items-start gap-3 text-forest-700">
                  <Check size={18} className="text-forest-600 shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-[15px]">{b.title}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mt-8">
              <p className="section-label">CHOOSE WEIGHT</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isActive = variant === v.label;
                  const isPopular = v.label === '250g';
                  return (
                    <button
                      key={v.label}
                      onClick={() => setVariant(v.label)}
                      className={classNames(
                        'relative rounded-full px-6 py-3 text-sm font-medium transition border',
                        isActive
                          ? 'bg-forest-600 text-cream-50 border-forest-600'
                          : 'bg-transparent text-forest-700 border-forest-600/20 hover:border-forest-600/50'
                      )}
                    >
                      {isPopular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-mustard-400 text-forest-800 text-[9px] font-bold tracking-wider-2 px-2 py-0.5 rounded-full">
                          POPULAR
                        </span>
                      )}
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchase options */}
          <div className="mt-6 space-y-2.5">
            <PurchaseOption
              id="one-time"
              title="One-time purchase"
              sub="Single delivery, no commitment"
              price={basePrice}
              active={option === 'one-time'}
              onSelect={() => setOption('one-time')}
            />
            <PurchaseOption
              id="subscribe"
              title={
                <span className="flex items-center gap-2">
                  Subscribe &amp; save
                  <span className="bg-mustard-400 text-forest-800 text-[10px] font-bold tracking-wider-2 px-2 py-0.5 rounded-full">
                    -15%
                  </span>
                </span>
              }
              sub="Ships monthly · pause anytime"
              price={subscribePrice}
              active={option === 'subscribe'}
              onSelect={() => setOption('subscribe')}
            />
          </div>

          {/* CTAs */}
          <div className="mt-6 flex gap-3">
            <button onClick={() => handleAdd(false)} className="btn-primary flex-1">
              <ShoppingBag size={15} /> Add to Cart · {formatPrice(finalPrice)}
            </button>
            <button onClick={() => handleAdd(true)} className="btn-outline">
              Buy Now
            </button>
          </div>

          {/* Trust pills */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-forest-700/75">
            <span className="flex items-center gap-2">
              <Truck size={14} className="text-forest-600" /> Free shipping over ₹499
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-forest-600" /> COD available
            </span>
            <span className="flex items-center gap-2">
              <Beaker size={14} className="text-forest-600" /> Lab tested batch
            </span>
          </div>
        </div>
      </section>

      {/* Details panel: nutrition + usage */}
      <section className="container-page py-12">
        <div className="bg-cream-200/60 rounded-3xl p-8 sm:p-12 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-serif text-3xl text-forest-700">Inside the pack</h2>
            <p className="mt-3 text-forest-700/80 leading-relaxed">
              {product.longDescription || product.description}
            </p>
            {product.ingredients?.length > 0 && (
              <div className="mt-6">
                <p className="section-label">INGREDIENTS</p>
                <p className="mt-1.5 text-forest-700/80">{product.ingredients.join(', ')}</p>
              </div>
            )}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {product.usage && (
                <div>
                  <p className="section-label">HOW TO USE</p>
                  <p className="mt-1.5 text-sm text-forest-700/80 leading-relaxed">{product.usage}</p>
                </div>
              )}
              {product.storage && (
                <div>
                  <p className="section-label">STORAGE</p>
                  <p className="mt-1.5 text-sm text-forest-700/80 leading-relaxed">{product.storage}</p>
                </div>
              )}
            </div>
          </div>

          {product.nutritionalFacts?.length > 0 && (
            <div className="bg-cream-50 rounded-2xl p-6">
              <h3 className="font-serif text-2xl text-forest-700">Per 100g</h3>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {product.nutritionalFacts.map((f) => (
                    <tr key={f.label} className="border-b border-forest-600/10 last:border-b-0">
                      <td className="py-3 text-forest-700/80">{f.label}</td>
                      <td className="py-3 text-right font-medium text-forest-700">{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-page py-12">
        <div className="text-center">
          <p className="section-label">CUSTOMER REVIEWS</p>
          <h2 className="font-serif text-4xl text-forest-700 mt-2">
            Real people. <em>Real results.</em>
          </h2>
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-10">
          <div className="space-y-5">
            {reviews.length === 0 && (
              <p className="text-forest-700/60">No reviews yet. Be the first to share your experience.</p>
            )}
            {reviews.map((r) => (
              <div key={r._id} className="bg-cream-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-forest-700">{r.user?.name || 'Customer'}</div>
                    {r.verifiedPurchase && (
                      <span className="text-[10px] tracking-wider-2 font-semibold text-forest-600">
                        VERIFIED PURCHASE
                      </span>
                    )}
                  </div>
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-gold-500' : ''} strokeWidth={0} />
                    ))}
                  </div>
                </div>
                {r.title && <h4 className="mt-3 font-medium text-forest-700">{r.title}</h4>}
                <p className="mt-1 text-sm text-forest-700/80 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-cream-50 rounded-2xl p-6 h-fit shadow-sm">
            <h3 className="font-serif text-2xl text-forest-700">Leave a review</h3>
            <form onSubmit={submitReview} className="mt-4 space-y-3">
              <div>
                <p className="section-label">RATING</p>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                      className={classNames(
                        'text-2xl leading-none transition',
                        n <= reviewForm.rating ? 'text-gold-500' : 'text-forest-700/25 hover:text-forest-700/50'
                      )}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <input
                className="input"
                placeholder="Title (optional)"
                value={reviewForm.title}
                onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
              />
              <textarea
                className="input min-h-[100px]"
                placeholder="Share what you loved about this product"
                value={reviewForm.body}
                onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
              />
              <button className="btn-primary w-full" disabled={submitting}>
                {submitting ? 'Submitting…' : user ? 'Submit Review' : 'Log in to Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related */}
      {related?.length > 0 && (
        <section className="container-page py-16">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="section-label">COMPLETE YOUR ROUTINE</p>
              <h2 className="font-serif text-4xl text-forest-700 mt-2">
                Synergistic <em>botanicals.</em>
              </h2>
            </div>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PurchaseOption({ title, sub, price, active, onSelect }) {
  return (
    <label
      className={classNames(
        'flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer transition border-2',
        active ? 'border-forest-600 bg-cream-50' : 'border-forest-600/15 bg-cream-50/50 hover:border-forest-600/30'
      )}
    >
      <span className="flex items-center gap-3.5">
        <span
          className={classNames(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition',
            active ? 'border-forest-600' : 'border-forest-600/30'
          )}
        >
          {active && <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />}
        </span>
        <input type="radio" name="opt" checked={active} onChange={onSelect} className="sr-only" />
        <span>
          <div className="font-medium text-forest-700">{title}</div>
          <div className="text-xs text-forest-700/60 mt-0.5">{sub}</div>
        </span>
      </span>
      <span className="font-semibold text-forest-700">₹{price}</span>
    </label>
  );
}

function capitalize(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
