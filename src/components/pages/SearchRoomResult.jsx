// SearchRoomResult.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { images } from "../../constant/image";
import RoomCard from "../molecules/RoomCard";
import useGetData from "../../hooks/useGetData";
import HouseRules from "../organisms/HouseRules";
import { icons } from "../../constant/icon";
function SearchRoomResult() {
  const [searchParams] = useSearchParams();
  const [showHouseRules, setShowHouseRules] = useState(false);

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");
  // const categoryId = searchParams.get("categoryId");
  console.log("searchParams : ", checkIn, checkOut, guests);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(
    `/booking/search-rooms.php?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!roomDetails) return null;

  const title =
    roomDetails.length > 0 ? roomDetails[0].category : "NO ROOM AVAILABLE";

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
              {roomDetails.length > 0
                ? "Rooms Matching Your Search"
                : "No Rooms Available for Your Search"}
            </h1>
          </div>
        </section>

        <section className="w-full px-2 md:px-2 lg:px-[130px] pt-10">
          <div className="flex flex-row justify-end items-end gap-2 mb-2">
            {/* <p
              className="
              text-xs 
              px-3 py-1.5 rounded-md inline-block
              bg-white text-black
              dark:bg-gray-800 dark:text-white
            "
            >
              Business Hours: <br /> 8:00 AM – 5:00 PM (Every Day)
            </p> */}

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
            <RoomCard rooms={roomDetails} />
          </div>
        </section>
      </main>
      {showHouseRules && <HouseRules close={() => setShowHouseRules(false)} />}
    </>
  );
}

export default SearchRoomResult;
