import contentful, {
  type Asset,
  type Entry,
  type EntrySkeletonType,
  type UnresolvedLink,
} from "contentful";
export type { Document as RichTextDocument } from "@contentful/rich-text-types";

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: "cdn.contentful.com",
});

export type ContentfulAsset =
  | UnresolvedLink<"Asset">
  | Asset<undefined, string>;
export type ContentfulEntry<T extends EntrySkeletonType> =
  | UnresolvedLink<"Entry">
  | Entry<T, undefined, string>;
