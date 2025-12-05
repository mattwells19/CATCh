import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { volunteer as signUp } from "../api/volunteer";

export const volunteer = {
  volunteer: defineAction({
    accept: "form",
    input: z.object({
      listingId: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      role: z.enum(["tech", "volunteer"]),
    }),
    handler: (input) =>
      signUp(
        input.listingId,
        input.firstName,
        input.lastName,
        input.email,
        input.role,
      ),
  }),
};
