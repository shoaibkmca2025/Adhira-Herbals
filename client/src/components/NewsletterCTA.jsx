import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  function subscribe(e) {
    e.preventDefault();
    if (!email) return;
    toast.success('You\'re in. Watch your inbox.');
    setEmail('');
  }
  return (
    <section className="container-page py-16">
      <div className="relative overflow-hidden rounded-3xl bg-forest-gradient text-cream-100 px-8 sm:px-14 py-14 shadow-float">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #FAF4E6 0%, transparent 40%), radial-gradient(circle at 80% 80%, #FAF4E6 0%, transparent 35%)',
          }}
        />
        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-50 leading-tight">
              Join the wellness ritual.
            </h2>
            <p className="mt-3 text-cream-100/80 max-w-md leading-relaxed">
              Recipes, rituals and 10% off your first order — straight to your inbox, monthly.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full bg-forest-800/40 border border-cream-100/15 text-cream-50 placeholder-cream-100/40 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-mustard-400/60"
            />
            <button type="submit" className="btn-mustard whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
