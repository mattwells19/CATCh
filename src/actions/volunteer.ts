import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { z } from "astro:schema";
import { removeSignUp, volunteer as signUp } from "../api/volunteer";

const getListingIdParam = (ctx: ActionAPIContext) => {
  try {
    const listingIdParam = ctx.params.listingId;
    const listingId = z.number({ coerce: true }).parse(listingIdParam);
    return listingId;
  } catch {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: `No listing ID in the URL: ${ctx.url.toString()}`,
    });
  }
};

export const volunteer = {
  volunteer: defineAction({
    accept: "form",
    input: z.object({
      firstName: z
        .string()
        .trim()
        .min(1, "Your first name has to have at least one letter.")
        .max(
          35,
          "Sorry, but your first name is too long. Max is 35 characters.",
        ),
      lastName: z
        .string()
        .trim()
        .min(1, "Your last name has to have at least one letter.")
        .max(
          35,
          "Sorry, but your last name is too long. Max is 35 characters.",
        ),
      email: z
        .string()
        .trim()
        .email()
        .toLowerCase()
        .max(254, "Email addresses cannot be longer than 254 characters."),
      role: z.enum(["tech", "volunteer"]),
    }),
    handler: (input, ctx) =>
      signUp(
        getListingIdParam(ctx),
        input.firstName,
        input.lastName,
        input.email,
        input.role,
      ),
  }),
  unvolunteer: defineAction({
    accept: "form",
    input: z.object({
      listingId: z.number(),
      email: z
        .string()
        .trim()
        .email()
        .toLowerCase()
        .max(254, "Email addresses cannot be longer than 254 characters."),
    }),
    handler: (input) => removeSignUp(input.listingId, input.email),
  }),
};
