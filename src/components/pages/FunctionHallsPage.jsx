import React, { useEffect } from "react";
import { images } from "../../constant/image";
import useGetData from "../../hooks/useGetData";
import FunctionHallCard from "../molecules/FunctionHallCard";

function FunctionHallsPage() {
  const {
    data: dataFH,
    loading: loadingFH,
    refetch: refetchFH,
    error: errorFH,
  } = useGetData(`/admin/functionhall.php?status=active`);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="w-full min-h-screen dark:bg-black scroll-smooth pb-20">
      {/* Header Section */}
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
            SPACIOUS AND STYLISH FUNCTION HALLS FOR YOU
          </h1>
        </div>
      </section>

      {/* Available Cottages */}
      <section className="w-full px-2 md:px-2 lg:px-[130px] pt-10">
        <div className="flex flex-row justify-center items-center gap-2 mb-2">
          <div className="h-[1px] w-[50px] bg-blue-400"></div>
          <span className="text-blue-400 font-medium text-sm md:text-sm lg:text-lg">
            AVAILABLE COTTAGES
          </span>
          <div className="h-[1px] w-[50px] bg-blue-400"></div>
        </div>

        <div className="w-full flex flex-row flex-wrap gap-2 justify-start">
          {loadingFH && (
            <div className="text-sm text-blue-600 mt-4">
              Loading cottages...
            </div>
          )}

          {errorFH && (
            <div className="text-sm text-red-500 mt-4">
              {errorFH.message || "Something went wrong."}
            </div>
          )}

          {Array.isArray(dataFH) &&
            dataFH.map((item, index) => (
              <FunctionHallCard item={item} key={item.name} index={index} />
            ))}
        </div>
      </section>
    </main>
  );
}

export default FunctionHallsPage;
