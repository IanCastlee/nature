import React from "react";
import { motion } from "framer-motion";
function Title({ title }) {
  return (
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }}
      className="mb-6 text-gray-700 dark:text-white text-lg md:text-xl lg:text-2xl text-center md:text-center lg:text-start  font-medium px-6 lg:px-0"
    >
      {title}
    </motion.h3>
  );
}

export default Title;
