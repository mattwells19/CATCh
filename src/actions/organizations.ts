import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { submitOrgRequest } from "~/api/organizations";

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
        .min(10, "Please enter a valid phone number.")
        .max(14, "Phone number cannot exceed 14 characters."),
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
        .max(2000, "Message cannot exceed 2,000 characters."),
    }),
    handler: submitOrgRequest,
  }),
};
