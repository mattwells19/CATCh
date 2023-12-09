import type { CockpitImage, WYSIWYGString } from "./api.types";
import { getCollectionEntries } from "./utils";

export interface Class {
  class: string;
  slug: string;
  price: string;
  length: string;
  hasShow: boolean;
  description: WYSIWYGString;
  image: CockpitImage;
  _id: string;
  shortDesc: string;
  navName: string;
  navDesc: string;
  addlHTML: WYSIWYGString | null;
  category:
    | "Personal & Professional Development"
    | "Improv Performance Track"
    | "Stand-up Comedy"
    | "Sketch Comedy"
    | "Other";
  trackNum: number | null;
  TLEventID: string;
  descTagline: string;
  metaName: string;
  metaDesc: string;
  metaImage: CockpitImage;
  active: boolean;
}

export async function getClasses(): Promise<Array<Class>> {
  const classEntries = await getCollectionEntries<Class>("classes");

  return classEntries
    .filter((classEntry) => classEntry.active)
    .map((classEntry) => ({
      ...classEntry,
      image: {
        path: `https://catch.theater${classEntry.image.path}`,
      },
      metaImage: {
        path: `https://catch.theater${classEntry.metaImage.path}`,
      },
    }));
}

export async function getClass(classSlug: string): Promise<Class | null> {
  const classes = await getClasses();

  return classes.find((classEntry) => classEntry.slug === classSlug) ?? null;
}
