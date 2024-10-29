import type { EntryFieldTypes } from "contentful";
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import { contentfulClient, type RichTextDocument } from "~/lib/contentful";

interface RespectSectionSkeleton {
  contentTypeId: "respectSection";
  fields: {
    tabLabel: EntryFieldTypes.Text;
    content: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    order: EntryFieldTypes.Number;
  };
}

export interface RespectSection {
  tabLabel: string;
  content: RichTextDocument;
  order: number;
  slug: string;
}

export async function getRespectSections(): Promise<Array<RespectSection>> {
  const response = await contentfulClient.getEntries<RespectSectionSkeleton>({
    content_type: "respectSection",
  });

  const richTextPromises = response.items.map((item) => {
    return richTextFromMarkdown(item.fields.content);
  });
  const respectSectionsContent = await Promise.all(richTextPromises);

  return response.items
    .map((item, index) => {
      return {
        tabLabel: item.fields.tabLabel,
        order: item.fields.order,
        slug: item.fields.slug,
        content: respectSectionsContent[index],
      };
    })
    .sort((a, b) => a.order - b.order);
}
