import { DateRange } from "types";

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


export function formatDateRangeUrl({startDate, endDate} : {startDate: Date, endDate: Date}) {
  const startYear = startDate.getFullYear();
  const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
  const startDay = startDate.getDate().toString().padStart(2, '0');
  const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;

  const endYear = endDate.getFullYear();
  const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
  const endDay = endDate.getDate().toString().padStart(2, '0');
  const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;
  
  return {startDate: formattedStartDate, endDate: formattedEndDate}
}
