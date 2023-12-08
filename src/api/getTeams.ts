import type { CockpitImage, WYSIWYGString } from "./api.types";
import { getCollectionEntries } from "./utils";

export interface Team {
  _id: string;
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
  const teamEntries = await getCollectionEntries<Team>("teams");

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

  return teams.find((team) => team.slug === teamSlug) ?? null;
}
