import type { Asset, Entry, EntryFieldType, EntryFieldTypes, EntrySkeletonType } from "contentful";
import {
  contentfulClient,
  type ContentfulAsset,
  type ContentfulEntry,
} from "~/lib/contentful";
import type { Document } from "@contentful/rich-text-types";
import type { PersonSkeleton } from "./getPerformers";
import { E } from "dist/server/chunks/astro/assets-service_CshDUYLC.mjs";

export interface TeamSkeleton {
  contentTypeId: "team";
  fields: {
    teamName: EntryFieldTypes.Text;
    teamMembers: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<PersonSkeleton>
    >;
    teamBio: EntryFieldTypes.RichText;
    teamSlug: EntryFieldTypes.Text;
    teamHeader: EntryFieldTypes.AssetLink;
    teamPoster: EntryFieldTypes.AssetLink;
    teamGallery: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  };
}

export interface Team {
  teamName: string;
  teamMembers: Array<ContentfulEntry<PersonSkeleton>>;
  teamBio: Document;
  teamSlug: string;
  teamHeader?: string;
  teamPoster?: string;
  teamGallery?: Array<string | undefined>;
}

const isResolvedAsset = (a: ContentfulAsset): a is Asset<undefined, string> =>
  a.sys.type === "Asset";

const extractAssetURL = (a?: ContentfulAsset): string | undefined => {
  if (a && isResolvedAsset(a)) {
    return a.fields.file?.url;
  }
  return undefined;
};

function isResolvedEntry<T extends EntrySkeletonType>(e: ContentfulEntry<T>): e is Entry<T, undefined, string> {
  return e.sys.type === "Entry";
}

function extractEntry<T extends EntrySkeletonType>(e: ContentfulEntry<T>): EntrySkeletonType | undefined {
  if (e && isResolvedEntry(e)) {
    return e.fields;
  }
} 

export async function getTeam(teamSlug: string): Promise<Team | undefined> {
  const response = await contentfulClient.getEntries<TeamSkeleton>({
    content_type: "team",
    "fields.teamSlug": teamSlug,
  });

  if (response.items.length === 0) {
    return undefined;
  }

  const fields = response.items[0].fields;
  return {
    ...fields,
    teamHeader: extractAssetURL(fields.teamHeader),
    teamPoster: extractAssetURL(fields.teamPoster),
    teamGallery: fields.teamGallery.map(extractAssetURL),
  };
}
