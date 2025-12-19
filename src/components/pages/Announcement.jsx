import React, { useEffect } from "react";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import useGetData from "../../hooks/useGetData";
import { useAnnouncementStore } from "../../store/useRoomStore";

function Announcement({ close }) {
  // fetch active announcements
  const { data, loading, error } = useGetData(
    `/admin/announcement.php?status=active`
  );

  const setAnnouncementCount = useAnnouncementStore(
    (state) => state.setAnnouncementCount
  );

  // ⭐ Update announcement count whenever data loads
  useEffect(() => {
    if (data) {
      setAnnouncementCount(data.length);
    }
  }, [data, setAnnouncementCount]);

  return (
    <div className="w-full h-screen bg-black/50 fixed top-0 left-0 z-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[900px] max-h-[80%] bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 overflow-y-auto"
      >
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Announcements
          </h3>
          <icons.MdOutlineClose
            onClick={close}
            className="dark:text-gray-100 cursor-pointer text-lg hover:text-red-500"
          />
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className="text-blue-500 text-sm mb-3">Loading announcements...</p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error.message || "Failed to load announcements."}
          </p>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {data && data.length > 0
            ? data.map((item) => (
                <div
                  key={item.id}
                  className="w-full p-4 rounded-md border dark:bg-gray-800 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {item.title}
                  </h3>
                  <p className="text-sm mt-2 dark:text-gray-300 whitespace-pre-line">
                    {item.message}
                  </p>
                  <div className="flex justify-end items-center mt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      📅 Date Posted:{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            : !loading && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-300">
                  No active announcements available.
                </p>
              )}
        </div>

        {/* Footer */}
        <div className="w-full mt-6 flex justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            This Announcement is from Nature Host Spring.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Announcement;
