export function formatPrice(amount, currency = 'INR') {
  if (amount == null) return '';
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function classNames(...xs) {
  return xs.filter(Boolean).join(' ');
}
