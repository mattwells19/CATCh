export interface Show {
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

export async function getShows({ from, to }: { from: number; to: number }): Promise<Array<Show>> {
  const upcomingShows: Array<Show> = await fetch(
    `https://www.ticketleap.events/api/organization-listing/catch/range?start=${from}&end=${to}`,
  )
    .then((res) => res.json())
    .then((data) => data.listings);

  const sortedUpcomingShows = [...upcomingShows].sort((a, b) => Date.parse(a.event_start) - Date.parse(b.event_start));

  return sortedUpcomingShows.map((show) => ({
    ...show,
    image: `https:${show.image}`,
    listing_url: `https://www.ticketleap.events/tickets/${show.listing_slug}`,
  }));
}
