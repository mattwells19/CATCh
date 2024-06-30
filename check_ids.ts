import { addMonths, getUnixTime } from "date-fns";
import type { TicketLeapShowListing } from "~/api/getShowListings";
import type { TicketLeapClassListing } from "~/api/getClassListings";

const from = getUnixTime(new Date());
const to = getUnixTime(addMonths(new Date(), 1));

const upcomingClasses: Array<TicketLeapClassListing> = await fetch(
  `https://www.ticketleap.events/api/organization-listing/catch-u/range?start=${from}&end=${to}`,
)
  .then((res) => res.json())
  .then((data) =>
    data.listings.map((listing: TicketLeapClassListing) => ({
      listing_id: Number.parseInt(listing.listing_id.toString()),
      listing_title: listing.listing_title,
    })),
  );

const upcomingShows: Array<TicketLeapShowListing> = await fetch(
  `https://www.ticketleap.events/api/organization-listing/catch/range?start=${from}&end=${to}`,
)
  .then((res) => res.json())
  .then((data) =>
    data.listings.map((listing: TicketLeapShowListing) => ({
      listing_id: Number.parseInt(listing.listing_id.toString()),
      listing_title: listing.listing_title,
    })),
  );

console.log({
  upcomingClasses,
  upcomingShows,
});
