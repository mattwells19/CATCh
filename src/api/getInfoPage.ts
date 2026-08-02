import type { EntryFieldTypes } from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { contentfulClient } from "~/lib/contentful";

interface InfoPageSkeleton {
  contentTypeId: "info";
  fields: {
    title: EntryFieldTypes.Text;
    content: EntryFieldTypes.RichText;
    slug: EntryFieldTypes.Text;
  };
}

export interface InfoPage {
  title: string;
  content: string;
}

export async function getInfoPage(infoSlug: string): Promise<InfoPage | null> {
  const response = await contentfulClient.getEntries<InfoPageSkeleton>({
    content_type: "info",
    "fields.slug": infoSlug,
    limit: 1,
  });

  const infoPage = response.items.at(0);
  if (!infoPage) {
    return null;
  }

  return {
    title: infoPage.fields.title,
    content: documentToHtmlString(infoPage.fields.content),
  };
}
