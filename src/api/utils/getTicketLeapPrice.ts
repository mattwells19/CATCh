import LRUCache from "quick-lru";

const priceFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const localCache = new LRUCache<number, string>({
  maxSize: 30,
  // 1 hour
  maxAge: 1000 * 60 * 60,
});

export async function getTicketLeapPrice(
  type: "shows" | "classes",
  eventId: number,
): Promise<string> {
  const cacheHit = localCache.get(eventId);
  if (cacheHit) {
    return Promise.resolve(cacheHit);
  }

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
    .then((res) => {
      const eventPrice = priceFormatter.format(
        res[0].data.attributes.price.amount / 100,
      );

      localCache.set(eventId, eventPrice);

      return eventPrice;
    })
    .catch(() => "");
}
