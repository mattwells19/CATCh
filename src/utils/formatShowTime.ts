import { formatEst } from "./formatEst";

export function formatShowTime(showDate: Date) {
  const dayOfTheWeek = formatEst(showDate, "EEEE");
  const time = formatEst(showDate, "h:mm a");
  const day = formatEst(showDate, "LLL d");

  return `${dayOfTheWeek}, ${day} at ${time}`;
}
