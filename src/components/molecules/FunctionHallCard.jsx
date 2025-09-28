import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";

function FunctionHallCard({ item, index }) {
  return (
    <article className="w-full  md:basis-[calc(50%-0.3rem)] lg:basis-basis-[calc(50%-0.3rem)] h-[230px] relative group overflow-hidden rounded-md cursor-pointer">
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
        initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        className={`min-w-[100%] lg:min-w-[70%] max-w-full flex flex-col p-2 bg-black/50 absolute bottom-0 ${
          index % 2 === 0 ? "left-0 rounded-tr-xl" : "right-0 rounded-tl-xl"
        }`}
        // style={{
        //   clipPath:
        //     index % 2 === 0
        //       ? "polygon(0 0, 75% 0, 100% 100%, 0% 100%)"
        //       : "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)",
        // }}
      >
        <div
          className={`flex flex-col gap-2 ${
            index % 2 === 0 ? "items-start text-left" : "items-end text-right"
          }`}
        >
          <h4 className="text-white text-lg md:text-lg lg:text-xl font-semibold px-2 max-w-[400px]">
            {item.name}
          </h4>

          <span className="flex flex-row items-center text-sm text-white font-medium gap-2">
            <icons.IoPricetagsOutline /> P {item.price}
          </span>
          <span className="flex flex-row items-center text-sm text-white font-medium gap-2">
            <icons.LuUsers /> {item.capacity}
          </span>
          <span className="flex flex-row items-center text-sm text-white font-medium gap-2">
            <icons.IoIosTimer /> {item.duration}
          </span>
        </div>
      </motion.div>

      <button
        className={`text-sm text-white cursor-pointer hover:text-blue-400 absolute bottom-2 bg-black/60 rounded-full py-1 px-2 ${
          index % 2 === 0 ? "right-12" : "left-12"
        }`}
      >
        More Details
      </button>

      <icons.FaStreetView
        title="View Room"
        className={`text-3xl text-white cursor-pointer transform transition-transform duration-300 hover:scale-125 absolute bottom-2 bg-black/60 rounded-full p-1 ${
          index % 2 === 0 ? "right-2" : "left-2"
        }`}
      />
    </article>
  );
}
export default FunctionHallCard;
