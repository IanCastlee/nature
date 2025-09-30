import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { uploadUrl } from "../../utils/fileURL";
function RoomCategoryCard({ item }) {
  const navigate = useNavigate();
  return (
    <article className="w-full md:w-[49%] lg:w-[49%] h-[200px] relative group overflow-hidden rounded-md cursor-pointer">
      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
        <LazyLoadImage
          src={`${uploadUrl.uploadurl}/room_categories/${item.image}`}
          alt={item.category}
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className={`
          
          absolute inset-0 
          bg-black bg-opacity-50 
          flex items-center justify-center 
          transition-opacity duration-300
          flex-col

          opacity-100   sm:opacity-100 md:opacity-100 
          lg:opacity-0  lg:group-hover:opacity-100
        `}
      >
        <h4 className="text-white text-center text-lg md:text-lg lg:text-xl font-semibold px-2 max-w-[400px]">
          {item.category}
        </h4>
        <button
          className="text-blue-400 text-sm font-medium border-b-2 border-blue-500"
          onClick={() => navigate(`/room-category/${item.category}`)}
        >
          View Rooms
        </button>
      </div>
    </article>
  );
}

export default memo(RoomCategoryCard);
