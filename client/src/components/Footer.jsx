import { Link } from 'react-router-dom';
import { Leaf, Instagram, MessageCircle } from 'lucide-react';

const cols = [
  {
    heading: 'Shop',
    links: [
      { to: '/shop', label: 'Moringa Powder' },
      { to: '/shop?category=calm', label: 'Subscriptions' },
      { to: '/shop', label: 'Bundles' },
      { to: '/shop', label: 'Gift Cards' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/our-story', label: 'About Us' },
      { to: '/our-story', label: 'Our Farms' },
      { to: '/our-story', label: 'Sustainability' },
      { to: '/#journal', label: 'Blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { to: '#', label: 'Contact' },
      { to: '#', label: 'Shipping Policy' },
      { to: '#', label: 'Returns & Refunds' },
      { to: '#', label: 'Privacy Policy' },
      { to: '#', label: 'Terms' },
      { to: '/login', label: 'Sign In' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-cream-200/60 mt-24 border-t border-forest-600/5">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-forest-600 flex items-center justify-center">
              <Leaf size={18} className="text-cream-50" strokeWidth={1.6} />
            </div>
            <span className="font-serif text-2xl text-forest-700 leading-none">
              Adhira Herbals
            </span>
          </Link>
          <p className="mt-5 text-sm text-forest-700/70 max-w-xs leading-relaxed">
            Premium organic moringa and Ayurvedic wellness, crafted from farm to pack in India.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-forest-600/15 bg-cream-50 hover:bg-cream-100 flex items-center justify-center"
            >
              <Instagram size={15} className="text-forest-700" strokeWidth={1.6} />
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full border border-forest-600/15 bg-cream-50 hover:bg-cream-100 flex items-center justify-center"
            >
              <MessageCircle size={15} className="text-forest-700" strokeWidth={1.6} />
            </a>
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.heading}>
            <h4 className="font-serif text-lg text-forest-700">{c.heading}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-forest-700/70 hover:text-forest-700 transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-forest-600/5">
        <div className="container-page py-6 text-xs text-forest-700/60 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Adhira Herbals. Ancient Wisdom, Modern Healing.</span>
          <span>Crafted in India · with care.</span>
        </div>
      </div>
    </footer>
  );
}
