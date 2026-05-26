import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '../../api/endpoints.js';
import { formatPrice } from '../../utils/format.js';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { products } = await adminApi.products.list();
    setProducts(products);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id, name) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await adminApi.products.remove(id);
      toast.success('Product deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-forest-700">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={14} /> New Product
        </Link>
      </div>

      <div className="mt-6 bg-white border border-forest-600/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-200/50 text-forest-700/70 text-xs uppercase tracking-wider-2">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Stock</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-600/10">
            {loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-forest-700/60">Loading…</td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-forest-700/60">No products yet.</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-cream-200/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-cream-200 overflow-hidden">
                      {p.images?.[0]?.url && (
                        <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-forest-700">{p.name}</div>
                      <div className="text-xs text-forest-700/60">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize">{p.category}</td>
                <td className="px-5 py-3">{formatPrice(p.price, p.currency)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock < 10 ? 'text-gold-500 font-medium' : ''}>{p.stock}</span>
                </td>
                <td className="px-5 py-3">
                  {p.isPublished ? (
                    <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">Published</span>
                  ) : (
                    <span className="text-xs bg-cream-200 text-forest-700/60 px-2 py-0.5 rounded-full">Hidden</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      to={`/admin/products/${p._id}`}
                      className="p-2 hover:bg-cream-200 rounded-md text-forest-700"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => remove(p._id, p.name)}
                      className="p-2 hover:bg-red-50 rounded-md text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
