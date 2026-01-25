import { EMPTY_SHOW, getDetailsForShows, type Show } from "./getShows";
import { getTicketLeapEventListings } from "./utils/getTicketLeapListing";
import {
  type GetTicketLeapListingsOptions,
  type TicketLeapListing,
  getTicketLeapListings,
} from "./utils/getTicketLeapListings";
import {
  EMPTY_EVENT_PRICE,
  getTicketLeapPrice,
  type TicketLeapEventPrice,
} from "./utils/getTicketLeapPrice";

export interface TicketLeapShowListing
  extends TicketLeapListing, TicketLeapEventPrice {}

export type ShowListing = TicketLeapShowListing & Nullable<Show>;

interface GetShowListingsOptions extends GetTicketLeapListingsOptions {
  eventId?: number;
}

export async function getShowListings({
  eventId,
  ...options
}: GetShowListingsOptions = {}): Promise<Array<ShowListing>> {
  const showListings = eventId
    ? await getTicketLeapEventListings(eventId, "shows", options.limit)
    : await getTicketLeapListings("shows", options);

  if (showListings === null) {
    return [];
  }

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
    const price = eventPriceMap.get(showListing.eventId) ?? EMPTY_EVENT_PRICE;

    return {
      ...showListing,
      ...details,
      ...price,
    };
  });
}
