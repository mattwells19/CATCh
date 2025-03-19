import { EMPTY_CLASS, getDetailsForClasses, type Class } from "./getClasses";
import { getTicketLeapEventListings } from "./utils/getTicketLeapListing";
import {
  getTicketLeapListings,
  type TicketLeapListing,
} from "./utils/getTicketLeapListings";
import { getTicketLeapPrice } from "./utils/getTicketLeapPrice";

export interface TicketLeapClassListing extends TicketLeapListing {
  price: string;
}

export type ClassListing = TicketLeapClassListing & Nullable<Class>;

interface GetClassListingsOptions {
  limit?: number;
  eventId?: number;
}

export async function getClassListings({
  limit,
  eventId,
}: GetClassListingsOptions = {}): Promise<Array<ClassListing>> {
  const classListings = eventId
    ? await getTicketLeapEventListings(eventId, "classes", limit)
    : await getTicketLeapListings("classes", limit);
  if (classListings === null) {
    return [];
  }

  const eventIds = Array.from(
    new Set(classListings.map((listing) => listing.eventId)),
  );

  const eventPricesPromise = Promise.all(
    eventIds.map((eventId) => getTicketLeapPrice("classes", eventId)),
  );
  const classDetailsMapPromise = getDetailsForClasses(eventIds);

  const [eventPrices, classDetailsMap] = await Promise.all([
    eventPricesPromise,
    classDetailsMapPromise,
  ]);

  const eventPriceMap = new Map(
    eventPrices.map((eventPrice, index) => [eventIds[index], eventPrice]),
  );

  return classListings.map((classListing) => {
    const details = classDetailsMap.get(classListing.eventId) ?? EMPTY_CLASS;
    const price = eventPriceMap.get(classListing.eventId) ?? "";

    return {
      ...classListing,
      ...details,
      price,
    };
  });
}
