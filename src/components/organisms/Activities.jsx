import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import useGetData from "../../hooks/useGetData"; // your hook

import SubtTitle from "../molecules/SubtTitle";
import Title from "../molecules/Title";
import { uploadUrl } from "../../utils/fileURL";

export default function Activities() {
  const [active, setActive] = useState(0);

  // Fetch activities from backend
  const {
    data: activities,
    loading,
    error,
  } = useGetData("/admin/activities.php");

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!activities || activities.length === 0) return;
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % activities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activities]);

  const getItem = (offset) => {
    if (!activities || activities.length === 0) return null;
    return activities[
      (active + offset + activities.length) % activities.length
    ];
  };

  return (
    <section className="relative w-full py-20 bg-white dark:bg-black overflow-hidden">
      {/* Title */}
      <div className="flex flex-col justify-center items-center">
        <SubtTitle title="OUR ACTIVITIES" />
        <Title title="ENJOY RELAXING AND FUN EXPERIENCES" />
      </div>

      {/* Error / Loading */}
      {loading && (
        <p className="text-center mt-4 text-gray-500">Loading activities...</p>
      )}
      {error && (
        <p className="text-center mt-4 text-red-500">{error.message}</p>
      )}
      {!loading && activities && activities.length === 0 && (
        <p className="text-center mt-4 text-gray-500">
          No activities available.
        </p>
      )}

      {/* Carousel */}
      {!loading && activities && activities.length > 0 && (
        <div className="relative">
          {/* DESKTOP */}
          <div className="hidden sm:block relative h-[320px] lg:px-[200px]">
            {[-2, -1, 0, 1, 2].map((lvl) => {
              const item = getItem(lvl);
              return item ? (
                <CarouselCard key={lvl} activity={item} level={lvl} />
              ) : null;
            })}
          </div>

          {/* MOBILE */}
          <div className="sm:hidden w-full px-4">
            {getItem(0) && (
              <CarouselCard activity={getItem(0)} level={0} isMobile />
            )}
          </div>

          {/* NAVIGATION BUTTONS */}
          <button
            onClick={() =>
              setActive((p) => (p === 0 ? activities.length - 1 : p - 1))
            }
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2
                       bg-white/80 dark:bg-black/70 p-2 rounded-full z-50 border dark:border-gray-700 border-gray-400"
          >
            <IoChevronBack className="text-black dark:text-white" />
          </button>

          <button
            onClick={() => setActive((p) => (p + 1) % activities.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2
                       bg-white/80 dark:bg-black/70 p-2 rounded-full z-50 border dark:border-gray-700 border-gray-400"
          >
            <IoChevronForward className="text-black dark:text-white" />
          </button>

          {/* DOT INDICATORS */}
          <div className="absolute lg:bottom-4 bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {activities.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setActive(idx)}
                className={` h-2 w-2 rounded-full cursor-pointer transition-all duration-300
                         ${
                           idx === active
                             ? "bg-blue-500 dark:bg-blue-400 scale-125"
                             : "bg-gray-300 dark:bg-gray-600 scale-100"
                         }`}
              ></span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* =====================================================
   CARD
===================================================== */
function CarouselCard({ activity, level, isMobile = false }) {
  const imageUrl = activity.image
    ? `${uploadUrl.uploadurl}/activities/${activity.image}`
    : "/placeholder.png"; // fallback if image missing

  /* MOBILE */
  if (isMobile) {
    return (
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
        <ImageFill src={imageUrl} />
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
    0: "left-1/2 -translate-x-1/2 scale-110 opacity-100 z-30 shadow-2xl",
    1: "right-[160px] lg:right-[300px] scale-90 opacity-40 z-20",
    2: "right-[40px] lg:right-[140px] scale-75 opacity-30 z-10",
  };

  return (
    <div className={`${base} ${positions[level]}`}>
      <ImageFill src={imageUrl} />
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
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 flex flex-col justify-end">
      <h3 className="text-white text-lg font-semibold">{activity.title}</h3>
      {showDesc && (
        <p className="text-gray-200 text-sm mt-1">
          {activity.subtitle || activity.short}
        </p>
      )}
    </div>
  );
}
