import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import { uploadUrl } from "../../utils/fileURL";
import { useNavigate } from "react-router-dom";

function CattageCard({ item }) {
  const navigate = useNavigate();

  return (
    <article
      className="w-full 
      md:basis-[calc(50%-0.3rem)] 
      lg:basis-[calc(33.333%-0.5rem)] 
      h-[230px] 
      relative group overflow-hidden 
      rounded-lg cursor-pointer"
    >
      {/* IMAGE */}
      <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
        <LazyLoadImage
          src={`${uploadUrl.uploadurl}/cottage/${item.image}`}
          alt={item.name}
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover"
        />
      </div>

      {/* INFO OVERLAY */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 left-0 
        min-w-[65%] 
        bg-black/55 backdrop-blur-sm
        p-3 flex flex-col gap-1.5"
        style={{
          clipPath: "polygon(0 0, 78% 0, 100% 100%, 0% 100%)",
        }}
      >
        {/* NAME */}
        <h4 className="text-white text-base lg:text-lg font-semibold leading-tight">
          {item.name}
        </h4>

        {/* PRICE */}
        <div className="flex items-center text-sm text-white/90 gap-2">
          <icons.IoPricetagsOutline className="text-blue-400" />
          <span className="font-medium">₱ {item.price}</span>
        </div>

        {/* CAPACITY */}
        <div className="flex items-center text-sm text-white/85 gap-2">
          <icons.LuUsers className="text-blue-400" />
          <span className="text-xs text-white/60">Capacity</span>
          <span>{item.capacity} persons</span>
        </div>

        {/* DURATION */}
        <div className="flex items-center text-sm text-white/85 gap-2">
          <icons.IoIosTimer className="text-blue-400" />
          <span className="text-xs text-white/60">Stay duration</span>
          <span>{item.duration} hrs</span>
        </div>
      </motion.div>

      {/* MORE DETAILS */}
      <button
        onClick={() => navigate(`/cottage-details/${item.cottage_id}`)}
        className="absolute right-5 bottom-3 
        text-blue-700 text-sm font-medium
        hover:text-blue-600 transition"
      >
        More Details →
      </button>

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
    </article>
  );
}

export default CattageCard;
