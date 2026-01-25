import LRUCache from "quick-lru";
import { z } from "zod";

const priceFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const localCache = new LRUCache<number, TicketLeapEventPrice>({
  maxSize: 50,
  // 5 minutes
  maxAge: 1000 * 60 * 5,
});

const EventPriceSchema = z.array(
  z.object({
    data: z.object({
      attributes: z.object({
        price: z.object({
          amount: z.number(),
        }),
        inventory: z.number(),
        tickets_sold: z.number(),
      }),
    }),
  }),
);

export interface TicketLeapEventPrice {
  price: string;
  isSoldOut: boolean;
}

export const EMPTY_EVENT_PRICE: TicketLeapEventPrice = {
  price: "",
  isSoldOut: false,
};

export async function getTicketLeapPrice(
  type: "shows" | "classes",
  eventId: number,
): Promise<TicketLeapEventPrice> {
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
    .then(EventPriceSchema.parseAsync)
    .then((res) => {
      const priceLevelDetails = res[0].data.attributes;

      const eventPrice: TicketLeapEventPrice = {
        price: priceFormatter.format(priceLevelDetails.price.amount / 100),
        isSoldOut:
          priceLevelDetails.tickets_sold >= priceLevelDetails.inventory,
      };

      localCache.set(eventId, eventPrice);

      return eventPrice;
    })
    .catch(() => EMPTY_EVENT_PRICE);
}
