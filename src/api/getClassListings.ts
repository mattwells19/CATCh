import { getDetailsForClasses, type Class } from "./getClasses";

interface TicketLeapClassListing {
  type: string;
  resource: string;
  event_start: string; // string date - "YYYY-MM-DD HH:MM:SS" (24 hour clock)
  event_end: string;
  server_event_start: string; // string date
  server_event_end: string; // string date
  single_event_series: boolean;
  children_count: string; // string number
  min_price: string; // string number
  min_price_fmt: string;
  event_id: number;
  venue_name: string;
  venue_city: string;
  image: string;
  listing_url: string;
  listing_title: string;
  listing_slug: string;
  is_parent: boolean;
  sold_out: boolean;
  listing_id: number;
  listing_type: number; // probably an enum
  custom_button_text: string | null;
  has_only_free_tickets: false;
}

export interface ClassListing extends TicketLeapClassListing {
  header: Class["classHeader"] | null;
  description: Class["classDescription"] | null;
}

export async function getClassListings({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<Array<ClassListing>> {
  const upcomingClasses: Array<TicketLeapClassListing> = await fetch(
    `https://www.ticketleap.events/api/organization-listing/catch-u/range?start=${from}&end=${to}`,
  )
    .then((res) => res.json())
    .then((data) =>
      data.listings.map((listing: TicketLeapClassListing) => ({
        ...listing,
        listing_id: Number.parseInt(listing.listing_id.toString()),
      })),
    );

  const sortedClasses = [...upcomingClasses].sort(
    (a, b) => Date.parse(a.event_start) - Date.parse(b.event_start),
  );

  const classDetailsMap = await getDetailsForClasses(
    sortedClasses.map((classListing) => classListing.listing_id),
  );

  return sortedClasses.map((classSession) => {
    const details = classDetailsMap.get(classSession.listing_id);

    return {
      ...classSession,
      image: `https:${classSession.image}`,
      listing_url: `https://www.ticketleap.events/tickets/${classSession.listing_slug}`,
      header: details?.classHeader ?? null,
      description: details?.classDescription ?? null,
    };
  });
}
