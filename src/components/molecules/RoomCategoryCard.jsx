import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { uploadUrl } from "../../utils/fileURL";
import { motion } from "framer-motion";

function RoomCategoryCard({ item }) {
  const navigate = useNavigate();

  return (
    <motion.article
      className="
        relative w-full md:w-[49%] lg:w-[49%]
        h-[160px] sm:h-[180px] lg:h-[200px]
        rounded-xl overflow-hidden cursor-pointer
        bg-gray-200 dark:bg-gray-700
        shadow-sm hover:shadow-lg transition-shadow
        group
      "
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={() => navigate(`/room-category/${item.category_id}`)}
    >
      {/* Image */}
      <LazyLoadImage
        src={`${uploadUrl.uploadurl}/room_categories/${item.image}`}
        alt={item.category}
        effect="blur"
        wrapperClassName="w-full h-full"
        className="
          w-full h-full object-cover
          transition-transform duration-700
          group-hover:scale-105
        "
      />

      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/70 via-black/30 to-transparent
          flex flex-col justify-end
          p-4
        "
      >
        {/* Content */}
        <div className="space-y-1">
          <h4
            className="
              text-white
              text-sm sm:text-base lg:text-lg
              font-semibold
              leading-snug max-w-[75%]
            "
          >
            {item.category}
          </h4>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/room-category/${item.category_id}`);
            }}
            className="
              inline-flex items-center gap-1
              text-sm font-medium
              text-blue-300 hover:text-blue-200
              transition
            "
          >
            View Rooms
            <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default memo(RoomCategoryCard);
