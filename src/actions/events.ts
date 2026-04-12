import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getSupabaseSchedulerClient } from "~/lib/supabase/scheduler";

export const events = {
  newEvent: defineAction({
    accept: "form",
    input: z.object({
      name: z
        .string()
        .trim()
        .min(1, "Your event name has to have at least one letter.")
        .max(
          100,
          "Sorry, but your event name is too long. Max is 100 characters.",
        ),
      date: z.string().date(),
      start: z.string().time(),
      end: z.string().time(),
      location: z.enum(["Theater", "Annex", "Office"]),
    }),
    handler: async (input, ctx) => {
      const supabaseScheduler = getSupabaseSchedulerClient(
        ctx.request,
        ctx.cookies,
      );
      const user = await supabaseScheduler.auth.getUser();
      console.log(user);

      const start = new Date(`${input.date}T${input.start}-04:00`);
      const end = new Date(`${input.date}T${input.end}-04:00`);

      const result = await supabaseScheduler.from("events").insert({
        name: input.name,
        start,
        end,
        location: input.location,
        // this isn't working :(
        created_by: user.data.user?.id ?? null,
      });
      return result;
    },
  }),
  // deleteEvent: defineAction({
  //   accept: "form",
  //   input: z.object({
  //     listingId: z.number(),
  //     email: z
  //       .string()
  //       .trim()
  //       .email()
  //       .toLowerCase()
  //       .max(254, "Email addresses cannot be longer than 254 characters."),
  //   }),
  //   handler: (input) => removeSignUp(input.listingId, input.email),
  // }),
};
