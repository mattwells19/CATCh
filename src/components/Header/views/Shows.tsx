import type { ReactElement } from "react";
import { format } from "date-fns";
import type { Show } from "~/api/getShows";
import { HeaderSection } from "../components/HeaderSection.tsx";
import { HeaderLink } from "../components/HeaderLink.tsx";

const teams = [
  "Improv Game Night",
  "SOS Improv",
  "Situationship",
  "The Fungibles",
  "Therapy Adjacent",
  "Third Place Brenda",
];

export const Shows = ({ nextShow }: { nextShow: Show }): ReactElement => {
  const nextShowDate = new Date(nextShow.event_start);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-8">
      <HeaderSection title="Next Show">
        <a
          href={nextShow.listing_url}
          target="_blank"
          className="block rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <p className="bg-violet-500 text-center py-2 text-white border-b-4 border-pink-300">
            {format(nextShowDate, "E, LLL do")}
            {` at `}
            {format(nextShowDate, "h:mm a")}
          </p>
          <img
            src={nextShow.image}
            alt={nextShow.listing_title}
            className="w-full"
          />
          <p className="text-right bg-red-100 p-2 text-red-700 uppercase">
            Get Tickets
          </p>
        </a>
      </HeaderSection>
      <HeaderSection title="Performances">
        <ul className="flex flex-col gap-3 my-3 list-disc list-inside">
          <li>
            <HeaderLink href="#">Come see a show</HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">Check out our videos</HeaderLink>
          </li>
        </ul>
        <h3 className="uppercase border-b border-b-slate-400 mt-8 text-slate-50">
          More Info
        </h3>
        <ul className="flex flex-col gap-3 my-3 list-disc list-inside">
          <li>
            <HeaderLink href="#">Our Performers</HeaderLink>
          </li>
          <li>
            <HeaderLink href="#">Frequently Asked Questions</HeaderLink>
          </li>
        </ul>
      </HeaderSection>
      <HeaderSection title="Teams">
        <p className="my-3">
          Learn more about the different teams you can see at CATCh, from house
          teams to independent regulars!
        </p>
        <ul className="grid grid-cols-2 gap-3 list-disc list-inside">
          {teams.map((team) => (
            <li key={team}>
              <HeaderLink href="#">{team}</HeaderLink>
            </li>
          ))}
        </ul>
      </HeaderSection>
    </div>
  );
};
