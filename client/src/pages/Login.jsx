import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/auth.js';
import { useCart } from '../store/cart.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { login } = useAuth();
  const { mergeGuestIntoUser } = useCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      await mergeGuestIntoUser();
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-20 max-w-md">
      <h1 className="font-serif text-4xl text-forest-700">Welcome back</h1>
      <p className="mt-2 text-forest-700/70">Sign in to continue your wellness journey.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="label">EMAIL</label>
          <input
            className="input mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label">PASSWORD</label>
          <input
            className="input mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-sm text-forest-700/70 text-center">
        New to Adhira?{' '}
        <Link to="/register" className="text-forest-700 underline underline-offset-4">
          Create an account
        </Link>
      </p>
      <div className="mt-6 text-xs text-forest-700/50 text-center bg-cream-200/50 rounded-lg p-3">
        Demo admin: <b>admin@adhiraherbals.com</b> / <b>Admin@123</b>
      </div>
    </div>
  );
}
