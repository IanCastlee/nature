import React from "react";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";

function HouseRules({ close }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-[95%] max-w-[500px] max-h-[85%] overflow-y-auto rounded-xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">
            🏠 House Rules
          </h3>
          <icons.MdOutlineClose
            onClick={close}
            className="text-2xl cursor-pointer text-gray-600 hover:text-red-500 dark:text-gray-300 transition-all"
          />
        </div>

        {/* Rules List */}
        <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          <li>No smoking inside the room or any area of the resort.</li>
          <li>
            Bringing of alcoholic drinks is strictly{" "}
            <strong className="text-red-600 dark:text-red-400">
              PROHIBITED
            </strong>
            .
          </li>
          <li>Loud music, speakers, and videoke systems are not allowed.</li>
          <li>No tents or camping setups permitted.</li>
          <li>No pets allowed within the premises.</li>
          <li>Outside mattresses, foams, or pillows are not allowed.</li>
          <li>
            Cooking equipment or appliances such as gas stoves, butane, rice
            cookers, portable grillers, and electric kettles are{" "}
            <strong className="text-red-600 dark:text-red-400">
              not permitted
            </strong>
            .
          </li>
        </ul>

        {/* Footer Message */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-center">
          <p className="text-sm text-blue-800 dark:text-blue-400 font-medium">
            Please coordinate with us to avoid check-in delays. <br />
            <span className="font-semibold">
              Thank you for your cooperation!
            </span>{" "}
            💙
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default HouseRules;
