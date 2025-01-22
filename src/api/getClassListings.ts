import { EMPTY_CLASS, getDetailsForClasses, type Class } from "./getClasses";
import {
  getTicketLeapListings,
  type TicketLeapListing,
} from "./utils/getTicketLeapListings";

export interface TicketLeapClassListing extends TicketLeapListing {}

export type ClassListing = TicketLeapClassListing & Nullable<Class>;

export async function getClassListings({
  limit,
}: {
  limit?: number;
} = {}): Promise<Array<ClassListing>> {
  const classListings = await getTicketLeapListings("classes", limit);

  const eventIds = Array.from(
    new Set(classListings.map((listing) => listing.eventId)),
  );

  const classDetailsMap = await getDetailsForClasses(eventIds);

  return classListings.map((classListing) => {
    const details = classDetailsMap.get(classListing.eventId) ?? EMPTY_CLASS;

    return {
      ...classListing,
      ...details,
    };
  });
}
