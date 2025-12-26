import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import imageTest from "../../assets/images/hero1.webp";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const activities = [
  {
    id: 1,
    title: "Water Biking",
    image: imageTest,
    short: "Enjoy biking on water around the lagoon.",
    full: "Water biking lets you explore the lagoon while enjoying a relaxing and fun ride on the water.",
  },
  {
    id: 2,
    title: "Biking Around the Lagoon",
    image: imageTest,
    short: "Relaxing bike ride with a scenic view.",
    full: "Bike around the lagoon and enjoy the peaceful environment surrounded by nature.",
  },
  {
    id: 3,
    title: "Fish Feeding at the Lagoon",
    image: imageTest,
    short: "Feed the fishes and enjoy nature.",
    full: "A calm and enjoyable activity where guests can feed the fishes in the lagoon.",
  },
  {
    id: 4,
    title: "Fish Feeding at the Lagoon",
    image: imageTest,
    short: "Feed the fishes and enjoy nature.",
    full: "A calm and enjoyable activity where guests can feed the fishes in the lagoon.",
  },
];

function Activities() {
  const sliderRef = useRef(null);
  const [active, setActive] = useState(null);

  /* ---------- AUTO SCROLL (MOBILE: 1 IMAGE AT A TIME) ---------- */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let index = 0;

    const interval = setInterval(() => {
      const width = slider.offsetWidth;
      index = (index + 1) % activities.length;

      slider.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 relative lg:px-20 px-0">
      {/* TITLE */}
      <h2 className="text-xl font-bold mb-4 px-4 lg:px-12 text-gray-900 dark:text-white">
        Lagoon Activities
      </h2>

      {/* SLIDER */}
      <div className="relative">
        {/* LEFT ARROW */}
        <button
          onClick={scrollLeft}
          className="
            absolute lg:left-14 left-4 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full
            bg-white/90 text-black
            shadow-md
            flex items-center justify-center
            hover:scale-110 transition
          "
        >
          <FaChevronLeft />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={scrollRight}
          className="
            absolute lg:right-14  right-4 top-1/2 -translate-y-1/2 z-10
            w-10 h-10 rounded-full
            bg-white/90 text-black
            shadow-md
            flex items-center justify-center
            hover:scale-110 transition
          "
        >
          <FaChevronRight />
        </button>

        {/* TRACK */}
        <div
          ref={sliderRef}
          className="
            flex
            overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory
            scroll-smooth
            no-scrollbar
            px-4 lg:px-12
            gap-4
          "
        >
          {activities.map((item) => (
            <div
              key={item.id}
              onClick={() => setActive(item)}
              className="
                min-w-full sm:min-w-[300px]
                snap-center
                cursor-pointer
              "
            >
              {/* IMAGE CARD */}
              <div className="relative rounded-2xl overflow-hidden">
                <LazyLoadImage
                  src={item.image}
                  effect="blur"
                  className="w-full h-64 sm:h-48 object-cover"
                />

                {/* BADGE LEFT */}
                <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Activity
                </span>

                {/* BADGE RIGHT */}
                <span className="absolute top-3 right-3 bg-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>

              {/* TEXT (DESKTOP ONLY) */}
              <div className="mt-3 hidden sm:block">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {item.short}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {active && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-4 relative">
            <button
              onClick={() => setActive(null)}
              className="absolute top-2 right-3 text-xl text-gray-600 dark:text-gray-300"
            >
              ✕
            </button>

            <LazyLoadImage
              src={active.image}
              effect="blur"
              className="w-full h-52 object-cover rounded-lg"
            />

            <h3 className="text-lg font-bold mt-3 text-gray-900 dark:text-white">
              {active.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {active.full}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Activities;
