import { addMinutes, addYears, parseISO, subMinutes } from "date-fns";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import type { DateRange as DateRangeType } from "types";
import type { CalendarComponent } from "types";
import { api } from "~/utils/api";
import { datesEqual } from "~/utils/functions/dates/datesEqual";
import {
  classNames,
  formatDateRangeUrl,
  formatDateUrl,
} from "~/utils/functions/functions";

//TODO: Change styling to hide duplicate dates (or make the text & background white for the duplicates at the beginning and end of the month)
export const DateRangePicker = ({
  dates,
  setDates,
  setCalendarShowing,
  property = "",
  ...props
}: CalendarComponent) => {
  const timeZone = "America/New_York"; // Datepicker should always reflect the timezone where the properties are located

  // console.log(new Date());
  // console.log(new Date().getTimezoneOffset());
  // console.log(formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd"));
  // console.log(
  //   "add minutes",
  //   addMinutes(new Date(), new Date().getTimezoneOffset())
  // );

  const { data: unavailableDates = [] } =
    api.properties.getBlockedDatesForProperty.useQuery(
      {
        slug: property,
        // Start/End Dates should always correspond to the current day in Cape Coral
        startDate: formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd"),
        endDate: formatInTimeZone(
          addYears(new Date(), 1),
          timeZone,
          "yyyy-MM-dd"
        ),
      },
      {
        enabled: !!property,
      }
    );

  const currentDate = utcToZonedTime(new Date(), timeZone);

  const initialDates = {
    startDate: dates?.startDate ? parseISO(dates.startDate) : currentDate,
    endDate: dates?.endDate ? parseISO(dates.endDate) : currentDate,
  };

  const intialCalendarDates = [
    {
      ...initialDates,
      key: "selection",
    },
  ];

  const [calendarDates, setCalendarDates] =
    useState<(DateRangeType & { key: string })[]>(intialCalendarDates);

  // Sync calendars if there are multiple on the page
  useEffect(() => {
    if (dates?.startDate && dates?.endDate) {
      const selectedStartDate = parseISO(dates.startDate);
      const selectedEndDate = parseISO(dates.endDate);

      if (
        !datesEqual(selectedStartDate, calendarDates[0]?.startDate) ||
        !datesEqual(selectedEndDate, calendarDates[0]?.endDate)
      ) {
        setCalendarDates([
          {
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            key: "selection",
          },
        ]);
      }
    }
  }, [dates]);

  return (
    <DateRange
      className={classNames("my-1 rounded-2xl")}
      onChange={(item) => {
        setCalendarDates([
          {
            startDate: item.selection?.startDate ?? new Date(),
            endDate: item.selection?.endDate ?? new Date(),
            key: "selection",
          },
        ]);
        if (!datesEqual(item.selection?.startDate, item.selection?.endDate)) {
          setDates(formatDateRangeUrl(item.selection as DateRangeType));
          setCalendarShowing && setCalendarShowing(false);
        }
      }}
      months={1}
      ranges={calendarDates}
      direction="vertical"
      minDate={new Date()}
      maxDate={addYears(new Date(), 1)}
      disabledDates={unavailableDates.map(
        (date) => addMinutes(date, date.getTimezoneOffset()) // All dates returned from server are 00:00 time UTC but the browser converts it to local time. Adding the timezoneOffset undoes this.
      )}
      preventSnapRefocus={true}
      fixedHeight
      rangeColors={["rgb(14 165 233"]}
      {...props}
    />
  );
};
