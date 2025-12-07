import { useCallback, useEffect, useRef, useState } from "react";
import type { PreshowSlides } from "~/api/getPreshowSlides";

interface SlideProps {
  slide: PreshowSlides["slides"][number];
  onVideoEnded: () => void;
}

const Slide = ({ slide, onVideoEnded }: SlideProps) => {
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
}

export const Slideshow = ({ slides, secondsPerSlide }: SlideshowProps) => {
  const slideshowRef = useRef<HTMLDivElement | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const activeSlide = slides.at(activeSlideIndex);

  useEffect(() => {
    if (!activeSlide && slides.length > 0) {
      setActiveSlideIndex(0);
    }
  }, [activeSlide, slides]);

  const handleNextSlide = useCallback(() => {
    setActiveSlideIndex((prevIdx) =>
      prevIdx === slides.length - 1 ? 0 : prevIdx + 1,
    );
  }, [slides]);

  useEffect(() => {
    if (activeSlide && activeSlide.contentType.startsWith("image")) {
      const t = setTimeout(handleNextSlide, secondsPerSlide * 1000);

      return () => {
        clearTimeout(t);
      };
    }
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
