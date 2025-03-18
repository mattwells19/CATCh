import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown";
import type { EntryFieldTypes } from "contentful";
import { contentfulClient, type RichTextDocument } from "~/lib/contentful";

interface ShowSkeleton {
  contentTypeId: "show";
  fields: {
    showName: EntryFieldTypes.Text;
    ticketleapEventId: EntryFieldTypes.Number;
    showDescription: EntryFieldTypes.Text;
    showShortDescription: EntryFieldTypes.Text;
  };
}

export interface Show {
  showName: string;
  ticketleapEventId: number;
  showDescription: RichTextDocument;
  showShortDescription: string;
}

export const EMPTY_SHOW: Readonly<Nullable<Show>> = {
  showName: null,
  ticketleapEventId: null,
  showDescription: null,
  showShortDescription: null,
};

export async function getDetailsForShows(
  ticketleapEventIds: Array<number>,
): Promise<Map<number, Show>> {
  // contentful does not handle empty array filters and will throw a 400
  if (ticketleapEventIds.length === 0) {
    return Promise.resolve(new Map());
  }

  const response = await contentfulClient.getEntries<ShowSkeleton>({
    content_type: "show",
    "fields.ticketleapEventId[in]": ticketleapEventIds,
  });

  const richTextPromises = response.items.map((item) => {
    return richTextFromMarkdown(item.fields.showDescription);
  });
  const showDescriptions = await Promise.all(richTextPromises);

  const showDetailsMap = new Map<number, Show>();
  response.items.forEach((item, index) => {
    showDetailsMap.set(item.fields.ticketleapEventId, {
      ...item.fields,
      showDescription: showDescriptions[index],
    });
  });
  return showDetailsMap;
}
