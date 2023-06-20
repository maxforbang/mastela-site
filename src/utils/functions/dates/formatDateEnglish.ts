import { format, parseISO } from "date-fns";

export function formatDateEnglish(date: Date | string | undefined) {
  if (!date) {
    return ''
  }
  
  let parsedDate: Date | string = date;

  if (typeof date === 'string') {
    parsedDate = parseISO(date);
  } else {
    parsedDate = date;
  }

  const currentDate = new Date();
  return currentDate.getFullYear() === parsedDate.getFullYear()
    ? format(parsedDate, "MMMM do")
    : format(parsedDate, "MMM do, yyyy");
}

