import { EMPTY_SHOW, getDetailsForShows, type Show } from "./getShows";

export interface TicketLeapShowListing {
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
  listing_id: number;
  listing_type: number; // probably an enum
  custom_button_text: string | null;
}

export type ShowListing = TicketLeapShowListing & Nullable<Show>;

export async function getShowListings({
  from,
  to,
  limit,
}: {
  from: number;
  to?: number;
  limit?: number;
}): Promise<Array<ShowListing>> {
  const upcomingShowsUrl = new URL(
    "https://www.ticketleap.events/api/organization-listing/catch/range",
  );
  upcomingShowsUrl.searchParams.set("start", from.toString());
  if (typeof to === "number") {
    upcomingShowsUrl.searchParams.set("end", to.toString());
  }
  const upcomingShows: Array<TicketLeapShowListing> = await fetch(
    upcomingShowsUrl,
  )
    .then((res) => res.json())
    .then((data) =>
      data.listings.map((listing: TicketLeapShowListing) => ({
        ...listing,
        listing_id: Number.parseInt(listing.listing_id.toString()),
      })),
    );

  const sortedUpcomingShows = [...upcomingShows]
    .sort((a, b) => Date.parse(a.event_start) - Date.parse(b.event_start))
    .slice(0, limit);

  const showDetailsMap = await getDetailsForShows(
    sortedUpcomingShows.map((showListing) => showListing.listing_id),
  );

  return sortedUpcomingShows.map((showListing) => {
    const details = showDetailsMap.get(showListing.listing_id) ?? EMPTY_SHOW;

    return {
      ...showListing,
      ...details,
      image: `https:${showListing.image}`,
      listing_url: `https://www.ticketleap.events/tickets/${
        showListing.listing_slug
      }?date=${Date.parse(showListing.event_start) / 1000}`,
    };
  });
}
