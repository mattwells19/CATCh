import { getDetailsForShows, type Show } from "./getShows";

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

export interface ShowListing extends TicketLeapShowListing {
  description: Show["showDescription"] | null;
  shortDescription: Show["showShortDescription"] | null;
}

export async function getShowListings({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<Array<ShowListing>> {
  const upcomingShows: Array<TicketLeapShowListing> = await fetch(
    `https://www.ticketleap.events/api/organization-listing/catch/range?start=${from}&end=${to}`,
  )
    .then((res) => res.json())
    .then((data) =>
      data.listings.map((listing: TicketLeapShowListing) => ({
        ...listing,
        listing_id: Number.parseInt(listing.listing_id.toString()),
      })),
    );

  const sortedUpcomingShows = [...upcomingShows].sort(
    (a, b) => Date.parse(a.event_start) - Date.parse(b.event_start),
  );

  const showDetailsMap = await getDetailsForShows(
    sortedUpcomingShows.map((showListing) => showListing.listing_id),
  );

  return sortedUpcomingShows.map((showListing) => {
    const details = showDetailsMap.get(showListing.listing_id);

    return {
      ...showListing,
      image: `https:${showListing.image}`,
      listing_url: `https://www.ticketleap.events/tickets/${
        showListing.listing_slug
      }?date=${Date.parse(showListing.event_start) / 1000}`,
      description: details?.showDescription ?? null,
      shortDescription: details?.showShortDescription ?? null,
    };
  });
}
