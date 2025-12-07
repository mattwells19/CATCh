import {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

import type { ClassListing } from "~/api/getClassListings";
import type { PreshowSlides } from "~/api/getPreshowSlides";
import type { ShowListing } from "~/api/getShowListings";
import { CalendarIcon } from "~/icons/CalendarIcon";
import { formatClassDateRange } from "~/utils/formatClassTime";
import { formatShowTime } from "~/utils/formatShowTime";

interface UpcomingShowSlidesProps {
  showListings: Array<ShowListing>;
}

export const UpcomingShowSlides = ({
  showListings,
}: UpcomingShowSlidesProps) => {
  return (
    <div className="bg-peach p-5">
      <p className="text-3xl font-serif font-bold text-primary-purple mb-5">
        Check out our upcoming shows!
      </p>
      <ul className="grid grid-cols-4 grid-rows-1 gap-5">
        {showListings.map((showListing) => (
          <li key={showListing.id}>
            <div className="rounded overflow-hidden shadow-lg p-2 bg-peach flex flex-col gap-4 flex-1">
              <img
                src={showListing.image}
                alt={showListing.name}
                width={724}
                height={407}
                className="w-full"
              />

              <div className="flex flex-col gap-4 px-2 text-lg">
                <div className="flex items-center gap-2 border-b-2 border-light-purple text-primary-purple w-fit mr-auto py-4">
                  <CalendarIcon name="calendar" className="size-5" />

                  <p className="font-serif font-semibold">
                    {formatShowTime(showListing.date)}
                  </p>
                </div>

                {showListing.showDescription ? (
                  <div
                    className="wysiwyg overflow-auto"
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(showListing.showDescription),
                    }}
                  />
                ) : null}
              </div>

              <p className="font-bold px-2">{showListing.price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface UpcomingClassSlidesProps {
  classListings: Array<ClassListing>;
}

export const UpcomingClassSlides = ({
  classListings,
}: UpcomingClassSlidesProps) => {
  return (
    <div className="bg-peach p-5">
      <p className="text-3xl font-serif font-bold text-primary-purple mb-5">
        Check out our upcoming classes!
      </p>
      <ul className="grid grid-cols-4 grid-rows-1 gap-5">
        {classListings.map((classListing) => (
          <li key={classListing.id}>
            <div className="rounded overflow-hidden shadow-lg p-2 bg-peach flex flex-col gap-4 flex-1">
              <img
                src={classListing.image}
                alt={classListing.name}
                width={724}
                height={407}
                className="w-full"
              />

              <div className="flex flex-col gap-4 px-2 text-lg">
                <div className="flex items-center gap-2 border-b-2 border-light-purple text-primary-purple w-fit mr-auto py-4">
                  <CalendarIcon name="calendar" className="size-5" />

                  <p className="font-serif font-semibold">
                    {formatClassDateRange(classListing)}
                  </p>
                </div>

                {classListing.classHeader ? (
                  <p className="font-serif font-bold text-xl mb-2">
                    {classListing.classHeader}
                  </p>
                ) : null}

                {classListing.classDescription ? (
                  <div
                    className="wysiwyg overflow-auto"
                    dangerouslySetInnerHTML={{
                      __html: documentToHtmlString(
                        classListing.classDescription,
                      ),
                    }}
                  />
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface SlideProps {
  slide: PreshowSlides["slides"][number] | NonNullable<ReactNode>;
  onVideoEnded: () => void;
}

const Slide = ({ slide, onVideoEnded }: SlideProps) => {
  if (typeof slide !== "object" || "contentType" in slide === false) {
    return slide;
  }

  if (slide.contentType.startsWith("image")) {
    return (
      <img
        src={slide.src}
        width="1240"
        height="700"
        alt="Slide"
        className="w-full h-auto"
      />
    );
  }
  if (slide.contentType.startsWith("video")) {
    return (
      <video
        src={slide.src}
        autoPlay
        muted
        width="1240"
        height="700"
        className="w-full h-auto"
        onEnded={onVideoEnded}
      />
    );
  }
};

interface SlideshowProps {
  slides: PreshowSlides["slides"];
  secondsPerSlide: PreshowSlides["secondsPerSlide"];
  upcomingShows: Array<ShowListing>;
  upcomingClasses: Array<ClassListing>;
}

export const Slideshow = ({
  slides,
  secondsPerSlide,
  upcomingClasses,
  upcomingShows,
}: SlideshowProps) => {
  const slideshowRef = useRef<HTMLDivElement | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const allSlides = useMemo(
    () => [
      ...slides,
      <UpcomingClassSlides classListings={upcomingClasses} />,
      <UpcomingShowSlides showListings={upcomingShows} />,
    ],
    [slides, upcomingClasses],
  );
  const activeSlide = allSlides.at(activeSlideIndex);

  useEffect(() => {
    if (!activeSlide && allSlides.length > 0) {
      setActiveSlideIndex(0);
    }
  }, [activeSlide, allSlides]);

  const handleNextSlide = useCallback(() => {
    setActiveSlideIndex((prevIdx) =>
      prevIdx === allSlides.length - 1 ? 0 : prevIdx + 1,
    );
  }, [allSlides]);

  useEffect(() => {
    if (!activeSlide) {
      return;
    }

    // when showing a video
    if (
      typeof activeSlide === "object" &&
      "contentType" in activeSlide &&
      activeSlide.contentType.startsWith("video")
    ) {
      return;
    }

    // when showing live show/class events
    if (isValidElement(activeSlide)) {
      const t = setTimeout(handleNextSlide, secondsPerSlide * 2 * 1000);

      return () => {
        clearTimeout(t);
      };
    }

    // when showing an image
    const t = setTimeout(handleNextSlide, secondsPerSlide * 1000);

    return () => {
      clearTimeout(t);
    };
  }, [activeSlide, handleNextSlide, secondsPerSlide]);

  if (!activeSlide) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => slideshowRef.current?.requestFullscreen()}
        className="px-3 py-1 bg-coral hover:bg-[#B7433C] transition-colors text-peach font-serif rounded mb-2"
      >
        Go Full screen
      </button>
      <div ref={slideshowRef} className="grid place-items-center">
        <Slide slide={activeSlide} onVideoEnded={handleNextSlide} />
      </div>
    </>
  );
};
