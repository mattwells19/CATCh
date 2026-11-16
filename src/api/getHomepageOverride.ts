import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { EntryFieldTypes } from "contentful";
import { contentfulClient } from "~/lib/contentful";

interface HomepageOverrideSkeleton {
  contentTypeId: "homepageOverride";
  fields: {
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.RichText;
    link: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;
  };
}

export interface HomepageOverride {
  title: string;
  description: string | null;
  link: string;
  image: string;
}

export async function getHomepageOverride(): Promise<HomepageOverride | null> {
  const response = await contentfulClient.getEntries<HomepageOverrideSkeleton>({
    content_type: "homepageOverride",
    limit: 1,
  });

  const homepageOverride = response.items.at(0);
  if (!homepageOverride) {
    return null;
  }

  return {
    title: homepageOverride.fields.title,
    link: homepageOverride.fields.link,
    description: documentToHtmlString(homepageOverride.fields.description),
    image: `https:${homepageOverride.fields.image.fields.file.url}`,
  };
}
