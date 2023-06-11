export function formatCurrencyRounded(number: Number) {
  const formattedNumber = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    // minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formattedNumber;
}

export function formatCurrencyExact(number: Number) {
  const formattedNumber = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  if (formattedNumber.endsWith(".00")) {
    return formattedNumber.slice(0, -3); // Truncate cents for full dollar amounts
  }
  
  return formattedNumber;
}