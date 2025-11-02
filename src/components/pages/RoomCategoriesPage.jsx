import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { images } from "../../constant/image";
import RoomCard from "../molecules/RoomCard";
import useGetData from "../../hooks/useGetData";

function RoomCategoriesPage() {
  const { categoryId } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  ///fetch room based on category
  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?categoryId=${categoryId}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!roomDetails) return null;

  const title =
    roomDetails.length > 0 ? roomDetails[0].category : "NO ROOM AVAILABLE";
  return (
    <main className="w-full min-h-screen dark:bg-black scroll-smooth pb-20 mt-[50px]">
      <section className="w-full h-[270px] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.aboutbg})` }}
        ></div>

        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/50 blur-3xl opacity-40"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full px-4">
          <h1 className="text-white lg:text-3xl md:text-2xl text-2xl mb-4 font-semibold text-center max-w-[550px] mt-[100px]">
            {title}
          </h1>
        </div>
      </section>

      <section className="w-full px-2 md:px-2 lg:px-[130px] pt-10">
        <div className="flex flex-row justify-center items-center gap-2 mb-2">
          <div className="h-[1px] w-[50px] bg-blue-400"></div>

          <span className="text-blue-400 font-medium text-sm md:text-sm lg:text-lg">
            AVAILABLE ROOMS
          </span>
          <div className="h-[1px] w-[50px] bg-blue-400"></div>
        </div>
        <div className="w-full  flex flex-row flex-wrap gap-2 justify-start">
          <RoomCard rooms={roomDetails} />
        </div>
      </section>
    </main>
  );
}

export default RoomCategoriesPage;
