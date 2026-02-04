/// <reference types="./lib.deno.d.ts" />
import type { TicketLeapEventsResponse } from "~/api/utils/getTicketLeapListings";

const upcomingClasses = await fetch(
  "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
  {
    headers: {
      "X-API-Token": Deno.env.get("TICKETLEAP_CLASSES_TOKEN")!,
    },
  },
)
  .then((res) => res.json())
  .then((data) =>
    Deno.writeTextFile("Classes.json", JSON.stringify(data, undefined, 4)),
  );

const upcomingShows = await fetch(
  "https://admin.ticketleap.events/api/v1/events?filter=upcoming=true",
  {
    headers: {
      "X-API-Token": Deno.env.get("TICKETLEAP_SHOWS_TOKEN")!,
    },
  },
)
  .then((res) => res.json())
  .then((data) =>
    Deno.writeTextFile("Shows.json", JSON.stringify(data, undefined, 4)),
  );

fetch(
  `https://admin.ticketleap.events/api/v1/events/2048750/relationships/price-levels`,
  {
    headers: {
      "X-API-Token": Deno.env.get("TICKETLEAP_SHOWS_TOKEN")!,
    },
  },
)
  .then((res) => res.json())
  .then((data) =>
    Deno.writeTextFile("Prices.json", JSON.stringify(data, undefined, 4)),
  );
