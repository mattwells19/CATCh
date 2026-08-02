import { add } from "date-fns";
import type { ClassListing } from "~/api/getClassListings";
import { formatEst } from "./formatEst";

export function formatClassTime(startDate: Date): string {
  const dayOfTheWeek = formatEst(startDate, "EEEE");
  const time = formatEst(startDate, "h:mm a");
  const startDay = formatEst(startDate, "LLL do");

  return `Meets every ${dayOfTheWeek} at ${time} starting ${startDay}`;
}

export function formatClassDateRange(classListing: ClassListing) {
  const classStartDate = classListing.date;

  const dayOfTheWeek = formatEst(classStartDate, "EEEE");

  if (
    classListing.classLengthUnits === "hours" ||
    classListing.classLengthUnits === "minutes" ||
    (classListing.classLengthUnits === "days" &&
      classListing.classLengthValue === 1)
  ) {
    // single day classes
    const time = formatEst(classStartDate, "h:mm a");
    const day = formatEst(classStartDate, "LLL d");

    return `${dayOfTheWeek}, ${day} at ${time}`;
  }

  if (
    // > 1 day classes
    classListing.classLengthUnits !== null &&
    classListing.classLengthValue !== null
  ) {
    const endDate = add(classStartDate, {
      // subtract 1 to include the first week.
      // if a class starts on January 1st and goes for 6 weeks, we only need to add 5 weeks to get the final week.
      [classListing.classLengthUnits]: classListing.classLengthValue - 1,
    });
    return `${dayOfTheWeek}s, ${formatEst(
      classStartDate,
      "MMM. d",
    )} – ${formatEst(endDate, "MMM. d")} at ${formatEst(
      classStartDate,
      "h aa",
    )}`;
  }

  // no end date/duration specified. This can happen if the class is not in the CMS
  return `${dayOfTheWeek}s, ${formatEst(
    classStartDate,
    "MMM. d",
  )} at ${formatEst(classStartDate, "h aa")}`;
}
