import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";

function CattageCard({ item }) {
  return (
    <article className="w-full  md:basis-[calc(50%-0.3rem)] lg:basis-[calc(33.333%-0.5rem)] h-[230px] relative group overflow-hidden rounded-md cursor-pointer">
      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
        <LazyLoadImage
          src={item.image}
          alt={item.name}
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className="min-w-[60%] flex flex-col p-2 bg-black/60 absolute bottom-0 left-0"
        style={{
          clipPath: "polygon(0 0, 75% 0, 100% 100%, 0% 100%)",
        }}
      >
        <h4 className="text-white  text-lg md:text-lg lg:text-xl font-semibold px-2 max-w-[400px]">
          {item.name}
        </h4>
        <span className="flex flex-row items-center text-sm text-white font-medium gap-2">
          <icons.IoPricetagsOutline /> P {item.price}
        </span>
        <span className="flex flex-row items-center text-sm text-white font-medium gap-2">
          <icons.LuUsers /> {item.capacity}
        </span>
        <span className="flex flex-row items-center text-sm text-white font-medium gap-2">
          <icons.IoIosTimer />
          {item.duration}
        </span>
      </motion.div>

      <icons.FaStreetView
        title="View Room"
        className="text-3xl text-white cursor-pointer transform transition-transform duration-300 hover:scale-125 absolute right-2 bottom-2 bg-black/60 rounded-full p-1"
      />
    </article>
  );
}

export default CattageCard;
