import { toDate } from "date-fns-tz";
import LRUCache from "quick-lru";

export interface TicketLeapEventsResponse {
  data: Array<{
    id: string;
    type: "events";
    attributes: {
      name: string;
      image: string | null;
      slug: string;
      onsale: boolean;
      settings: {
        private: boolean;
      };
      dates: Array<{
        event_id: string;
        start: string; // date string
        end: string; // usually empty string
        status: string;
      }>;
      listing_settings: {
        header_image: string;
      };
    };
  }>;
}

export interface TicketLeapListing {
  eventId: number;
  id: number;
  name: string;
  image: string;
  date: Date;
  listingUrl: string;
}

export interface GetTicketLeapListingsOptions {
  limit?: number;
  start?: Date;
  end?: Date;
}

const localCache = new LRUCache<string, TicketLeapEventsResponse>({
  maxSize: 10,
  // 30 minutes
  maxAge: 1000 * 60 * 30,
});

const fetchWithCache = async (
  type: "shows" | "classes",
): Promise<TicketLeapEventsResponse> => {
  const cacheHit = localCache.get(type);
  if (cacheHit) {
    return Promise.resolve(cacheHit);
  }

  const res = await fetch(
    // https://technically.showclix.com/events.html
    "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
    {
      headers: {
        "X-API-Token":
          type === "shows"
            ? import.meta.env.TICKETLEAP_SHOWS_TOKEN
            : import.meta.env.TICKETLEAP_CLASSES_TOKEN,
      },
    },
  ).then((res) => res.json());

  localCache.set(type, res);

  return res;
};

export async function getTicketLeapListings(
  type: "shows" | "classes",
  options?: GetTicketLeapListingsOptions,
): Promise<Array<TicketLeapListing>> {
  const now = toDate(Date.now(), { timeZone: "America/New_York" });

  const events = await fetchWithCache(type).then((res) => {
    return res.data
      .filter((d) => d.attributes.onsale && !d.attributes.settings.private)
      .map((d) => ({ ...d, id: Number.parseInt(d.id) }));
  });

  const listings = events.map(({ attributes: event, id: event_id }) => {
    return event.dates
      .filter((listing) => {
        // listing is ISO 8601 with no offset.
        const listingStart = toDate(listing.start, {
          timeZone: "America/New_York",
        });

        // the parent event may have listings from the past, so filter out anything before "today" here
        const isAfterNow = now < listingStart;
        const isAfterStart = !options?.start || listingStart > options.start;
        const isBeforeEnd = !options?.end || listingStart <= options.end;

        return (
          listing.status === "active" &&
          isAfterNow &&
          isAfterStart &&
          isBeforeEnd
        );
      })
      .map((listing) => {
        let imageUrl = event.image ?? event.listing_settings.header_image;
        if (imageUrl) {
          imageUrl = imageUrl.startsWith("//")
            ? `https:${event.listing_settings.header_image}`
            : imageUrl;
        } else {
          imageUrl = "/images/CATCh-Placeholder.jpg";
        }

        return {
          eventId: event_id,
          id: Number.parseInt(listing.event_id),
          name: event.name,
          image: imageUrl,
          date: toDate(listing.start, { timeZone: "America/New_York" }),
          listingUrl: `https://www.ticketleap.events/tickets/${
            event.slug
          }?date=${Date.parse(listing.start) / 1000}`,
        };
      });
  });

  return listings
    .flat()
    .sort(
      (listingA, listingB) => listingA.date.getTime() - listingB.date.getTime(),
    )
    .slice(0, options?.limit);
}
