export function utcDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(Date.UTC(year ?? 0, (month ?? 0) - 1, day)); // months are 0-indexed in JS
}
