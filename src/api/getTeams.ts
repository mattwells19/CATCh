import type { CockpitImage, WYSIWYGString } from "./api.types";

export interface Team {
  name: string;
  slug: string;
  active: boolean;
  heroimg: CockpitImage;
  videoheader: {
    url: string | null;
    text: string | null;
    title: string | null;
    id: string | null;
    provider: string | null;
    asset_id: string | null;
  };
  shortDesc: string;
  description: WYSIWYGString;
  poster: CockpitImage;
  gallery: Array<CockpitImage>;
}

export async function getTeams(): Promise<Array<Team>> {
  const teamEntries: Array<Team> = await fetch(
    `https://catch.theater/cockpit/api/collections/get/teams?token=${
      import.meta.env.COCK_TOKEN
    }`,
  )
    .then((collection) => collection.json())
    .then((collection) => collection.entries);

  return teamEntries
    .filter((team) => team.active)
    .map((team) => ({
      ...team,
      heroimg: {
        path: `https://catch.theater${team.heroimg.path}`,
      },
      poster: {
        path: `https://catch.theater${team.poster.path}`,
      },
      gallery: Array.isArray(team.gallery)
        ? team.gallery.map((galleryImg) => ({
            path: `https://catch.theater${galleryImg.path}`,
          }))
        : [],
    }));
}

export async function getTeam(teamSlug: string): Promise<Team | null> {
  const teams = await getTeams();

  const teamSlugMap = new Map(teams.map((team) => [team.slug, team]));

  return teamSlugMap.get(teamSlug) ?? null;
}
