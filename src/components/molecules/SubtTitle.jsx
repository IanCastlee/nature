import React from "react";
import { motion } from "framer-motion";

function SubtTitle({ title, hidden }) {
  return (
    <div className="flex flex-row justify-center items-center gap-2">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.5 }}
        className={`h-[1px] w-[35px] bg-blue-400 ${hidden}`}
      ></motion.div>
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.5 }}
        className="text-blue-400 font-medium text-sm md:text-sm lg:text-lg"
      >
        {title}
      </motion.span>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.5 }}
        className="h-[1px] w-[35px] bg-blue-400"
      ></motion.div>
    </div>
  );
}

export default SubtTitle;
