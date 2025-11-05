import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import { uploadUrl } from "../../utils/fileURL";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../atoms/Button";
import Toaster from "../molecules/Toaster";

function FunctionHallCard({ item, index }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  // ✅ Check if user is logged in (same logic as RoomCard)
  const isLoggedIn = () => {
    const authStorage = sessionStorage.getItem("auth-storage");
    try {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token ? true : false;
    } catch {
      return false;
    }
  };

  // ✅ Handles protected reserve action
  const handleReserveClick = () => {
    if (!isLoggedIn()) {
      setToast({
        message: "Please sign in first before continuing.",
        type: "warning",
      });

      return;
    }

    navigate(`/other-facilities-booking/${item.fh_id}`);
  };

  // ✅ Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {/* Toast */}
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.article
        className="w-full flex flex-col md:basis-[calc(50%-0.3rem)] lg:basis-[calc(50%-0.3rem)] h-auto relative group overflow-hidden rounded-md cursor-pointer shadow-lg dark:border dark:border-gray-800"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: index * 0.1,
        }}
      >
        {/* Image */}
        <div className="w-full h-full">
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}function_hall/${item.image}`}
            alt={item.name}
            effect="blur"
            wrapperClassName="w-full h-[230px]"
            className="w-full h-full object-cover"
          />

          {/* Details */}
          <div className="p-4 shadow-lg">
            <div className="flex flex-row justify-between">
              <div>
                <h4 className="dark:text-white text-gray-800 text-lg md:text-lg lg:text-xl font-semibold max-w-[400px]">
                  {item.name}
                </h4>
                <p className="text-blue-400 text-lg font-medium">
                  ₱ {item.price}
                </p>
              </div>

              <icons.FaStreetView
                onClick={() => navigate(`/room-view/${item.photosphere}`)}
                title="View Room"
                className="text-3xl dark:text-white text-gray-800 cursor-pointer transform transition-transform duration-300 hover:scale-125 border dark:border-gray-700 border-gray-300 rounded-full p-1"
              />
            </div>

            <div className="border-t dark:border-gray-800 mt-4 flex flex-wrap justify-start pt-4 gap-5">
              <div className="flex flex-row gap-4 flex-wrap">
                <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 font-medium">
                  <icons.LuUsers className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                  {item.capacity} per person
                </span>

                <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 font-medium">
                  <icons.IoIosTimer className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                  Duration: {item.duration} hrs
                </span>
              </div>

              {/* More Details */}
              <button
                onClick={() => navigate(`/funtionhall-deatails/${item.fh_id}`)}
                className="group relative flex flex-row items-center text-blue-500 text-sm font-medium rounded-sm h-[30px] self-end ml-auto transition-colors duration-300 hover:text-blue-400"
              >
                <span
                  className="relative before:content-[''] before:absolute before:bottom-0 before:left-1/2 
                  before:translate-x-[-50%] before:h-[2px] before:w-0 
                  before:bg-blue-400 before:transition-all before:duration-300 
                  group-hover:before:w-full"
                >
                  More Details
                </span>
                <icons.FiArrowUpRight className="ml-1 text-blue-600 text-lg font-bold" />
              </button>
            </div>

            {/* Button */}
            <div className="flex flex-row justify-end mt-8">
              <Button
                onClick={handleReserveClick}
                style="w-full bg-green-600 h-[30px] text-sm text-white font-medium rounded-sm px-2 transition-all duration-300 transform hover:scale-105"
                label="Reserve Now"
              />
            </div>
          </div>
        </div>
      </motion.article>
    </>
  );
}

export default FunctionHallCard;
