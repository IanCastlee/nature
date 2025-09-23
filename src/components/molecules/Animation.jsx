import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Animation({ image, title, isReverse }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      className={`flex  ${
        isReverse ? "flex-row-reverse" : "flex-row"
      }  items-center`}
    >
      <h2 className="text-lg bg-blue-400 text-white whitespace-nowrap font-normal mb-4 font-playfair  z-10 border-[1px] border-blue-400 rounded-full px-4 dark:bg-black dark:text-white">
        {title}
      </h2>
      <motion.div
        ref={ref}
        initial={{ width: "0%" }}
        animate={isInView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 1.9, ease: "easeInOut" }}
        className="h-[1px] bg-blue-400 w-full -mt-3  relative"
      >
        <img
          src={image}
          className={`absolute ${isReverse ? "left-0" : "right-0"} -top-[58px]`}
          alt="About_Image"
        />
      </motion.div>
    </div>
  );
}

export default Animation;
