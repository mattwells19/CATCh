interface OrgRequestInput {
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  phone: string;
}

export const submitOrgRequest = async (input: OrgRequestInput) => {
  const res = await fetch(
    `${import.meta.env.DISCORD_BUSINESS_REQUEST_WEBHOOK_URL}?wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: `Organization services request: ${input.organizationName}`,
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
};
