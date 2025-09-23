import React, { useState, useEffect, Suspense, lazy } from "react";
import { images } from "../../constant/image";
import { dummyRooms, freebies } from "../../constant/mockData";

// Lazy load components
const About = lazy(() => import("../organisms/About"));
const ChatBot = lazy(() => import("../molecules/ChatBot"));
const Freebie = lazy(() => import("../molecules/Freebie"));
const RoomCategoryCard = lazy(() => import("../molecules/RoomCategoryCard"));

const imageKeys = ["hero1", "hero2", "hero3"];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionImage, setTransitionImage] = useState(imageKeys[1]);
  const [fade, setFade] = useState(true);
  const [showChatBox, setShowChatBox] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % imageKeys.length;

      const img = new Image();
      img.src = images[imageKeys[nextIndex]];

      img.onload = () => {
        setTransitionImage(imageKeys[nextIndex]);
        setFade(false);

        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setFade(true);
        }, 1000);
      };
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
      <main className="w-full min-h-screen bg-white dark:bg-black scroll-smooth">
        <section className="relative h-screen w-full overflow-hidden">
          <img
            src={images[imageKeys[currentIndex]]}
            alt={`Slide ${currentIndex + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              fade ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          />

          <img
            src={images[transitionImage]}
            alt="Transitioning Slide"
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              fade ? "opacity-0 z-10" : "opacity-100 z-20"
            }`}
          />

          <figcaption className="absolute inset-0 flex flex-col justify-center items-start bg-black/60 text-white pl-4 lg:pl-20 z-30">
            <h1 className="text-5xl font-playfair max-w-2xl mb-6">
              Experience the Serenity of{" "}
              <span className="text-blue-400 relative inline-block">
                Nature Hot Spring{" "}
                <img
                  src={images.line}
                  alt=""
                  aria-hidden="true"
                  className="absolute -bottom-[7px] right-0 w-[250px] hidden md:block"
                />
              </span>
              Retreat
            </h1>
            <p className="max-w-2xl text-white">
              Relax in our natural hot spring pools surrounded by lush greenery.
              Enjoy a peaceful overnight stay in our cozy rooms — perfect for
              families, couples, and solo travelers seeking rest and
              rejuvenation.
            </p>
          </figcaption>

          <Suspense
            fallback={
              <div className="text-center py-10 text-gray-400">Loading...</div>
            }
          >
            <div className="absolute left-4 lg:left-16 bottom-4 flex gap-4 z-30">
              {freebies.length > 0 ? (
                freebies.map((item) => <Freebie item={item} key={item.name} />)
              ) : (
                <p className="text-white">No Data</p>
              )}
            </div>
          </Suspense>
        </section>
        <Suspense
          fallback={
            <div className="text-center py-10 text-gray-400">
              Loading About...
            </div>
          }
        >
          <About />
        </Suspense>
        <section className="w-full dark:bg-black">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="h-[1px] w-[50px] bg-blue-400"></div>
              <span className="text-blue-400 font-medium text-sm md:text-sm lg:text-lg">
                OUR ROOMS
              </span>
              <div className="h-[1px] w-[50px] bg-blue-400"></div>
            </div>
            <h3 className="mb-6 dark:text-white text-lg md:text-2xl lg:text-3xl font-medium">
              CHOOSE THE TYPE THAT SUITS YOU
            </h3>
          </div>

          <div className="w-full flex flex-row flex-wrap px-2 md:px-2 lg:px-[100px] justify-center gap-2">
            {dummyRooms.map((item) => {
              return (
                <Suspense
                  fallback={
                    <div className="fixed bottom-4 right-10 text-white">
                      Loading...
                    </div>
                  }
                >
                  <RoomCategoryCard item={item} key={item.name} />
                </Suspense>
              );
            })}
          </div>
        </section>
      </main>

      <img
        onClick={() => setShowChatBox(true)}
        src={images.messageIcons}
        alt="Chat Icon"
        className="fixed bottom-4 right-10 z-30 cursor-pointer h-12 w-12"
      />

      {showChatBox && (
        <Suspense
          fallback={
            <div className="fixed bottom-4 right-10 text-white">
              Loading Chat...
            </div>
          }
        >
          <ChatBot close={() => setShowChatBox(false)} />
        </Suspense>
      )}
      <img
        title="Street View"
        src={images.location}
        alt="Street View Icon"
        className="h-[80px] w-[80px] fixed bottom-4 right-28 z-30"
      />
    </>
  );
}

export default Home;
