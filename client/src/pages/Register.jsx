import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/auth.js';
import { useCart } from '../store/cart.js';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { mergeGuestIntoUser } = useCart();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      await mergeGuestIntoUser();
      toast.success('Welcome to Adhira');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-20 max-w-md">
      <h1 className="font-serif text-4xl text-forest-700">Create your account</h1>
      <p className="mt-2 text-forest-700/70">Join us for thoughtful Ayurvedic rituals.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="label">FULL NAME</label>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">EMAIL</label>
          <input
            className="input mt-1"
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label">PASSWORD (8+ CHARS)</label>
          <input
            className="input mt-1"
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-forest-700/70 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-forest-700 underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
