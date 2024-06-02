import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import type { EntryFieldTypes } from "contentful";
import { contentfulClient, type RichTextDocument } from "~/lib/contentful";

interface ClassSkeleton {
  contentTypeId: "class";
  fields: {
    className: EntryFieldTypes.Text;
    classTrack: EntryFieldTypes.Text; // might need to be an enum
    classTrackNumber: EntryFieldTypes.Number;
    classLength: EntryFieldTypes.Text; // might need this to be more strict
    classSlug: EntryFieldTypes.Text;
    classDescription: EntryFieldTypes.Text;
    classCost: EntryFieldTypes.Number;
    ticketleapEventId: EntryFieldTypes.Number;
    hasAShow: EntryFieldTypes.Boolean;
    classHeader: EntryFieldTypes.Text;
  };
}

export interface Class {
  className: string;
  classTrack: string;
  classTrackNumber: number;
  classLength: string;
  classSlug: string;
  classDescription: RichTextDocument;
  classCost: number;
  ticketleapEventId: number;
  hasAShow: boolean;
  classHeader: string;
}

export async function getDetailsForClasses(
  ticketleapEventIds: Array<number>,
): Promise<Map<number, Class>> {
  const response = await contentfulClient.getEntries<ClassSkeleton>({
    content_type: "class",
    "fields.ticketleapEventId[in]": ticketleapEventIds,
  });

  const richTextPromises = response.items.map((item) => {
    return richTextFromMarkdown(item.fields.classDescription);
  });
  const classDescriptions = await Promise.all(richTextPromises);

  const classDetailsMap = new Map<number, Class>();
  response.items.forEach((item, index) => {
    classDetailsMap.set(item.fields.ticketleapEventId, {
      ...item.fields,
      classDescription: classDescriptions[index],
    });
  });
  return classDetailsMap;
}
