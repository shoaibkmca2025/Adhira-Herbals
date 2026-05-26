import { Link } from 'react-router-dom';

const cols = [
  {
    heading: 'SHOP',
    links: [
      { to: '/shop', label: 'All Products' },
      { to: '/shop?category=superfood', label: 'Superfoods' },
      { to: '/shop?category=skincare', label: 'Skincare' },
    ],
  },
  {
    heading: 'SUPPORT',
    links: [
      { to: '#', label: 'Shipping Policy' },
      { to: '#', label: 'Privacy Policy' },
      { to: '#', label: 'Terms of Service' },
      { to: '#', label: 'Contact Us' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-cream-100 mt-24">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-3xl text-white">Adhira<br />Herbals</h3>
          <p className="mt-4 text-sm text-cream-100/70 max-w-xs">
            Ancient wisdom, meticulously crafted for the modern healing journey.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.heading}>
            <h4 className="text-[11px] tracking-wider-2 text-cream-100/60 font-medium">{c.heading}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-[11px] tracking-wider-2 text-cream-100/60 font-medium">NEWSLETTER</h4>
          <p className="text-sm text-cream-100/70 mt-4">
            Join our community for wellness rituals and exclusive offers.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex items-center border border-cream-100/20 rounded-md overflow-hidden"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent px-3 py-2 text-sm placeholder-cream-100/40 focus:outline-none"
            />
            <button className="px-4 text-cream-100 hover:text-white">→</button>
          </form>
        </div>
      </div>
      <div className="border-t border-cream-100/10">
        <div className="container-page py-6 text-xs text-cream-100/60 flex justify-between">
          <span>© 2024 Adhira Herbals. Ancient Wisdom, Modern Healing.</span>
          <span>Made with care.</span>
        </div>
      </div>
    </footer>
  );
}
