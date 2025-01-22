import { EMPTY_SHOW, getDetailsForShows, type Show } from "./getShows";
import {
  type TicketLeapListing,
  getTicketLeapListings,
} from "./utils/getTicketLeapListings";
import { getTicketLeapPrice } from "./utils/getTicketLeapPrice";

export interface TicketLeapShowListing extends TicketLeapListing {
  price: string;
}

export type ShowListing = TicketLeapShowListing & Nullable<Show>;

export async function getShowListings({
  limit,
}: {
  limit?: number;
} = {}): Promise<Array<ShowListing>> {
  const showListings = await getTicketLeapListings("shows", limit);

  const eventIds = Array.from(
    new Set(showListings.map((listing) => listing.eventId)),
  );

  const eventPricesPromise = Promise.all(
    eventIds.map((eventId) => getTicketLeapPrice("shows", eventId)),
  );
  const showDetailsMapPromise = getDetailsForShows(eventIds);

  const [eventPrices, showDetailsMap] = await Promise.all([
    eventPricesPromise,
    showDetailsMapPromise,
  ]);

  const eventPriceMap = new Map(
    eventPrices.map((eventPrice, index) => [eventIds[index], eventPrice]),
  );

  return showListings.map((showListing) => {
    const details = showDetailsMap.get(showListing.eventId) ?? EMPTY_SHOW;
    const price = eventPriceMap.get(showListing.eventId) ?? "";

    return {
      ...showListing,
      ...details,
      price,
    };
  });
}
