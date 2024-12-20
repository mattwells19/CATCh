import { addMonths, getUnixTime } from "date-fns";
import type { TicketLeapEvents } from "~/api/getShowListings";
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

const upcomingShows = await fetch(
  "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
  {
    headers: {
      "X-API-Token": "",
    },
  },
)
  .then((res) => res.json())
  .then((res: TicketLeapEvents) => {
    return res.data
      .filter((d) => !d.attributes.settings.private)
      .map((d) => ({ id: d.id, name: d.attributes.name }));
  });

console.log({
  upcomingClasses,
  upcomingShows,
});
