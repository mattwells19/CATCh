import { EMPTY_CLASS, getDetailsForClasses, type Class } from "./getClasses";
import {
  getTicketLeapListings,
  type TicketLeapListing,
} from "./utils/getTicketLeapListings";
import { getTicketLeapPrice } from "./utils/getTicketLeapPrice";

export interface TicketLeapClassListing extends TicketLeapListing {
  price: string;
}

export type ClassListing = TicketLeapClassListing & Nullable<Class>;

export async function getClassListings({
  limit,
}: {
  limit?: number;
} = {}): Promise<Array<ClassListing>> {
  // const classListings = await getTicketLeapListings("classes", limit);
  const classListings = [] as TicketLeapListing[];

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
