import type { CockpitImage, WYSIWYGString } from "./api.types";
import type { Team } from "./getTeams";
import { getCollectionEntries } from "./utils";

export interface Performer {
  firstName: string;
  lastName: string;
  active: boolean;
  bio: WYSIWYGString;
  headshot: CockpitImage;
  teams: Array<{
    _id: string /* team ID */;
    link: "teams";
    display: Team["name"];
  }>;
  pronouns: string;
  bioLonger: WYSIWYGString;
  slug: string;
  title?: string;
  externalLinks: Array<unknown>; // ??
  alum: boolean;
}

export async function getPerformers(): Promise<Array<Performer>> {
  const performerEntries = await getCollectionEntries<Performer>("performers");

  return performerEntries
    .filter((performer) => performer.active)
    .map((performer) => ({
      ...performer,
      headshot: {
        path: `https://catch.theater${performer.headshot.path}`,
      },
    }));
}

export async function getPerformer(
  performerSlug: string,
): Promise<Performer | null> {
  const performers = await getPerformers();

  return (
    performers.find((performer) => performer.slug === performerSlug) ?? null
  );
}
