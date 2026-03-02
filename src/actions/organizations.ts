import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
        .max(2000, "Message cannot exceed 2000 characters."),
    }),
    handler: async (input) => {
      const name = escapeHtml(`${input.firstName} ${input.lastName}`);
      const org = escapeHtml(input.organizationName);
      const phone = escapeHtml(input.phone);
      const email = escapeHtml(input.email);
      const message = escapeHtml(input.message).replace(/\n/g, "<br />");

      const { error } = await resend.emails.send({
        from: "CATCh Website <noreply@catch.theater>",
        to: "info@catch.theater",
        replyTo: input.email,
        subject: `Organization Inquiry from ${input.firstName} ${input.lastName} — ${input.organizationName}`,
        html: `
          <h2>New Organization Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Organization:</strong> ${org}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      if (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email.");
      }

      return { success: true };
    },
  }),
};
