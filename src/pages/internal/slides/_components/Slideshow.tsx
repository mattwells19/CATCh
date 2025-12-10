import {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ClassListing } from "~/api/getClassListings";
import type { PreshowSlides } from "~/api/getPreshowSlides";
import type { ShowListing } from "~/api/getShowListings";
import { CalendarIcon } from "~/icons/CalendarIcon";
import { formatClassDateRange } from "~/utils/formatClassTime";
import { formatEst } from "~/utils/formatEst";

interface UpcomingShowSlidesProps {
  showListings: Array<ShowListing>;
}

const UpcomingShowSlides = ({ showListings }: UpcomingShowSlidesProps) => {
  const showGroupings = showListings.reduce((acc, showListing) => {
    const showDay = new Date(
      showListing.date.getFullYear(),
      showListing.date.getMonth(),
      showListing.date.getDate(),
    );

    const listings = acc.get(showDay) ?? [];
    acc.set(showDay, [...listings, showListing]);
    return acc;
  }, new Map<Date, Array<ShowListing>>());

  return (
    <div className="bg-peach p-5 w-full aspect-video flex flex-col justify-between">
      <p className="text-4xl font-serif font-bold text-primary-purple mb-8">
        Check out our upcoming shows!
      </p>
      <ul className="flex flex-col gap-12">
        {Array.from(showGroupings)
          .sort(([aDay], [bDay]) => aDay.getTime() - bDay.getTime())
          .map(([day, showListings]) => (
            <li key={day.toISOString()}>
              <p className="text-2xl text-primary-purple font-serif font-bold border-b border-primary-purple">
                {formatEst(day, "EEEE',' LLL do")}
              </p>
              <ul className="flex flex-wrap gap-4 py-4 px-2">
                {showListings.map((showListing) => (
                  <li
                    key={showListing.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={showListing.image}
                        alt={showListing.name}
                        width={280}
                        height={158}
                        className="w-[240px] flex-shrink-0"
                      />

                      <div className="flex flex-col gap-2 text-primary-purple">
                        <p className="text-xl font-serif font-bold border-b-2 border-light-purple">
                          {showListing.name}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-lg font-serif font-semibold">
                            {formatEst(showListing.date, "h:mm a")}
                          </p>
                          <p className="font-serif font-bold text-primary-purple px-2">
                            {showListing.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>

      <p className="text-xl font-serif text-primary-purple mt-8">
        Get tickets at{" "}
        <span className="font-bold">https://catch.theater/shows</span>
      </p>
    </div>
  );
};

interface UpcomingClassSlidesProps {
  classListings: Array<ClassListing>;
}

const UpcomingClassSlides = ({ classListings }: UpcomingClassSlidesProps) => {
  const classGroupings = classListings
    .sort((aClass, bClass) => aClass.date.getTime() - bClass.date.getTime())
    .reduce((acc, classListing) => {
      const listings = acc.get(classListing.eventId) ?? [];
      acc.set(classListing.eventId, [...listings, classListing]);
      return acc;
    }, new Map<number, Array<ClassListing>>());

  return (
    <div className="bg-peach p-5 w-full aspect-video flex flex-col justify-between">
      <p className="text-4xl font-serif font-bold text-primary-purple mb-8">
        Check out our upcoming classes!
      </p>
      <ul className="grid grid-cols-2 gap-5">
        {Array.from(classGroupings)
          .slice(0, 4)
          .map(([classEventId, classListings]) => {
            const classDetails = classListings[0];

            return (
              <li
                key={classEventId}
                className="rounded overflow-hidden border border-primary-purple p-4 bg-peach flex flex-col justify-evenly gap-4"
              >
                <p className="text-xl text-primary-purple font-serif font-bold">
                  {classDetails.name}
                </p>

                <img
                  src={classDetails.image}
                  alt={classDetails.name}
                  width={724}
                  height={407}
                  className="w-full"
                />

                <ul>
                  {classListings.map((classListing) => (
                    <li
                      key={classListing.id}
                      className="flex items-center gap-3 p-2"
                    >
                      <CalendarIcon name="calendar" className="size-5" />

                      <p className="font-serif font-semibold">
                        {formatClassDateRange(classListing)}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
      </ul>
      <p className="text-xl font-serif text-primary-purple mt-8">
        Learn more at{" "}
        <span className="font-bold">https://catch.theater/classes</span>
      </p>
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
    [slides, upcomingClasses, upcomingShows],
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
