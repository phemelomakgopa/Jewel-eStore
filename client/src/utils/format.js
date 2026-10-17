// "R1,234.50" — the format the store has always shown (en-ZA's default
// "R 1 234,50" reads oddly next to it).
const amount = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// All money in the app is held as integer cents. This is the only place it
// gets turned into a display string.
export const formatPrice = (cents) => `R${amount.format((Number(cents) || 0) / 100)}`;

// Orders written before amounts moved to cents stored rands. Orders written
// now carry `unit: "cents"`.
export const orderAmountToCents = (order, amount) =>
  order?.unit === "cents" ? Number(amount) || 0 : Math.round((Number(amount) || 0) * 100);

export const formatDate = (value, options = { year: "numeric", month: "long", day: "numeric" }) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-ZA", options).format(date);
};
