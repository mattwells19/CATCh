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
    handler: async (input) => {
      const res = await fetch(
        `${import.meta.env.DISCORD_BUSINESS_REQUEST_WEBHOOK_URL}?wait=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            thread_name: `New business request for information from ${input.organizationName}!`,
            embeds: [
              {
                title: input.organizationName,
                description: input.message,
                fields: [
                  {
                    name: "Name",
                    value: `${input.firstName} ${input.lastName}`,
                    inline: true,
                  },
                  {
                    name: "Phone number",
                    value: input.phone,
                    inline: true,
                  },
                  {
                    name: "Email",
                    value: input.email,
                    inline: true,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (res.ok) {
        return { success: true };
      } else {
        const resBody = await res.json();
        throw new Error(resBody.message);
      }
    },
  }),
};
