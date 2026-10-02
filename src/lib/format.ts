const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatINR = (n: number) => inr.format(Math.round(n));

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();
export const nightsBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);
export const fmtShort = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const fmtNumeric = (d: Date) => d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
