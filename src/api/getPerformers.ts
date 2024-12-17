import type { EntryFieldTypes } from "contentful";
import {
  contentfulClient,
  type ContentfulAsset,
  type ContentfulEntry,
} from "~/lib/contentful";
import type { Document } from "@contentful/rich-text-types";
import type { TeamSkeleton } from "./getTeams";

export interface PersonSkeleton {
  contentTypeId: "person";
  fields: {
    slug: EntryFieldTypes.Text;
    fullName: EntryFieldTypes.Text;
    roles: EntryFieldTypes.Array<EntryFieldTypes.Symbol<string>>;
    bioShort: EntryFieldTypes.RichText;
    bioLong: EntryFieldTypes.RichText;
    headshot: EntryFieldTypes.AssetLink;
    teams: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TeamSkeleton>>;
  };
}

export interface Person {
  slug: string;
  fullName: string;
  roles: Array<string>;
  bioShort: Document;
  bioLong: Document;
  headshot: ContentfulAsset;
  teams: Array<ContentfulEntry<TeamSkeleton>>;
}

export async function getPerson(
  personSlug: string,
): Promise<Person | undefined> {
  const response = await contentfulClient.getEntries<PersonSkeleton>({
    content_type: "person",
    "fields.slug": personSlug,
  });

  return response.items[0].fields;
}
