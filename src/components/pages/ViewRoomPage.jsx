import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { icons } from "../../constant/icon";
import HouseRules from "../organisms/HouseRules";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import useGetData from "../../hooks/useGetData";
function ViewRoomPage() {
  const { roomId } = useParams();

  const [showHouseRules, setShowHouseRules] = useState(false);
  const navigate = useNavigate();

  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?id=${roomId}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!roomDetails) return null;

  const {
    image,
    room_name,
    price,
    capacity,
    duration,
    description,
    category,
    amenities,
    inclusion,
    extras,
    photo_sphere,
  } = roomDetails;

  const parsedAmenities = amenities?.split(",") || [];
  const parsedInclusions = inclusion?.split(",") || [];
  const parsedExtras = extras?.split(",") || [];

  return (
    <>
      <main className="min-h-screen w-full dark:bg-black pb-20">
        <section className="w-full flex flex-row gap-1  h-[450px]">
          <div className="w-[60%] h-full">
            <LazyLoadImage
              src={`${uploadUrl.uploadurl}/rooms/${image}`}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-[40%] h-full justify-between">
            <LazyLoadImage
              src={dummyImage}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full h-[49%]"
              className="w-full h-full object-cover"
            />
            <LazyLoadImage
              src={dummyImage}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full  h-[50%]"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="w-full px-[130px] mt-4">
          <div className="w-full flex flex-row  justify-between items-center gap-20">
            <div className="flex flex-row items-center gap-20">
              <div className="flex flex-col gap-2">
                <h3 className="dark:text-gray-300 text-gray-700 text-5xl font-semibold">
                  {room_name}
                </h3>
                <p className="text-blue-400 text-2xl font-medium flex flex-row items-center">
                  <icons.IoPricetagsOutline className="mr-1 text-lg" /> P{price}{" "}
                  / Night
                </p>
              </div>

              <icons.FaStreetView
                onClick={() => navigate(`/room-view/${photo_sphere}`)}
                title="View Room"
                className="text-[40px] text-blue-400 cursor-pointer transform transition-transform duration-300 hover:scale-125"
              />
            </div>

            <button
              onClick={() => setShowHouseRules(true)}
              className="dark:bg-blue-400 bg-gray-900 dark:border-blue-400 border border-gray-700 
  text-white dark:text-white py-1 px-2 rounded-lg text-sm 
  flex flex-row items-center gap-2 transition-all duration-300 
  hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900"
            >
              <icons.GrNotes className="text-sm" />
              View House Rules
            </button>
          </div>

          <div className=" flex flex-flex-row flex-wrap justify-start gap-5">
            <span className="inline-flex items-center text-lg dark:text-gray-100 text-gray-700 ">
              <icons.LuUsers className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
              {capacity} Person
            </span>

            <span className="inline-flex items-center text-lg dark:text-gray-100 text-gray-700">
              <icons.IoIosTimer className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
              {duration} hrs
            </span>
          </div>
        </section>
        <section className="w-full flex flex-row justify-between px-[130px] mt-4">
          <div className="w-full flex flex-row gap-x-8 mt-6">
            <ul className="flex-1">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                Amenities
              </h3>
              {parsedAmenities.length ? (
                parsedAmenities.map((amenity, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                  >
                    {amenity.trim()}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic">
                  No amenities listed.
                </li>
              )}
            </ul>

            <ul className="flex-1">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                Room Inclusions
              </h3>
              {parsedInclusions.length ? (
                parsedInclusions.map((inclusion, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                  >
                    {inclusion.trim()}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic">
                  No inclusions listed.
                </li>
              )}
            </ul>

            <ul className="flex-1">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                Room Extras
              </h3>
              {parsedExtras.length ? (
                parsedExtras.map((extras, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                  >
                    {extras.trim()}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500 italic">
                  No extras listed.
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="w-full flex flex-col px-[130px] mt-4">
          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50">
              * Description
            </h3>
            <p className="dark:text-white text-lg">{description}</p>
          </div>
        </section>
      </main>

      {showHouseRules && <HouseRules close={() => setShowHouseRules(false)} />}
    </>
  );
}

export default ViewRoomPage;
