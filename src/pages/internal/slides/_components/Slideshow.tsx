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
import UtSGraduationImage from "~/images/UtSGraduatingClass.png";
import UtSQRCode from "~/images/UtSQRCode.png";

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

    const listings = acc.get(showDay.getTime()) ?? [];
    acc.set(showDay.getTime(), [...listings, showListing]);
    return acc;
  }, new Map<number, Array<ShowListing>>());

  return (
    <div className="bg-peach px-[4vw] py-[4vh] w-full aspect-video overflow-hidden">
      <p className="text-primary-purple font-black text-7xl font-serif">
        Check out our upcoming shows!
      </p>
      <ul className="flex gap-[4vw] mt-[5vh]">
        {Array.from(showGroupings)
          .sort()
          .map(([day, showListings]) => (
            <li key={day} className="flex-1">
              <p className="text-4xl text-primary-purple font-serif font-bold border-b-2 pb-4 border-light-purple">
                {formatEst(day, "EEEE',' LLL do")}
              </p>
              <ul className="flex flex-wrap gap-4 py-4 px-2">
                {showListings.map((showListing) => (
                  <li
                    key={showListing.id}
                    className="flex items-center justify-between gap-4 mt-[2vh]"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={showListing.image}
                        alt={showListing.name}
                        width={280}
                        height={158}
                        className="w-2/5"
                      />

                      <div className="text-primary-purple text-2xl font-serif">
                        <span className="font-bold">{showListing.name}</span>
                        <span>
                          &nbsp;&ndash;&nbsp;
                          {formatEst(showListing.date, "h:mm a")}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>

      <div className="flex flex-col gap-2 text-lg font-serif font-bold text-center w-fit mt-[4vh]">
        <p className="bg-coral  text-peach shadow-sm py-4 rounded-md  w-[14vw]">
          Get tickets today!
        </p>
        <p>catch.theater/shows</p>
      </div>
    </div>
  );
};

interface UpcomingClassSlidesProps {
  classListings: Array<ClassListing>;
}

const UpcomingClassSlides = ({ classListings }: UpcomingClassSlidesProps) => {
  const sortedClassListings = classListings.sort(
    (aClass, bClass) => aClass.date.getTime() - bClass.date.getTime(),
  );

  return (
    <div className="bg-peach pl-[4vw] pt-[4vh] w-full aspect-video overflow-hidden">
      <h1 className="text-primary-purple font-black text-7xl font-serif">
        Unlocking the Self: Improv Skills for life
      </h1>
      <p className="text-4xl mt-[2vh]">
        Grow your personal skills and meet people through improv
      </p>
      <div className="grid grid-cols-3 mt-[8vh] gap-[4vw]">
        <div className="col-span-1">
          <div className="border-y-2 border-light-purple flex-1 py-[3vh]">
            <h2 className="font-serif font-black text-3xl text-primary-purple mb-[3vh]">
              Upcoming beginner classes:
            </h2>
            <ul>
              {sortedClassListings.map((classListing) => (
                <li
                  key={classListing.id}
                  className="font-serif text-primary-purple text-3xl flex items-center gap-2 mt-[2vh]"
                >
                  <CalendarIcon />
                  {formatClassDateRange(classListing)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 mt-[2vh] justify-center items-center">
            <img
              alt="QR code to https://catch.theater/classes"
              src={UtSQRCode.src}
              className="w-2/5"
            />
            <div className="flex flex-col gap-2 text-lg font-serif font-bold text-center">
              <p className="bg-coral  text-peach shadow-sm py-4 rounded-md  w-[14vw]">
                Register today!
              </p>
              <p>catch.theater/classes</p>
            </div>
          </div>
        </div>
        <div id="uts-graduation-img" className="col-span-2 relative">
          <img
            alt="An Unlocking the Self class takes a silly photo after they graduated!"
            src={UtSGraduationImage.src}
            height={UtSGraduationImage.height}
            width={UtSGraduationImage.width}
            className="w-full"
          />
        </div>
      </div>
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
