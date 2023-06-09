export function formatCurrency(number: Number) {
  const formattedNumber = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    // minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formattedNumber;
}