import { add, format } from "date-fns";
import type { ClassListing } from "~/api/getClassListings";

export function formatClassTime(startDate: Date): string {
  const dayOfTheWeek = format(startDate, "EEEE");
  const time = format(startDate, "h:mm a");
  const startDay = format(startDate, "LLL do");

  return `Meets every ${dayOfTheWeek} at ${time} starting ${startDay}`;
}

export function formatClassDateRange(classListing: ClassListing) {
  const classStartDate = new Date(classListing.date);
  const dayOfTheWeek = format(classStartDate, "EEEE");

  if (
    classListing.classLengthUnits === "hours" ||
    classListing.classLengthUnits === "minutes" ||
    (classListing.classLengthUnits === "days" &&
      classListing.classLengthValue === 1)
  ) {
    // single day classes
    const time = format(classStartDate, "h:mm a");
    const day = format(classStartDate, "LLL d");

    return `${dayOfTheWeek}, ${day} at ${time}`;
  }

  if (
    // > 1 day classes
    classListing.classLengthUnits !== null &&
    classListing.classLengthValue !== null
  ) {
    const endDate = add(classStartDate, {
      [classListing.classLengthUnits]: classListing.classLengthValue,
    });
    return `${dayOfTheWeek}s, ${format(classStartDate, "MMM. d")} - ${format(
      endDate,
      "MMM. d",
    )} at ${format(classStartDate, "h aa")}`;
  }

  // no end date/duration specified. This can happen if the class is not in the CMS
  return `${dayOfTheWeek}s, ${format(classStartDate, "MMM. d")} at ${format(
    classStartDate,
    "h aa",
  )}`;
}
