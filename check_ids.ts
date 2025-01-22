import type { TicketLeapEventsResponse } from "~/api/utils/getTicketLeapListings";

const upcomingClasses = await fetch(
  "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
  {
    headers: {
      "X-API-Token": "",
    },
  },
)
  .then((res) => res.json())
  .then((res: TicketLeapEventsResponse) => {
    return res.data.map((d) => ({
      id: d.id,
      name: d.attributes.name,
      dates: d.attributes.dates,
    }));
  });

const upcomingShows = await fetch(
  "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
  {
    headers: {
      "X-API-Token": "",
    },
  },
)
  .then((res) => res.json())
  .then((res: TicketLeapEventsResponse) => {
    return res.data.map((d) => ({
      id: d.id,
      name: d.attributes.name,
      dates: d.attributes.dates,
    }));
  });

console.log({
  upcomingClasses,
  upcomingShows,
});
