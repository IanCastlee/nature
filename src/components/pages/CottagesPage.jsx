import React, { lazy, Suspense, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { images } from "../../constant/image";
import { dummyCottages } from "../../constant/mockData";

const CattageCard = lazy(() => import("../molecules/CattageCard"));

function CottagesPage() {
  const { categoryId } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <main className="w-full min-h-screen dark:bg-black scroll-smooth pb-20">
      <section className="w-full h-[270px] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.aboutbg})` }}
        ></div>

        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/50 blur-3xl opacity-40"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <h1 className="text-white text-3xl font-semibold text-center max-w-[550px] mt-[100px]">
            FIND THE PERFECT COTTAGE FOR YOUR STAY
          </h1>
        </div>
      </section>

      <section className="w-full px-2 md:px-2 lg:px-[130px] pt-10">
        <div className="flex flex-row justify-center items-center gap-2 mb-2">
          <div className="h-[1px] w-[50px] bg-blue-400"></div>

          <span className="text-blue-400 font-medium text-sm md:text-sm lg:text-lg">
            AVAILABLE COTTAGES
          </span>
          <div className="h-[1px] w-[50px] bg-blue-400"></div>
        </div>
        <div className="w-full  flex flex-row flex-wrap gap-2 justify-start">
          <Suspense
            fallback={
              <div className="fixed bottom-4 right-10 text-white">
                Loading...
              </div>
            }
          >
            {dummyCottages.map((item) => (
              <CattageCard item={item} key={item.name} />
            ))}
          </Suspense>
        </div>
      </section>
    </main>
  );
}

export default CottagesPage;
