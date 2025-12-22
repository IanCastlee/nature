import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { useNavigate } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";
import Toaster from "./Toaster";
import useAuthStore from "../../store/authStore";
import NoData from "./NoData";

function RoomCard({ rooms }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  // Safe Navigation
  const safeNavigate = (path, fallbackMessage) => {
    if (!path) {
      setToast({ message: fallbackMessage, type: "warning" });
      return;
    }
    navigate(path);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  if (!rooms || rooms.length === 0) {
    return <NoData label="No Available Rooms" />;
  }

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {rooms.map((item, index) => {
        const isUnderMaintenance = item?.status === "under_maintenance";

        // Safe image
        const roomImage =
          item?.images?.length > 0
            ? `${uploadUrl.uploadurl}/rooms/${
                item.images[item.images.length - 1]
              }`
            : dummyImage;

        return (
          <motion.article
            key={item?.room_id || `room-${index}`}
            className="w-full md:basis-[calc(50%-0.3rem)] lg:basis-[calc(33.333%-0.5rem)] 
            mb-2 bg-white dark:bg-gray-950 dark:border border-gray-900 
            rounded-lg shadow-lg overflow-hidden cursor-pointer"
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
            {/* IMAGE */}
            <div className="w-full h-48 relative overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <LazyLoadImage
                  src={roomImage}
                  alt={item?.room_name || "Room Image"}
                  effect="blur"
                  wrapperClassName="w-full h-48"
                  className="w-full h-full object-cover absolute"
                />
              </motion.div>

              {isUnderMaintenance && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
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

            {/* CONTENT */}
            <div className="p-4">
              <div className="w-full flex flex-row justify-between items-start">
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold mb-1 dark:text-white">
                    {item?.room_name || "Unnamed Room"}
                  </h2>

                  <p className="dark:text-white text-sm font-medium">
                    ₱ {item?.price || "N/A"} / Night
                  </p>
                </div>

                <div className="flex flex-col items-end justify-end">
                  {/* View Room (Photo Sphere) */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={() =>
                      safeNavigate(
                        item?.photo_sphere
                          ? `/room-view/${item.photo_sphere}`
                          : null,
                        "Room preview unavailable."
                      )
                    }
                    className="flex items-center gap-2 
             text-blue-600 dark:text-blue-400
             border border-blue-300 dark:border-blue-500
             hover:border-blue-500 dark:hover:border-blue-300
             hover:text-blue-700 dark:hover:text-blue-300
             px-2 py-1 rounded-md
             text-xs font-medium transition-all"
                  >
                    <icons.FaStreetView className="text-lg" />
                    View 360°
                  </motion.button>
                </div>
              </div>

              {/* ROOM INFO */}
              <div className="border-t dark:border-gray-800 mt-4 flex flex-wrap gap-5 pt-4">
                <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700">
                  <icons.LuUsers className="mr-1 text-blue-600" />
                  Good for {item?.capacity || "N/A"} person(s)
                </span>

                <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700">
                  <icons.GiDuration className="mr-1 text-blue-600" />
                  Duration: {item?.duration || "N/A"} hrs
                </span>
                <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700">
                  <icons.IoIosTimer className="mr-1 text-blue-600" />
                  Time In/Out: {item?.time_in_out}
                </span>
              </div>

              {/* EXTRAS */}
              <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
                {item?.extras?.length > 0 ? (
                  <>
                    <h3 className="dark:text-gray-100 text-gray-700 text-sm mb-2">
                      Extras
                    </h3>

                    <div className="w-full flex flex-wrap gap-5">
                      {item.extras.map((ex) => (
                        <motion.span
                          key={ex?.extra_id || Math.random()}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs dark:text-gray-100 flex flex-row items-center"
                        >
                          {ex?.extras || "Unknown Extra"} – ₱
                          {ex?.price
                            ? parseFloat(ex.price).toLocaleString()
                            : "0"}
                          <icons.PiLineVerticalThin className="text-gray-500 text-lg ml-3" />
                        </motion.span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400"></p>
                )}
              </div>

              {/* BUTTON */}
              <div className="flex justify-between mt-8">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() =>
                      safeNavigate(
                        item?.room_id ? `/reserve/${item.room_id}` : null,
                        "Reservation unavailable."
                      )
                    }
                    disabled={isUnderMaintenance}
                    style={`${
                      isUnderMaintenance
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:scale-105"
                    } text-xs text-white rounded-sm h-[30px] px-2`}
                    label={
                      isUnderMaintenance
                        ? "Unavailable"
                        : user
                        ? "Reserve Now"
                        : "Reserve Now"
                    }
                  />
                </motion.div>
                {/* More Details */}
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    safeNavigate(
                      item?.room_id ? `/room-deatails/${item.room_id}` : null,
                      "Room details unavailable."
                    )
                  }
                  className="group flex flex-row items-center text-blue-500 text-sm font-medium"
                >
                  More Details
                  <icons.FiArrowUpRight className="ml-1 text-blue-600 text-lg" />
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
