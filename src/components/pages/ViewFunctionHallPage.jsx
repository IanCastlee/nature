import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import HouseRules from "../organisms/HouseRules";
import { useNavigate, useParams } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import useGetData from "../../hooks/useGetData";

function ViewFunctionHallPage() {
  const { fhId } = useParams();
  const navigate = useNavigate();

  const {
    data: fhDetails,
    loading,
    error,
  } = useGetData(`/admin/functionhall.php?id=${fhId}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading details.</p>;
  if (!fhDetails) return null;

  const { image, name, price, capacity, duration, description, photosphere } =
    fhDetails;

  return (
    <>
      <main className="min-h-screen w-full dark:bg-black pb-20 mt-[50px]">
        {/* IMAGE SECTION */}
        <section className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] overflow-hidden">
          {/* Image */}
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}/function_hall/${image}`}
            alt="Function Hall"
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </section>

        {/* DETAILS SECTION */}
        <section className="w-full px-4 sm:px-8 md:px-10 lg:px-20 xl:px-[150px] mt-6">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Name + Price */}
            <div className="flex flex-col gap-2">
              <h3 className="dark:text-gray-200 text-gray-800 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {name}
              </h3>

              <p className="text-blue-500 text-xl sm:text-2xl font-semibold flex items-center">
                <icons.IoPricetagsOutline className="mr-2 text-2xl" />P{price}
              </p>
            </div>

            {/* View 360 Button */}
            <button
              onClick={() => navigate(`/room-view/${photosphere}`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white 
                   px-4 py-2 rounded-lg text-sm sm:text-base transition shadow-md"
            >
              <icons.FaStreetView className="text-xl" />
              View 360°
            </button>
          </div>

          {/* CAPACITY & DURATION */}
          <div className="flex flex-wrap gap-5 mt-6">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <icons.LuUsers className="mr-2 text-blue-500 text-xl" />
              <p className="text-gray-700 dark:text-gray-100 text-sm sm:text-base">
                <span className="font-medium">Capacity:</span> {capacity}{" "}
                Persons
              </p>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <icons.IoIosTimer className="mr-2 text-blue-500 text-xl" />
              <p className="text-gray-700 dark:text-gray-100 text-sm sm:text-base">
                <span className="font-medium">Stay Duration:</span> {duration}{" "}
                hrs
              </p>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="w-full px-4 sm:px-8 md:px-10 lg:px-20 xl:px-[150px] mt-10">
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default ViewFunctionHallPage;
