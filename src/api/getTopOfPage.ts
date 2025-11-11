import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import type { EntryFieldTypes } from "contentful";
import { contentfulClient, type RichTextDocument } from "~/lib/contentful";

interface TopOfPageSkeleton {
  contentTypeId: "topOfPage";
  fields: {
    page: EntryFieldTypes.Text;
    content: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;
  };
}

export interface TopOfPage {
  page: string;
  content: RichTextDocument;
  image: string;
}

export async function getTopOfPage(page: string): Promise<TopOfPage> {
  const response = await contentfulClient.getEntries<TopOfPageSkeleton>({
    content_type: "topOfPage",
    "fields.page": page,
    limit: 1,
  });

  const topOfPage = response.items.at(0);
  if (!topOfPage) {
    throw new Error("No content for page.");
  }

  const topOfPageContent = await richTextFromMarkdown(topOfPage.fields.content);

  return {
    page: topOfPage.fields.page,
    content: topOfPageContent,
    image: `https:${topOfPage.fields.image.fields.file.url}`,
  };
}
