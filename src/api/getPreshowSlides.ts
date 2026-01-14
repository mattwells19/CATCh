import type { EntryFieldTypes } from "contentful";
import z from "zod";
import { contentfulClient } from "~/lib/contentful";

interface PreshowSlidesSkeleton {
  contentTypeId: "preshowSlides";
  fields: {
    title: EntryFieldTypes.Text;
    secondsPerSlide: EntryFieldTypes.Number;
    // we resolve this 'any' with the zod schema check below
    slides: EntryFieldTypes.Array<any>;
  };
}

export interface PreshowSlides {
  title: string;
  secondsPerSlide: number;
  slides: Array<{ src: string; contentType: string }>;
}

const PreShowSlidesSlideSchema = z.object({
  fields: z.object({
    file: z.object({
      url: z.string(),
      contentType: z.string(),
    }),
  }),
});

type PreShowSlidesSlide = z.infer<typeof PreShowSlidesSlideSchema>;

export const getPreshowSlideDecks = async (): Promise<Array<PreshowSlides>> => {
  const response = await contentfulClient.getEntries<PreshowSlidesSkeleton>({
    content_type: "preshowSlides",
  });

  return response.items.map((item) => ({
    title: item.fields.title,
    secondsPerSlide: item.fields.secondsPerSlide,
    slides: item.fields.slides
      .filter(
        (slide): slide is PreShowSlidesSlide =>
          PreShowSlidesSlideSchema.safeParse(slide).success,
      )
      .map((slide) => ({
        src: `https:${slide.fields.file.url}`,
        contentType: slide.fields.file.contentType,
      })),
  }));
};
