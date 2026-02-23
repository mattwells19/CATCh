import { organizations } from "./organizations";
import { volunteer } from "./volunteer";

export const server = {
  ...volunteer,
  ...organizations,
};
