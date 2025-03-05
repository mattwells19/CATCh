import { createClient, type CreateClientParams } from "contentful";
export type { Document as RichTextDocument } from "@contentful/rich-text-types";

const previewContentfulClient: CreateClientParams = {
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_PREVIEW_TOKEN,
  host: "preview.contentful.com",
};

const publicContentfulClient: CreateClientParams = {
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: "cdn.contentful.com",
};

export const contentfulClient = createClient(
  import.meta.env.DEV ? previewContentfulClient : publicContentfulClient,
);
