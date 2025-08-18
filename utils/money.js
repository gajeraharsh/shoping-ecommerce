// /utils/money.js
// Currency helpers: convert minor units to major and format via Intl

const CURRENCY_DECIMALS = {
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  MGA: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

export function getCurrencyDecimals(code) {
  if (!code) return 2;
  const upper = String(code).toUpperCase();
  return CURRENCY_DECIMALS[upper] ?? 2;
}

export function toMajorUnits(minorAmount, code) {
  if (typeof minorAmount !== 'number' || Number.isNaN(minorAmount)) return 0;
  const decimals = getCurrencyDecimals(code);
  const factor = 10 ** decimals;
  return minorAmount / factor;
}

export function formatAmount(minorAmount, code) {
  const major = toMajorUnits(minorAmount, code);
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: (code || 'USD').toUpperCase(),
    }).format(major);
  } catch (_) {
    return major.toLocaleString();
  }
}
