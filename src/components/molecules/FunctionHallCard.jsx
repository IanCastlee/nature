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

  const handleReserveClick = () => {
    navigate(`/other-facilities-booking/${item.fh_id}`);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.article
        className="w-full flex flex-col 
        md:basis-[calc(50%-0.3rem)] lg:basis-[calc(50%-0.3rem)] 
        overflow-hidden rounded-xl cursor-pointer
        bg-white dark:bg-gray-900
        shadow-sm hover:shadow-xl 
        dark:border dark:border-gray-800
        transition-all duration-300"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
      >
        {/* IMAGE */}
        <div
          className="relative w-full 
        h-[180px] md:h-[230px] 
        overflow-hidden group"
        >
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}function_hall/${item.image}`}
            alt={item.name}
            effect="blur"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* 360 BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigate(`/room-view/${item.photosphere}`)}
            className="absolute top-3 right-3 
            text-blue-600 dark:text-blue-400
            border border-blue-300 dark:border-blue-500
            hover:border-blue-500 dark:hover:border-blue-300
            hover:text-blue-700 dark:hover:text-blue-300
            bg-white/70 dark:bg-gray-800/70
            backdrop-blur-sm
            px-3 py-1.5 rounded-md 
            text-xs font-medium shadow-md
            flex items-center gap-2"
          >
            <icons.FaStreetView className="text-lg" />
            View 360°
          </motion.button>
        </div>

        {/* DETAILS */}
        <div className="p-5">
          <div className="flex flex-row justify-between items-start">
            <div>
              <h4
                className="text-gray-900 dark:text-white 
              text-lg lg:text-xl font-semibold leading-tight"
              >
                {item.name}
              </h4>

              <p
                className="text-blue-600 dark:text-blue-400 
              text-xl font-bold mt-1"
              >
                ₱ {item.price}
              </p>
            </div>
          </div>

          {/* INFO */}
          <div
            className="border-t dark:border-gray-800 mt-4 pt-4 
          flex flex-wrap gap-4 lg:gap-6"
          >
            <span
              className="inline-flex items-center text-sm 
            text-gray-700 dark:text-gray-200"
            >
              <icons.LuUsers className="mr-2 text-blue-500 dark:text-blue-400 text-lg" />
              {item.capacity} Persons
            </span>

            <span
              className="inline-flex items-center text-sm 
            text-gray-700 dark:text-gray-200"
            >
              <icons.IoIosTimer className="mr-2 text-blue-500 dark:text-blue-400 text-lg" />
              {item.duration} hrs
            </span>
          </div>

          {/* BUTTON SECTION */}
          <div className="mt-6 flex flex-row justify-between items-center w-full">
            {/* RESERVE */}
            <Button
              onClick={handleReserveClick}
              style="bg-green-600 h-[36px] text-white font-medium rounded-md 
              px-4 py-2 text-sm transition hover:scale-105"
              label="Reserve Now"
            />

            {/* MORE DETAILS */}
            <button
              onClick={() => navigate(`/funtionhall-deatails/${item.fh_id}`)}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 
              text-sm font-medium hover:underline"
            >
              More Details
              <icons.FiArrowUpRight className="text-lg" />
            </button>
          </div>
        </div>
      </motion.article>
    </>
  );
}

export default FunctionHallCard;
