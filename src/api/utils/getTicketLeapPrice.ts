const priceFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function getTicketLeapPrice(
  type: "shows" | "classes",
  eventId: number,
): Promise<string> {
  return fetch(
    `https://admin.ticketleap.events/api/v1/events/${eventId}/relationships/price-levels`,
    {
      headers: {
        "X-API-Token":
          type === "shows"
            ? import.meta.env.TICKETLEAP_SHOWS_TOKEN
            : import.meta.env.TICKETLEAP_CLASSES_TOKEN,
      },
    },
  )
    .then((res) => res.json())
    .then((res) =>
      priceFormatter.format(res[0].data.attributes.price.amount / 100),
    )
    .catch(() => "");
}
