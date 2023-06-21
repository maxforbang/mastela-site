import { format, parseISO } from "date-fns";

export function formatDateEnglish(
  date: Date | string | undefined,
  excludeYear = false
) {
  if (!date) {
    return "";
  }

  let parsedDate: Date | string = date;

  if (typeof date === "string") {
    parsedDate = parseISO(date);
  } else {
    parsedDate = date;
  }

  const currentDate = new Date();

  return currentDate.getFullYear() === parsedDate.getFullYear()
    ? excludeYear
      ? format(parsedDate, "MMM do")
      : format(parsedDate, "MMMM do")
    : format(parsedDate, "MMM do, yyyy");
}
