export interface ClassListing {
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
  event_id: string;
  venue_name: string;
  venue_city: string;
  image: string;
  listing_title: string;
  listing_slug: string;
  listing_url: string;
  is_parent: boolean;
  sold_out: boolean;
  listing_id: string;
  listing_type: number; // probably an enum
  custom_button_text: string | null;
}

export async function getClassListings({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<Array<ClassListing>> {
  const upcomingClasses: Array<ClassListing> = await fetch(
    `https://www.ticketleap.events/api/organization-listing/catch-u/range?start=${from}&end=${to}`,
  )
    .then((res) => res.json())
    .then((data) => data.listings);

  const sortedClasses = [...upcomingClasses].sort(
    (a, b) => Date.parse(a.event_start) - Date.parse(b.event_start),
  );

  return sortedClasses.map((classSession) => ({
    ...classSession,
    image: `https:${classSession.image}`,
    listing_url: `https://www.ticketleap.events/tickets/${classSession.listing_slug}`,
  }));
}
