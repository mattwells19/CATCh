import type { EntryFieldTypes } from "contentful";
import { contentfulClient } from "~/lib/contentful";

interface PreshowSlidesSkeleton {
  contentTypeId: "preshowSlides";
  fields: {
    title: EntryFieldTypes.Text;
    secondsPerSlide: EntryFieldTypes.Number;
    slides: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  };
}

export interface PreshowSlides {
  title: string;
  secondsPerSlide: number;
  slides: Array<{ src: string; contentType: string }>;
}

export const getPreshowSlideDecks = async (): Promise<Array<PreshowSlides>> => {
  const response = await contentfulClient.getEntries<PreshowSlidesSkeleton>({
    content_type: "preshowSlides",
  });

  return response.items.map((item) => ({
    title: item.fields.title,
    secondsPerSlide: item.fields.secondsPerSlide,
    slides: item.fields.slides.map((slide) => ({
      src: `https:${slide.fields.file.url}`,
      contentType: slide.fields.file.contentType,
    })),
  }));
};
