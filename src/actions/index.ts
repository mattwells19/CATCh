import { events } from "./events";
import { volunteer } from "./volunteer";

export const server = {
  ...volunteer,
  ...events,
};
