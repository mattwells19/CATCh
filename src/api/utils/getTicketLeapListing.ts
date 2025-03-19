import { parseISO, addHours } from "date-fns";
import type {
  TicketLeapEventsResponse,
  TicketLeapListing,
} from "./getTicketLeapListings";

export interface TicketLeapEventResponse {
  data: TicketLeapEventsResponse["data"][number];
}

export async function getTicketLeapEventListings(
  eventId: number,
  type: "shows" | "classes",
  limit?: number,
): Promise<Array<TicketLeapListing> | null> {
  const now = new Date();

  const event = await fetch(
    // https://technically.showclix.com/events.html
    `https://admin.ticketleap.events/api/v1/events/${eventId}?filter=upcoming=true`,
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
    .then((res: TicketLeapEventResponse) => {
      const eventData = res.data;

      if (
        eventData.attributes.onsale &&
        !eventData.attributes.settings.private
      ) {
        return {
          ...eventData,
          id: Number.parseInt(eventData.id),
        };
      }

      return null;
    });

  if (event === null) {
    return null;
  }

  const listings = event.attributes.dates
    .filter((listing) => {
      // listing is in 24-hour format, but has no offset.
      // TODO: double check this when Daylight Savings starts in March as this number could change.
      const listingStart = addHours(parseISO(listing.start), 5);

      return (
        listing.status === "active" &&
        // the parent event may have listings from the past, so filter out anything before "today" here
        now < listingStart
      );
    })
    .map((listing) => ({
      eventId: event.id,
      id: Number.parseInt(listing.event_id),
      name: event.attributes.name,
      image: event.attributes.image
        ? `https:${event.attributes.image}`
        : "/images/CATCh-Placeholder.jpg",
      date: new Date(listing.start),
      listingUrl: `https://www.ticketleap.events/tickets/${
        event.attributes.slug
      }?date=${Date.parse(listing.start) / 1000}`,
    }));

  return listings
    .flat()
    .sort(
      (listingA, listingB) => listingA.date.getTime() - listingB.date.getTime(),
    )
    .slice(0, limit);
}
