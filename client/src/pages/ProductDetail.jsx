import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ShoppingCart, Leaf, Sprout, Beaker, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi, reviewsApi } from '../api/endpoints.js';
import { useCart } from '../store/cart.js';
import { useAuth } from '../store/auth.js';
import { formatPrice, classNames } from '../utils/format.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductCard from '../components/ProductCard.jsx';
import StarRating from '../components/StarRating.jsx';

const TABS = ['Benefits', 'Nutritional Facts', 'Usage', 'Reviews'];

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { add } = useCart();

  const [data, setData] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [variant, setVariant] = useState(null);
  const [option, setOption] = useState('one-time');
  const [tab, setTab] = useState('Benefits');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productsApi.bySlug(slug).then((d) => {
      setData(d);
      setVariant(d.product.variants?.[1]?.label || d.product.variants?.[0]?.label || null);
      setReviews(d.reviews || []);
    });
  }, [slug]);

  if (!data) {
    return <div className="container-page py-20 text-center text-forest-700/60">Loading…</div>;
  }

  const { product, related } = data;
  const selectedVariant = product.variants?.find((v) => v.label === variant);
  const basePrice = selectedVariant?.price ?? product.price;
  const compareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const finalPrice = option === 'subscribe' ? Math.round(basePrice * 0.85) : basePrice;

  async function handleAdd() {
    try {
      await add({ product, variantLabel: variant, quantity: 1 });
      toast.success('Added to cart');
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

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { to: '/shop', label: 'Shop' },
          { to: `/shop?category=${product.category}`, label: capitalize(product.category) },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-cream-200"
          >
            <img
              src={product.images?.[activeImg]?.url}
              alt={product.images?.[activeImg]?.alt || product.name}
              className="w-full h-full object-cover"
            />
            {product.badges?.[0] && (
              <span className="absolute top-3 left-3 bg-forest-100/90 text-forest-700 text-[10px] tracking-wider-2 font-semibold px-3 py-1 rounded-full">
                {product.badges[0]}
              </span>
            )}
          </motion.div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={classNames(
                  'aspect-square rounded-lg overflow-hidden border-2 transition',
                  activeImg === i ? 'border-forest-600' : 'border-transparent'
                )}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <div className="aspect-square rounded-lg bg-blush-100 flex items-center justify-center text-forest-600">
              <Play size={20} />
            </div>
          </div>
        </div>

        {/* Buy box */}
        <div>
          <h1 className="font-serif text-4xl text-forest-700">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2">
            <StarRating value={product.rating} size={16} />
            <span className="text-sm text-forest-700/60 underline">
              {product.rating} ({product.reviewCount} Reviews)
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl text-forest-700 font-medium">{formatPrice(finalPrice)}</span>
            {compareAt && compareAt > finalPrice && (
              <span className="text-base text-forest-700/40 line-through">{formatPrice(compareAt)}</span>
            )}
          </div>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="label">SELECT SIZE</span>
                <span className="text-xs text-forest-700/60 underline">Size Guide</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {product.variants.map((v) => {
                  const isActive = variant === v.label;
                  const isPopular = v.label === '250g';
                  return (
                    <button
                      key={v.label}
                      onClick={() => setVariant(v.label)}
                      className={classNames(
                        'relative rounded-md border py-3 text-sm font-medium transition',
                        isActive
                          ? 'bg-blush-200 border-forest-600 text-forest-700'
                          : 'border-forest-600/15 text-forest-700/80 hover:bg-cream-200'
                      )}
                    >
                      {isPopular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-[10px] tracking-wider-2 font-semibold px-2 py-0.5 rounded-full">
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

          <div className="mt-6">
            <span className="label">PURCHASE OPTION</span>
            <div className="mt-2 space-y-2">
              {[
                { id: 'one-time', label: 'One-time purchase', price: basePrice },
                { id: 'subscribe', label: 'Subscribe & Save 15%', price: Math.round(basePrice * 0.85), tag: 'BEST VALUE' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={classNames(
                    'flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition',
                    option === opt.id ? 'border-forest-600 bg-cream-100' : 'border-forest-600/15 bg-cream-100/50'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="opt"
                      className="accent-forest-600"
                      checked={option === opt.id}
                      onChange={() => setOption(opt.id)}
                    />
                    <span className="text-sm text-forest-700">{opt.label}</span>
                    {opt.tag && (
                      <span className="bg-blush-200 text-forest-700 text-[10px] font-semibold tracking-wider-2 px-2 py-0.5 rounded-full">
                        {opt.tag}
                      </span>
                    )}
                  </span>
                  <span className="font-medium">{formatPrice(opt.price)}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleAdd} className="btn-primary w-full mt-6">
            <ShoppingCart size={16} /> Add to Cart — {formatPrice(finalPrice)}
          </button>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Leaf, label: 'CERTIFIED ORGANIC' },
              { icon: Sprout, label: 'FARM TO PACK' },
              { icon: Beaker, label: 'LAB TESTED' },
            ].map((b) => (
              <div key={b.label} className="border border-forest-600/10 rounded-lg p-3">
                <b.icon size={16} className="mx-auto text-forest-600" />
                <div className="mt-1 text-[10px] tracking-wider-2 text-forest-700/70">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-b border-forest-600/10">
        <div className="flex gap-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={classNames(
                'pb-3 text-sm font-medium transition',
                tab === t ? 'text-forest-700 border-b-2 border-gold-500' : 'text-forest-700/60 hover:text-forest-700'
              )}
            >
              {t}
              {t === 'Reviews' && product.reviewCount > 0 && (
                <span className="ml-2 text-xs bg-blush-200 text-forest-700 px-2 py-0.5 rounded-full">
                  {product.reviewCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {tab === 'Benefits' && (
          <div className="bg-blush-100 rounded-2xl p-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-2xl text-forest-700">The Miracle Tree&apos;s Power</h3>
              <p className="mt-3 text-sm text-forest-700/70 leading-relaxed">
                {product.longDescription || product.description}
              </p>
              <ul className="mt-6 space-y-4">
                {product.benefits?.map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <Check size={18} className="text-forest-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-forest-700">{b.title}</div>
                      <div className="text-sm text-forest-700/70">{b.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1611073761666-3e3eaf75bef2?auto=format&fit=crop&w=900&q=80"
                alt="Moringa leaves"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {tab === 'Nutritional Facts' && (
          <div className="bg-cream-200/40 rounded-2xl p-8">
            <h3 className="font-serif text-2xl text-forest-700 mb-4">Per 100g serving</h3>
            <table className="w-full text-sm">
              <tbody>
                {product.nutritionalFacts?.map((f) => (
                  <tr key={f.label} className="border-b border-forest-600/10">
                    <td className="py-3 text-forest-700/80">{f.label}</td>
                    <td className="py-3 text-right font-medium text-forest-700">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6">
              <h4 className="font-medium text-forest-700">Ingredients</h4>
              <p className="text-sm text-forest-700/70 mt-1">{product.ingredients?.join(', ')}</p>
            </div>
          </div>
        )}

        {tab === 'Usage' && (
          <div className="bg-cream-200/40 rounded-2xl p-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif text-2xl text-forest-700">How to use</h3>
              <p className="mt-3 text-forest-700/80">{product.usage}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-forest-700">Storage</h3>
              <p className="mt-3 text-forest-700/80">{product.storage}</p>
            </div>
          </div>
        )}

        {tab === 'Reviews' && (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              {reviews.length === 0 && (
                <p className="text-forest-700/60">No reviews yet. Be the first to share your experience.</p>
              )}
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-forest-600/10 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-forest-700">{r.user?.name || 'Customer'}</div>
                      {r.verifiedPurchase && (
                        <span className="text-[10px] tracking-wider-2 text-forest-600 font-semibold">VERIFIED PURCHASE</span>
                      )}
                    </div>
                    <StarRating value={r.rating} />
                  </div>
                  {r.title && <h4 className="mt-3 font-medium text-forest-700">{r.title}</h4>}
                  <p className="mt-1 text-sm text-forest-700/80">{r.body}</p>
                </div>
              ))}
            </div>
            <div className="bg-cream-200/40 rounded-2xl p-6 h-fit">
              <h3 className="font-serif text-xl text-forest-700">Leave a review</h3>
              <form onSubmit={submitReview} className="mt-4 space-y-3">
                <div>
                  <span className="label">RATING</span>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                        className={n <= reviewForm.rating ? 'text-gold-500' : 'text-forest-700/30'}
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
        )}
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl text-forest-700">Complete Your Routine</h2>
              <p className="text-sm text-forest-700/70 mt-1">Synergistic herbs to amplify your wellness journey.</p>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function capitalize(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
