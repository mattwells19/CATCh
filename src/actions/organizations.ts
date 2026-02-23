import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const organizations = {
  organizations: defineAction({
    accept: "form",
    input: z.object({
      firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(35, "First name cannot exceed 35 characters."),
      lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(35, "Last name cannot exceed 35 characters."),
      organizationName: z
        .string()
        .trim()
        .min(1, "Organization name is required.")
        .max(100, "Organization name cannot exceed 100 characters."),
      phone: z
        .string()
        .trim()
        .min(1, "Phone number is required.")
        .max(30, "Phone number cannot exceed 30 characters."),
      email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .toLowerCase()
        .max(254, "Email addresses cannot be longer than 254 characters."),
      message: z
        .string()
        .trim()
        .min(1, "Please tell us how we can support your organization.")
        .max(2000, "Message cannot exceed 2000 characters."),
    }),
    handler: async (_input) => {
      // TODO: Implement backend — store submission to Supabase or send via email
      return { success: true };
    },
  }),
};
