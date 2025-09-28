import React from "react";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
function HouseRules({ close }) {
  return (
    <div className="w-full h-screen bg-black/50 fixed top-0 left-0 z-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[500px] max-h-[80%] bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 overflow-y-auto"
      >
        <div className="w-full  flex flex-row justify-between">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            House Rules
          </h3>

          <icons.MdOutlineClose
            onClick={close}
            className="dark:text-gray-100 cursor-pointer text-lg"
          />
        </div>

        <ul className="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
          <li>No smoking inside the room and in any area of the resort.</li>
          <li>
            Bringing of alcoholic drinks is strictly <strong>PROHIBITED</strong>
            .
          </li>
          <li>Bringing of speaker/videoke is not allowed.</li>
          <li>No tent allowed.</li>
          <li>No pets allowed.</li>
          <li>No bringing of mattress, foam, or pillows.</li>
          <li>
            No bringing of cooking equipment/appliances (e.g. gas stove, butane,
            rice cooker, portable griller, and electric kettle).
          </li>
        </ul>

        <p className="mt-6 text-sm text-blue-700 dark:text-blue-400 font-medium">
          Please coordinate with us to avoid check-in delays. THANK YOU!
        </p>
      </motion.div>
    </div>
  );
}

export default HouseRules;
