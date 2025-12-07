import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { images } from "../../constant/image";
import RoomCard from "../molecules/RoomCard";
import useGetData from "../../hooks/useGetData";
import { motion } from "framer-motion";
import HouseRules from "../organisms/HouseRules";
import { icons } from "../../constant/icon";
function SkeletonRoomCard() {
  return (
    <motion.div
      className="w-full md:basis-[calc(50%-0.3rem)] lg:basis-[calc(33.333%-0.5rem)] mb-2 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse h-[350px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      </div>
    </motion.div>
  );
}

function RoomCategoriesPage() {
  const { categoryId } = useParams();
  const [showHouseRules, setShowHouseRules] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /// Fetch room based on category
  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?categoryId=${categoryId}`);

  const title =
    roomDetails && roomDetails.length > 0
      ? roomDetails[0].category
      : "NO ROOM AVAILABLE";

  console.log("Error: ", error);

  return (
    <>
      <main className="w-full min-h-screen dark:bg-black scroll-smooth pb-20 mt-[50px]">
        <section className="w-full h-[180px] md:h-[240px] lg:h-[270px] relative flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images.topcover})` }}
          />

          {/* Overlays */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-black/50 blur-3xl opacity-40"></div>
          </div>

          {/* Centered Content */}
          <div className="relative z-10 text-center px-4 mt-6">
            <h1 className="text-white text-lg md:text-2xl lg:text-3xl font-semibold max-w-[550px] mx-auto">
              {title}
            </h1>
          </div>
        </section>

        {/* <SearchBox /> */}

        <section className="w-full px-2 md:px-2 lg:px-[130px] pt-10">
          <div className="flex flex-row justify-end items-center gap-2 mb-2">
            <button
              onClick={() => setShowHouseRules(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 
             text-white dark:text-white p-1 rounded-sm shadow-md 
             flex flex-row items-center gap-2 text-xs font-medium 
             transition-all duration-300 hover:from-blue-700 hover:to-blue-600 
             dark:hover:from-blue-600 dark:hover:to-blue-700 hover:shadow-lg"
            >
              <icons.GrNotes className="text-sm" />
              View House Rules
            </button>
          </div>

          <div className="w-full flex flex-row flex-wrap gap-2 justify-start">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRoomCard key={i} />
                ))
              : roomDetails && <RoomCard rooms={roomDetails} />}
          </div>

          {error && (
            <p className="text-center text-red-500 mt-4">
              Error loading room details.
            </p>
          )}
        </section>
      </main>
      {showHouseRules && <HouseRules close={() => setShowHouseRules(false)} />}
    </>
  );
}

export default RoomCategoriesPage;
