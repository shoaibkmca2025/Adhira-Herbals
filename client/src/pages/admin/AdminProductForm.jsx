import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/endpoints.js';

const EMPTY = {
  name: '',
  tagline: '',
  category: 'superfood',
  description: '',
  longDescription: '',
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  isFeatured: false,
  isPublished: true,
  images: [{ url: '', alt: '' }],
  variants: [],
  ingredients: [],
  badges: [],
  usage: '',
  storage: '',
};

const CATEGORIES = ['superfood', 'immunity', 'energy', 'digestion', 'calm', 'skincare'];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.products.list().then(({ products }) => {
      const p = products.find((x) => x._id === id);
      if (p) {
        setForm({
          ...EMPTY,
          ...p,
          images: p.images?.length ? p.images : EMPTY.images,
          variants: p.variants || [],
          ingredients: p.ingredients || [],
          badges: p.badges || [],
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || undefined,
      stock: Number(form.stock),
      ingredients: typeof form.ingredients === 'string' ? form.ingredients.split(',').map((s) => s.trim()) : form.ingredients,
      badges: typeof form.badges === 'string' ? form.badges.split(',').map((s) => s.trim()).filter(Boolean) : form.badges,
    };
    try {
      if (isEdit) await adminApi.products.update(id, payload);
      else await adminApi.products.create(payload);
      toast.success('Saved');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    }
  }

  function addImage() {
    set('images', [...form.images, { url: '', alt: '' }]);
  }
  function updateImage(i, k, v) {
    const next = [...form.images];
    next[i] = { ...next[i], [k]: v };
    set('images', next);
  }
  function removeImage(i) {
    set('images', form.images.filter((_, idx) => idx !== i));
  }

  function addVariant() {
    set('variants', [...form.variants, { label: '', price: 0, stock: 0 }]);
  }
  function updateVariant(i, k, v) {
    const next = [...form.variants];
    next[i] = { ...next[i], [k]: k === 'label' ? v : Number(v) };
    set('variants', next);
  }
  function removeVariant(i) {
    set('variants', form.variants.filter((_, idx) => idx !== i));
  }

  if (loading) return <div className="text-forest-700/60">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="text-sm text-forest-700/70 inline-flex items-center gap-1 hover:underline">
        <ArrowLeft size={14} /> Back to products
      </Link>
      <h1 className="font-serif text-3xl text-forest-700 mt-3">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>

      <div className="mt-8 space-y-6 bg-white border border-forest-600/10 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">NAME</label>
            <input className="input mt-1" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">TAGLINE</label>
            <input className="input mt-1" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </div>
          <div>
            <label className="label">CATEGORY</label>
            <select className="input mt-1" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">BADGES (comma-separated)</label>
            <input
              className="input mt-1"
              value={Array.isArray(form.badges) ? form.badges.join(', ') : form.badges}
              onChange={(e) => set('badges', e.target.value)}
            />
          </div>
          <div>
            <label className="label">PRICE (INR)</label>
            <input type="number" className="input mt-1" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div>
            <label className="label">COMPARE AT PRICE</label>
            <input type="number" className="input mt-1" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} />
          </div>
          <div>
            <label className="label">STOCK</label>
            <input type="number" className="input mt-1" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} />
              Published
            </label>
          </div>
          <div className="col-span-2">
            <label className="label">SHORT DESCRIPTION</label>
            <textarea className="input mt-1 min-h-[80px]" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">LONG DESCRIPTION</label>
            <textarea className="input mt-1 min-h-[120px]" value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">INGREDIENTS (comma-separated)</label>
            <input
              className="input mt-1"
              value={Array.isArray(form.ingredients) ? form.ingredients.join(', ') : form.ingredients}
              onChange={(e) => set('ingredients', e.target.value)}
            />
          </div>
          <div>
            <label className="label">USAGE</label>
            <textarea className="input mt-1" value={form.usage} onChange={(e) => set('usage', e.target.value)} />
          </div>
          <div>
            <label className="label">STORAGE</label>
            <textarea className="input mt-1" value={form.storage} onChange={(e) => set('storage', e.target.value)} />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="label">IMAGES</label>
            <button onClick={addImage} className="text-xs text-forest-700 underline">+ add</button>
          </div>
          <div className="mt-2 space-y-2">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="https://image-url"
                  value={img.url}
                  onChange={(e) => updateImage(i, 'url', e.target.value)}
                />
                <input
                  className="input w-40"
                  placeholder="alt"
                  value={img.alt}
                  onChange={(e) => updateImage(i, 'alt', e.target.value)}
                />
                <button onClick={() => removeImage(i)} className="px-2 text-red-700 hover:bg-red-50 rounded">×</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="label">VARIANTS (size + price)</label>
            <button onClick={addVariant} className="text-xs text-forest-700 underline">+ add</button>
          </div>
          <div className="mt-2 space-y-2">
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <input className="input" placeholder="100g" value={v.label} onChange={(e) => updateVariant(i, 'label', e.target.value)} />
                <input type="number" className="input" placeholder="price" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} />
                <input type="number" className="input" placeholder="stock" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} />
                <button onClick={() => removeVariant(i)} className="px-2 text-red-700 hover:bg-red-50 rounded">×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-forest-600/10">
          <Link to="/admin/products" className="btn-outline">Cancel</Link>
          <button onClick={save} className="btn-primary">{isEdit ? 'Save Changes' : 'Create Product'}</button>
        </div>
      </div>
    </div>
  );
}
