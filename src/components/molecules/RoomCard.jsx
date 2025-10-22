import React, { memo, useEffect } from "react";
import { motion } from "framer-motion";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { useNavigate } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";

function RoomCard({ rooms }) {
  const navigate = useNavigate();

  //  Check if user is signed in
  useEffect(() => {
    const user = sessionStorage.getItem("user"); // or localStorage if you store there
    if (!user) {
      navigate("/"); // redirect to homepage if not signed in
    }
  }, [navigate]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <>
      {rooms &&
        rooms.map((item, index) => {
          const isUnderMaintenance = item.status === "under maintenance";

          return (
            <motion.article
              key={item.room_id}
              className="w-full md:basis-[calc(50%-0.3rem)] lg:basis-[calc(33.333%-0.5rem)] mb-2 bg-white dark:bg-gray-950 dark:border border-gray-900 rounded-lg shadow-lg overflow-hidden cursor-pointer"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Image Section */}
              <div className="w-full h-48 relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <LazyLoadImage
                    src={
                      item.image
                        ? `${uploadUrl.uploadurl}/rooms/${item.image}`
                        : dummyImage
                    }
                    alt="Room image"
                    effect="blur"
                    wrapperClassName="w-full h-48"
                    className="w-full h-full object-cover absolute top-0 left-0"
                  />
                </motion.div>

                {isUnderMaintenance && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center z-10">
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-yellow-400 font-bold text-lg"
                    >
                      🚧 Under Maintenance
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Room Info */}
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

                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <icons.FaStreetView
                      onClick={() =>
                        navigate(`/room-view/${item.photo_sphere}`)
                      }
                      title="View Room"
                      className="text-2xl text-blue-600 cursor-pointer"
                    />
                  </motion.div>
                </div>

                {/* Capacity + Duration */}
                <div className="border-t dark:border-gray-800 mt-4 flex flex-wrap justify-start pt-4 gap-5">
                  <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 font-medium">
                    <icons.LuUsers className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                    {item.capacity} per person
                  </span>

                  <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 font-medium">
                    <icons.IoIosTimer className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                    Duration: {item.duration} hrs
                  </span>
                </div>

                {/* Extras */}
                <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
                  {item.extras && (
                    <h3 className="dark:text-gray-100 text-gray-700 text-sm font-medium mb-2">
                      Extras
                    </h3>
                  )}
                  <div className="w-full flex flex-row flex-wrap gap-5">
                    {item.extras &&
                      item.extras.split(",").map((e, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs dark:text-gray-100 flex flex-row items-center"
                        >
                          {e.trim()}
                          <icons.PiLineVerticalThin className="text-gray-600 dark:text-gray-500 text-lg ml-3" />
                        </motion.span>
                      ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-row justify-between mt-8">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigate(`/booking/${item.room_id}`)}
                      disabled={isUnderMaintenance}
                      style={`${
                        isUnderMaintenance
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:scale-105"
                      } text-xs text-white font-medium rounded-sm h-[30px] px-2 transition-all duration-300 transform`}
                      label={isUnderMaintenance ? "Unavailable" : "Reserve Now"}
                    />
                  </motion.div>

                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                </div>
              </div>
            </motion.article>
          );
        })}
    </>
  );
}

export default memo(RoomCard);
