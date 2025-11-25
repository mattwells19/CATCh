import { formatInTimeZone } from "date-fns-tz";

export const formatEst = (
  date: Date | string | number,
  strFormat: string,
): string => formatInTimeZone(date, "America/New_York", strFormat);
