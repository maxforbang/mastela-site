import { format } from "date-fns";

export function formatDateEnglish(date: Date) {
  const currentDate = new Date();
  return currentDate.getFullYear() === date.getFullYear()
    ? format(date, "MMMM do")
    : format(date, "MMM do, yyyy");
}

