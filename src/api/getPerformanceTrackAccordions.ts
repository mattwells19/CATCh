import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import type { EntryFieldTypes } from "contentful";
import { contentfulClient, type RichTextDocument } from "~/lib/contentful";

interface PTAccordionSkeleton {
  contentTypeId: "ptAccordion";
  fields: {
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;
  };
}

export interface PTAccordion {
  title: string;
  description: RichTextDocument;
  image: string;
}

export async function getPerformanceTrackAccordions(): Promise<
  Array<PTAccordion>
> {
  const response = await contentfulClient.getEntries<PTAccordionSkeleton>({
    content_type: "ptAccordion",
  });

  const richTextPromises = response.items.map((item) => {
    return richTextFromMarkdown(item.fields.description);
  });
  const ptAccordionDescriptions = await Promise.all(richTextPromises);

  return response.items
    .map((item, index) => ({
      ...item.fields,
      description: ptAccordionDescriptions[index],
      image: `https:${item.fields.image.fields.file.url}`,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
