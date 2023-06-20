export function datesEqual(date1: Date | undefined, date2: Date | undefined) {
  return date1?.getTime() === date2?.getTime();
}