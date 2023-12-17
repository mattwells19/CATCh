import { getCollectionEntries } from "./utils";
import type { WYSIWYGString } from "./api.types";

interface RawFAQ {
  name: string;
  slug: string;
  tags: Array<string>;
  metaDesc: string;
  description: string;
  faq: Array<{
    value: {
      faq_question: string;
      faq_answer: WYSIWYGString;
    };
  }>;
  _id: string;
}

export interface FAQ {
  name: string;
  slug: string;
  tags: Array<string>;
  metaDesc: string;
  description: string;
  faqs: Array<{
    question: string;
    answer: WYSIWYGString;
  }>;
  _id: string;
}

export async function getFaqs(): Promise<Array<FAQ>> {
  const faqEntries = await getCollectionEntries<RawFAQ>("faqs");

  return faqEntries.map((faqEntry) => ({
    ...faqEntry,
    faqs: faqEntry.faq.map(({ value }) => ({
      question: value.faq_question,
      answer: value.faq_answer,
    })),
  }));
}

export async function getFaq(faqSlug: string): Promise<FAQ | null> {
  const faqEntries = await getFaqs();

  return faqEntries.find((faqEntry) => faqEntry.slug === faqSlug) ?? null;
}
