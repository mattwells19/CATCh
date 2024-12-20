import { EMPTY_SHOW, getDetailsForShows, type Show } from "./getShows";

export interface TicketLeapEvents {
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

export interface TicketLeapShowListing {
  id: number;
  name: string;
  image: string;
  date: Date;
  price: string;
  listing_url: string;
}

const priceFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export type ShowListing = TicketLeapShowListing & Nullable<Show>;

export async function getShowListings({
  limit,
}: {
  limit?: number;
}): Promise<Array<ShowListing>> {
  const events = await fetch(
    // https://technically.showclix.com/events.html
    "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
    {
      headers: {
        "X-API-Token": import.meta.env.TICKETLEAP_SHOWS_TOKEN,
      },
    },
  )
    .then((res) => res.json())
    .then((res: TicketLeapEvents) => {
      return res.data
        .filter((d) => d.attributes.onsale && !d.attributes.settings.private)
        .map((d) => ({ ...d, id: Number.parseInt(d.id) }));
    });

  const getEventPrice = (eventId: number): Promise<string> => {
    return fetch(
      `https://admin.ticketleap.events/api/v1/events/${eventId}/relationships/price-levels`,
      {
        headers: {
          "X-API-Token": import.meta.env.TICKETLEAP_SHOWS_TOKEN,
        },
      },
    )
      .then((res) => res.json())
      .then((res) =>
        priceFormatter.format(res[0].data.attributes.price.amount / 100),
      )
      .catch(() => "");
  };

  const listings = events.map(({ attributes: event, id: event_id }) => {
    return event.dates
      .filter((listing) => {
        console.log(
          event.name,
          Date.now(),
          Date.parse(listing.start),
          listing.start,
        );

        // "5" seems to be the "active" status for a listing
        return (
          listing.status === "5" &&
          // the parent event may have listings from the past, so filter out anything before "today" here
          Date.now() < Date.parse(listing.start)
        );
      })
      .map((listing) => ({
        event_id,
        id: Number.parseInt(listing.event_id),
        name: event.name,
        image: `https:${event.image}`,
        date: new Date(listing.start),
        price: "",
        listing_url: `https://www.ticketleap.events/tickets/${
          event.slug
        }?date=${Date.parse(listing.start) / 1000}`,
      }));
  });

  const showListings = listings
    .flat()
    .sort(
      (listingA, listingB) => listingA.date.getTime() - listingB.date.getTime(),
    )
    .slice(0, limit);

  const eventIds = Array.from(
    new Set(showListings.map((listing) => listing.event_id)),
  );

  const eventPricesPromise = Promise.all(eventIds.map(getEventPrice));
  const showDetailsMapPromise = getDetailsForShows(eventIds);

  const [eventPrices, showDetailsMap] = await Promise.all([
    eventPricesPromise,
    showDetailsMapPromise,
  ]);

  const eventPriceMap = new Map(
    eventPrices.map((eventPrice, index) => [eventIds[index], eventPrice]),
  );

  return showListings.map((showListing) => {
    const details = showDetailsMap.get(showListing.event_id) ?? EMPTY_SHOW;
    const price = eventPriceMap.get(showListing.event_id) ?? "";

    return {
      ...showListing,
      ...details,
      price,
    };
  });
}
