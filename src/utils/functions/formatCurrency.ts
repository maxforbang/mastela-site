export function formatCurrencyRounded(number: number) {
  const formattedNumber = number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    // minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formattedNumber;
}

export function formatCurrencyExact(number: number | string) {
  let parsedNumber: number | string = number;
  
  if (typeof number === 'string') {
    parsedNumber = parseFloat(number);
  }
  
  const formattedNumber = parsedNumber.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  if (formattedNumber.endsWith(".00")) {
    return formattedNumber.slice(0, -3); // Truncate cents for full dollar amounts
  }
  
  return formattedNumber;
}
