import React, { memo } from "react";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { useNavigate } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";

function RoomCard({ rooms }) {
  const navigate = useNavigate();

  return (
    <>
      {rooms &&
        rooms.map((item) => {
          const isUnderMaintenance = item.status === "under maintenance";

          return (
            <article
              key={item.room_id}
              className="w-full md:basis-[calc(50%-0.3rem)] lg:basis-[calc(33.333%-0.5rem)] mb-2 bg-white dark:bg-gray-950 dark:border border-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              {/*  Image with Maintenance Overlay */}
              <div className="w-full h-48 relative">
                <LazyLoadImage
                  src={`${uploadUrl.uploadurl}/rooms/${item.image}`}
                  alt="Room image"
                  effect="blur"
                  wrapperClassName="w-full h-48"
                  className="w-full h-full object-cover absolute top-0 left-0"
                />

                {isUnderMaintenance && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center z-10">
                    <span className="text-yellow-400 font-bold text-lg">
                      🚧 Under Maintenance
                    </span>
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="p-4">
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">
                      {item.room_name}
                    </h2>
                    <p className="dark:text-white text-sm font-medium">
                      ₱ {item.price} / Night
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 h-5 flex justify-center items-center px-1 rounded-full text-center mt-1">
                      156 booking
                    </p>
                  </div>

                  <icons.FaStreetView
                    onClick={() => navigate(`/room-view/${item.photo_sphere}`)}
                    title="View Room"
                    className="text-2xl text-blue-600 cursor-pointer transform transition-transform duration-300 hover:scale-125"
                  />
                </div>

                <div className="border-t dark:border-gray-800 mt-4 flex flex-flex-row flex-wrap justify-start pt-4 gap-5">
                  <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 font-medium">
                    <icons.LuUsers className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                    {item.capacity} per person
                  </span>

                  <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 font-medium">
                    <icons.IoIosTimer className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                    Duration: {item.duration} hrs
                  </span>
                </div>

                <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
                  {item.extras && (
                    <h3 className="dark:text-gray-100 text-gray-700 text-sm font-medium mb-2">
                      Extras
                    </h3>
                  )}
                  <div className="w-full flex flex-row flex-wrap gap-5">
                    {item.extras &&
                      item.extras.split(",").map((e, index) => (
                        <span
                          className="text-xs dark:text-gray-100 flex flex-row items-center"
                          key={index}
                        >
                          {e.trim()}
                          <icons.PiLineVerticalThin className="text-gray-600 dark:text-gray-500 text-lg ml-3" />
                        </span>
                      ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row justify-between mt-8">
                  <Button
                    onClick={() => navigate(`/booking/${item.room_id}`)}
                    disabled={isUnderMaintenance}
                    style={`${
                      isUnderMaintenance
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:scale-105"
                    } text-xs text-white font-medium rounded-sm px-2 transition-all duration-300 transform`}
                    label={isUnderMaintenance ? "Unavailable" : "Reserve Now"}
                  />

                  <button
                    onClick={() => navigate(`/room-deatails/${item.room_id}`)}
                    className="group relative flex flex-row items-center text-blue-500 text-sm font-medium rounded-sm h-[30px] self-end ml-auto transition-colors duration-300 hover:text-blue-400"
                  >
                    <span
                      className="relative before:content-[''] before:absolute before:bottom-0 before:left-1/2 
                          before:translate-x-[-50%] before:h-[2px] before:w-0 
                          before:bg-blue-400 before:transition-all before:duration-300 
                          group-hover:before:w-full text-xs"
                    >
                      More Details
                    </span>
                    <icons.FiArrowUpRight className="ml-1 text-blue-600 text-lg font-bold" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
    </>
  );
}

export default memo(RoomCard);
