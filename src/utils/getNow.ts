import { toDate as toDateTz } from "date-fns-tz";

export const getNow = () =>
  toDateTz(Date.now(), { timeZone: "America/New_York" });
