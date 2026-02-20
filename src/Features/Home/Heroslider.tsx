import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import schoolOfArts from "../../assets/school-of-arts.png";
import schoolOfBusiness from "../../assets/school-of-business.png";
import schoolOfTechnology from "../../assets/school-of-technology.png";

const slides = [
  {
    id: 1,
    image: schoolOfBusiness,
    alt: "School of Business - KCAU Virtual Campus",
  },
  {
    id: 2,
    image: schoolOfTechnology,
    alt: "School of Technology - KCAU Virtual Campus",
  },
  {
    id: 3,
    image: schoolOfArts,
    alt: "School of Arts - KCAU Virtual Campus",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [nextSlide, setNextSlide] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "left") => {
      if (sliding || index === current) return;
      setDirection(dir);
      setNextSlide(index);
      setSliding(true);

      timeoutRef.current = setTimeout(() => {
        setCurrent(index);
        setNextSlide(null);
        setSliding(false);
      }, 500);
    },
    [sliding, current]
  );

  const goPrev = () => {
    const index = (current - 1 + slides.length) % slides.length;
    goTo(index, "right");
  };

  const goNext = useCallback(() => {
    const index = (current + 1) % slides.length;
    goTo(index, "left");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => {
      clearInterval(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [goNext]);

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }
        .hero-slider {
          height: calc(100vh - 88px); /* subtract TopBar ~32px + Navbar ~56px */
        }
      `}</style>

      <div className="hero-slider relative w-full overflow-hidden bg-[#0d1b3e]">

        {/* Current Slide — exits */}
        <div
          className="absolute inset-0"
          style={{
            animation: sliding
              ? `${direction === "left" ? "slideOutToLeft" : "slideOutToRight"} 500ms ease-in-out forwards`
              : undefined,
          }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].alt}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Incoming Slide — enters */}
        {sliding && nextSlide !== null && (
          <div
            className="absolute inset-0"
            style={{
              animation: `${direction === "left" ? "slideInFromRight" : "slideInFromLeft"} 500ms ease-in-out forwards`,
            }}
          >
            <img
              src={slides[nextSlide].image}
              alt={slides[nextSlide].alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Prev Button */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#c9a227] hover:bg-[#e0b730] flex items-center justify-center text-[#1a2a5e] transition-all duration-200 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "left" : "right")}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-[#c9a227]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSlider;