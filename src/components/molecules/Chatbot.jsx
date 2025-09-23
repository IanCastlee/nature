import React from "react";
import { motion } from "framer-motion";
function Chatbot({ close }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 300 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed right-4 bottom-4 w-[350px] h-[80%] bg-white z-20 rounded-lg"
    >
      <button onClick={close}>Close</button>
    </motion.section>
  );
}

export default Chatbot;
