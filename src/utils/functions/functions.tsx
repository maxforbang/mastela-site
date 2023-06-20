import type { DateRange } from "types";
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateUrl(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate
}


export function formatDateRangeUrl(dates: DateRange | undefined) {
  
  if (!dates) {
    return {startDate: formatDateUrl(new Date()), endDate: formatDateUrl(new Date())}
  }

  const {startDate, endDate} = dates

  const formattedStartDate = formatDateUrl(startDate);
  const formattedEndDate = formatDateUrl(endDate);
  
  return {startDate: formattedStartDate, endDate: formattedEndDate}
}
