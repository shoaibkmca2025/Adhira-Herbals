import { Check } from 'lucide-react';

const items = [
  'USDA ORGANIC',
  'LAB TESTED',
  'VEGAN',
  'GLUTEN FREE',
  'NO ADDITIVES',
  'SUSTAINABLY SOURCED',
  'MADE IN INDIA',
];

export default function TrustStrip() {
  return (
    <section className="bg-cream-200/60 border-y border-forest-600/5">
      <div className="container-page py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {items.map((label) => (
          <div key={label} className="flex items-center gap-2">
            <Check size={14} className="text-forest-600" strokeWidth={2.4} />
            <span className="text-[11px] tracking-wider-2 font-medium text-forest-700/80">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
