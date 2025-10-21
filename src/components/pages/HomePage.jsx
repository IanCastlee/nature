import React, { useEffect, Suspense, lazy } from "react";
import { images } from "../../constant/image";
import { dummyCottages, freebies } from "../../constant/mockData";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { useNavigate } from "react-router-dom";
import SubtTitle from "../molecules/SubtTitle";
import Title from "../molecules/Title";
import ReadMoreButton from "../atoms/ReadMoreButton";
import useGetData from "../../hooks/useGetData";

const About = lazy(() => import("../organisms/About"));
const ChatBot = lazy(() => import("../molecules/ChatBot"));
const Freebie = lazy(() => import("../molecules/Freebie"));
const RoomCategoryCard = lazy(() => import("../molecules/RoomCategoryCard"));
const CattageCard = lazy(() => import("../molecules/CattageCard"));
const FunctionHallCard = lazy(() => import("../molecules/FunctionHallCard"));

const imageKeys = ["hero1", "hero1_m", "hero2", "hero2_m", "hero3", "hero3_m"];

function HomePage() {
  const navigate = useNavigate();
  const [showChatBox, setShowChatBox] = React.useState(false);

  //==============//
  //  DATA FETCH  //
  //==============//

  // fetch fh data
  const {
    data: dataFh,
    loading: loadingFh,
    refetch: refetchFh,
    error: errorFh,
  } = useGetData(`/admin/functionhall.php?status=active`);

  // Fetch data
  const { data, loading, refetch, error } = useGetData(
    "/admin/room-category.php"
  );

  // fetch cottage data
  const {
    data: dataCottage,
    loading: loadingCottage,
    refetch: refetchCottage,
    error: errorCottage,
  } = useGetData(`/admin/cottage.php?status=active`);

  console.log("___", dataCottage);

  // Preload images
  useEffect(() => {
    imageKeys.forEach((key) => {
      const img = new Image();
      img.src = images[key];
    });
  }, []);

  return (
    <>
      <main className="w-full min-h-screen bg-white dark:bg-black scroll-smooth pb-20">
        <section className="relative h-screen w-full overflow-hidden">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            speed={1000}
            className="w-full h-full"
          >
            {imageKeys.map((key, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <LazyLoadImage
                    src={images[key]}
                    alt={`Slide ${idx + 1}`}
                    effect="blur"
                    wrapperClassName="absolute top-0 left-0 w-full h-full"
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Overlay & caption */}
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                  <figcaption className="absolute inset-0 flex flex-col justify-center items-start text-white pl-4 lg:pl-20 z-20">
                    <h1 className="text-5xl font-playfair max-w-2xl mb-6 px-2 lg:px-0">
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
                    <p className="max-w-2xl text-white text-sm md:text-base lg:text-lg px-2 lg:px-0">
                      Relax in our natural hot spring pools surrounded by lush
                      greenery. Enjoy a peaceful overnight stay in our cozy
                      rooms — perfect for families, couples, and solo travelers
                      seeking rest and rejuvenation.
                    </p>
                  </figcaption>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Freebies */}
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

        <section className="w-full dark:bg-black mt-10">
          <div className="flex flex-col justify-center items-center">
            <SubtTitle title="OUR ROOMS" />
            <Title
              title=" 
              CHOOSE THE TYPE THAT SUITS YOU"
            />
          </div>

          <div className="w-full flex flex-row flex-wrap px-2 md:px-2 lg:px-[130px] justify-center gap-2">
            {loading && (
              <div className="text-sm text-blue-600 mt-4">
                Loading room categories...
              </div>
            )}

            {error && (
              <div className="text-sm text-red-500 mt-4">
                {error.message || "Something went wrong."}
              </div>
            )}

            {!loading && data?.length === 0 && (
              <div className="text-sm text-gray-500 mt-4">
                No categories found.
              </div>
            )}

            {!loading &&
              data?.map((item) => (
                <Suspense
                  key={item.category_id}
                  fallback={
                    <div className="text-white text-sm">Loading card...</div>
                  }
                >
                  <RoomCategoryCard item={item} />
                </Suspense>
              ))}
          </div>
        </section>

        <section className="w-full flex flex-col dark:bg-black mt-24">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-2">
              <SubtTitle title="OUR FUNCTION HALLS" />
            </div>
            <Title title="SPACIOUS AND STYLISH FUNCTION HALLS FOR YOU" />
          </div>

          <div className="w-full flex flex-row flex-wrap  px-2  md:px-2 lg:px-[130px] justify-center gap-2">
            {loadingFh && (
              <div className="text-sm text-blue-600 mt-4">
                Loading function halls...
              </div>
            )}

            {errorFh && (
              <div className="text-sm text-red-500 mt-4">
                {errorFh.message || "Something went wrong."}
              </div>
            )}
            {dataFh &&
              dataFh.slice(0, 2).map((item, index) => (
                <Suspense
                  key={index}
                  fallback={
                    <div className="fixed bottom-4 right-10 text-white">
                      Loading...
                    </div>
                  }
                >
                  <FunctionHallCard item={item} key={index} index={index} />
                </Suspense>
              ))}
          </div>
          {dataFh?.length > 2 && (
            <div className="px-2 lg:px-[130px] mt-4">
              <ReadMoreButton
                label={
                  <>
                    View More{" "}
                    <icons.HiArrowSmallRight className="text-white inline" />
                  </>
                }
                onClick={() => navigate("/cottages")}
              />
            </div>
          )}
        </section>

        <section className="w-full flex flex-col dark:bg-black mt-28">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-2">
              <SubtTitle title="OUR CATTAGES" />
            </div>
            <Title title="FIND THE PERFECT COTTAGE FOR YOUR STAY" />
          </div>

          <div className="w-full flex flex-row flex-wrap md:flex-nowrap lg:flex-nowrap px-2  md:px-2 lg:px-[130px] justify-center gap-2">
            {loadingCottage && (
              <div className="text-sm text-blue-600 mt-4">
                Loading cottages...
              </div>
            )}

            {errorCottage && (
              <div className="text-sm text-red-500 mt-4">
                {errorCottage.message || "Something went wrong."}
              </div>
            )}

            {dataCottage?.slice(0, 3).map((item) => (
              <Suspense
                key={item.name}
                fallback={
                  <div className="fixed bottom-4 right-10 text-white">
                    Loading...
                  </div>
                }
              >
                <CattageCard item={item} />
              </Suspense>
            ))}
          </div>
          <div className="px-2 lg:px-[130px] mt-4">
            <ReadMoreButton
              label={
                <>
                  View More{" "}
                  <icons.HiArrowSmallRight className="text-white inline" />
                </>
              }
              onClick={() => navigate("/cottages")}
            />
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
        onClick={() => navigate("/test")}
        title="Street View"
        src={images.location}
        alt="Street View Icon"
        className="h-[60px] w-[60px] fixed bottom-4 right-28 z-30"
      />
    </>
  );
}

export default HomePage;
