import { format } from "date-fns";

export function formatClassTime(startDate: Date): string {
  const dayOfTheWeek = format(startDate, "EEEE");
  const time = format(startDate, "h:mm a");
  const startDay = format(startDate, "LLL do");

  return `Meets every ${dayOfTheWeek} at ${time} starting ${startDay}`;
}
