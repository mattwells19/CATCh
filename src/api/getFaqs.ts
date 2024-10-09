import type { EntryFieldTypes } from "contentful";
import { contentfulClient, type RichTextDocument } from "~/lib/contentful";

interface FAQSkeleton {
  contentTypeId: "faqPage";
  fields: {
    question: EntryFieldTypes.Text;
    answer: EntryFieldTypes.RichText;
    category: EntryFieldTypes.Array<EntryFieldTypes.Symbol<string>>;
  };
}

export interface FAQ {
  question: string;
  answer: RichTextDocument;
  categories: Array<string>;
}

export async function getFaqs(): Promise<Array<FAQ>> {
  const response = await contentfulClient.getEntries<FAQSkeleton>({
    content_type: "faqPage",
  });

  return response.items.map((item) => {
    return {
      ...item.fields,
      categories: item.fields.category,
      answer: item.fields.answer,
    };
  });
}
