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
        inventory: z.number().nullable(),
        tickets_sold: z.number().nullable(),
      }),
    }),
  }),
);

export interface TicketLeapEventPrice {
  price: string;
  inventory: number;
  ticketsSold: number;
  isSoldOut: boolean;
}

export const EMPTY_EVENT_PRICE: TicketLeapEventPrice = {
  price: "",
  inventory: 0,
  ticketsSold: 0,
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
      const priceFormatted =
        priceLevelDetails.price.amount > 0
          ? priceFormatter.format(priceLevelDetails.price.amount / 100)
          : "";
      const inventory = priceLevelDetails.inventory ?? 0;
      const ticketsSold = priceLevelDetails.tickets_sold ?? 0;

      const eventPrice: TicketLeapEventPrice = {
        price: priceFormatted,
        inventory,
        ticketsSold,
        isSoldOut: ticketsSold >= inventory,
      };

      localCache.set(eventId, eventPrice);

      return eventPrice;
    })
    .catch(() => EMPTY_EVENT_PRICE);
}
