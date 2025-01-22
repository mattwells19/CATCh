import { parseISO, addHours } from "date-fns";

export interface TicketLeapEventsResponse {
  data: Array<{
    id: string;
    type: "events";
    attributes: {
      name: string;
      image: string;
      slug: string;
      onsale: boolean;
      settings: {
        private: boolean;
      };
      dates: Array<{
        event_id: string;
        start: string; // date string
        end: string; // usually empty string
        status: string; // numbers as strings. idk what each one means, but "5" seems to be "active"
      }>;
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

export async function getTicketLeapListings(
  type: "shows" | "classes",
  limit?: number,
): Promise<Array<TicketLeapListing>> {
  const now = new Date();

  const events = await fetch(
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
  )
    .then((res) => res.json())
    .then((res: TicketLeapEventsResponse) => {
      return res.data
        .filter((d) => d.attributes.onsale && !d.attributes.settings.private)
        .map((d) => ({ ...d, id: Number.parseInt(d.id) }));
    });

  const listings = events.map(({ attributes: event, id: event_id }) => {
    return event.dates
      .filter((listing) => {
        // listing is in 24-hour format, but has no offset.
        // TODO: double check this when Daylight Savings starts in March as this number could change.
        const listingStart = addHours(parseISO(listing.start), 5);

        // "5" seems to be the "active" status for a listing
        return (
          listing.status === "5" &&
          // the parent event may have listings from the past, so filter out anything before "today" here
          now < listingStart
        );
      })
      .map((listing) => ({
        eventId: event_id,
        id: Number.parseInt(listing.event_id),
        name: event.name,
        image: `https:${event.image}`,
        date: new Date(listing.start),
        listingUrl: `https://www.ticketleap.events/tickets/${event.slug}?date=${
          Date.parse(listing.start) / 1000
        }`,
      }));
  });

  return listings
    .flat()
    .sort(
      (listingA, listingB) => listingA.date.getTime() - listingB.date.getTime(),
    )
    .slice(0, limit);
}
