export function renderGreek(label, value) {
  return (
    <p>
      <strong>{label}:</strong> {formatCurrency(value)}
    </p>
  );
}

export function formatCurrency(x) {
  if (x === undefined || x === null) return "-";
  return x.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}
