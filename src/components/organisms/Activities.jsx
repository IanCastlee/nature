import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import image1 from "../../assets/images/hero1.webp";
import image2 from "../../assets/images/hero4.jpg";
import image3 from "../../assets/images/hero2.png";
import image4 from "../../assets/images/hero3.png";
import SubtTitle from "../molecules/SubtTitle";
import Title from "../molecules/Title";

/* 🔹 DATA */
const activities = [
  {
    title: "Water Biking",
    short: "Enjoy riding over the water and feel the breeze.",
    image: image1,
  },
  {
    title: "Fish Feeding",
    short: "Feed the fishes and enjoy nature view.",
    image: image1,
  },
  {
    title: "Lagoon Walk",
    short: "Relaxing walk around the peaceful lagoon.",
    image: image2,
  },
  {
    title: "Night View",
    short: "Experience calm lights under the night sky.",
    image: image3,
  },
  {
    title: "Family Picnic",
    short: "Perfect place for bonding and relaxation.",
    image: image4,
  },
];

export default function Activities() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % activities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getItem = (offset) =>
    activities[(active + offset + activities.length) % activities.length];

  return (
    <section className="relative w-full py-20 bg-white dark:bg-black overflow-hidden">
      <div className="flex flex-col justify-center items-center">
        <SubtTitle title="OUR ACTIVITIES" />
        <Title title="ENJOY RELAXING AND FUN EXPERIENCES" />
      </div>

      {/* ===== CAROUSEL WRAPPER ===== */}
      <div className="relative">
        {/* DESKTOP */}
        <div className="hidden sm:block relative h-[320px] lg:px-[200px]">
          {[-2, -1, 0, 1, 2].map((lvl) => (
            <CarouselCard key={lvl} activity={getItem(lvl)} level={lvl} />
          ))}
        </div>

        {/* MOBILE (with side padding ✅) */}
        <div className="sm:hidden w-full px-4">
          <CarouselCard activity={getItem(0)} level={0} isMobile />
        </div>

        {/* CONTROLS (2 ONLY ✅, centered on carousel) */}
        <button
          onClick={() =>
            setActive((p) => (p === 0 ? activities.length - 1 : p - 1))
          }
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2
                     bg-white/80 dark:bg-black/70 p-2 rounded-full z-[1000]"
        >
          <IoChevronBack className="text-black dark:text-white" />
        </button>

        <button
          onClick={() => setActive((p) => (p + 1) % activities.length)}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2
                     bg-white/80 dark:bg-black/70 p-2 rounded-full z-[1000]"
        >
          <IoChevronForward className="text-black dark:text-white" />
        </button>
      </div>
    </section>
  );
}

/* =====================================================
   CARD
===================================================== */

function CarouselCard({ activity, level, isMobile = false }) {
  /* MOBILE */
  if (isMobile) {
    return (
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
        <ImageFill src={activity.image} />
        <Overlay activity={activity} showDesc />
      </div>
    );
  }

  /* DESKTOP */
  const base =
    "absolute top-1/2 -translate-y-1/2 rounded-2xl overflow-hidden " +
    "aspect-[16/9] w-[360px] lg:w-[420px] " +
    "transition-all duration-700 ease-in-out";

  const positions = {
    "-2": "left-[40px] lg:left-[140px] scale-75 opacity-30 z-10",
    "-1": "left-[160px] lg:left-[300px] scale-90 opacity-40 z-20",
    0: "left-1/2 -translate-x-1/2 scale-110 opacity-100 z-[999] shadow-2xl",
    1: "right-[160px] lg:right-[300px] scale-90 opacity-40 z-20",
    2: "right-[40px] lg:right-[140px] scale-75 opacity-30 z-10",
  };

  return (
    <div className={`${base} ${positions[level]}`}>
      <ImageFill src={activity.image} />
      {level === 0 && <Overlay activity={activity} showDesc />}
    </div>
  );
}

/* =====================================================
   IMAGE FILL
===================================================== */

function ImageFill({ src }) {
  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

/* =====================================================
   OVERLAY
===================================================== */

function Overlay({ activity, showDesc }) {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                    p-5 flex flex-col justify-end"
    >
      <h3 className="text-white text-lg font-semibold">{activity.title}</h3>

      {showDesc && (
        <p className="text-gray-200 text-sm mt-1">{activity.short}</p>
      )}
    </div>
  );
}
