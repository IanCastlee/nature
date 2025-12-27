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
        className="
          w-full flex flex-col
          md:basis-[calc(50%-0.5rem)] lg:basis-[calc(50%-0.5rem)]
          rounded-xl overflow-hidden
          bg-white dark:bg-gray-950
          border border-gray-100 dark:border-gray-800
          shadow-sm hover:shadow-lg
          transition-all duration-300
        "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
      >
        {/* IMAGE */}
        <div className="relative w-full h-[170px] sm:h-[200px] md:h-[220px] overflow-hidden group">
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}function_hall/${item.image}`}
            alt={item.name}
            effect="blur"
            className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-105
            "
          />

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* 360 VIEW */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/room-view/${item.photosphere}`)}
            className="
    absolute top-3 right-3
    flex items-center gap-2
    px-3 py-1.5
    text-xs font-medium
    rounded-full
    bg-black/70
    backdrop-blur
    text-white
    border border-white/20
    shadow-md
    hover:bg-black/85
    transition
  "
          >
            <icons.FaStreetView className="text-base shrink-0" />
            360°
          </motion.button>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col gap-4">
          {/* TITLE & PRICE */}
          <div>
            <h4 className="text-gray-900 dark:text-white text-lg font-semibold">
              {item.name}
            </h4>
            <p className="text-blue-600 dark:text-blue-400 text-xl font-bold mt-1">
              ₱ {item.price}
            </p>
          </div>

          {/* INFO */}
          <div className="flex flex-wrap gap-5 pt-4 border-t dark:border-gray-800">
            <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <icons.LuUsers className="mr-2 text-blue-500 text-lg" />

              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                Capacity
              </span>
              <span>{item.capacity} persons</span>
            </span>

            <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <icons.IoIosTimer className="mr-2 text-blue-500 text-lg" />

              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                Stay duration
              </span>
              <span>{item.duration} hours</span>
            </span>
          </div>

          {/* ACTIONS */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={handleReserveClick}
              style="
    bg-green-600 hover:bg-green-700

    h-[32px] sm:h-[38px]
    px-4 sm:px-5

    text-xs sm:text-sm
    text-white font-medium

    rounded-full
    transition
    hover:scale-105
  "
              label="Reserve Now"
            />

            <button
              onClick={() => navigate(`/funtionhall-deatails/${item.fh_id}`)}
              className="
                flex items-center gap-1
                text-sm font-medium
                text-blue-600 dark:text-blue-400
                hover:text-blue-800 dark:hover:text-blue-300
                transition
              "
            >
              More Details
              <icons.FiArrowUpRight className="text-base" />
            </button>
          </div>
        </div>
      </motion.article>
    </>
  );
}

export default FunctionHallCard;
