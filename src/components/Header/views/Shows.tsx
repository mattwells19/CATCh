import type { ReactElement } from "react";
import { format } from "date-fns";
import type { Show } from "~/api/getShows";
import type { Team } from "~/api/getTeams.ts";
import { HeaderSection } from "../components/HeaderSection.tsx";
import { LinkList, LinkListItem } from "../components/LinkList.tsx";

export const Shows = ({
  nextShow,
  teams,
}: {
  nextShow: Show;
  teams: Array<Team>;
}): ReactElement => {
  const nextShowDate = new Date(nextShow.event_start);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-8">
      <HeaderSection title="Next Show">
        <a
          href={nextShow.listing_url}
          target="_blank"
          className="block rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <span className="sr-only">{nextShow.listing_title}</span>
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
        <LinkList>
          <LinkListItem href="#">Come see a show</LinkListItem>
          <LinkListItem href="#">Check out our videos</LinkListItem>
        </LinkList>
        <h3 className="uppercase border-b border-b-slate-400 mt-8 mb-3 text-slate-50">
          More Info
        </h3>
        <LinkList>
          <LinkListItem href="#">Our Performers</LinkListItem>
          <LinkListItem href="#">Frequently Asked Questions</LinkListItem>
        </LinkList>
      </HeaderSection>
      <HeaderSection title="Teams">
        <p className="my-3">
          Learn more about the different teams you can see at CATCh, from house
          teams to independent regulars!
        </p>
        <LinkList columns={2}>
          {teams.map((team) => (
            <LinkListItem key={team.slug} href={`/teams/${team.slug}`}>
              {team.name}
            </LinkListItem>
          ))}
        </LinkList>
      </HeaderSection>
    </div>
  );
};
