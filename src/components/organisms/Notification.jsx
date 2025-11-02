import React from "react";
import useAuthStore from "../../store/authStore";
import useGetData from "../../hooks/useGetData";
import Button from "../atoms/Button";
import { icons } from "../../constant/icon";
function Notification({ close }) {
  const { user } = useAuthStore();

  const { data, loading, refetch, error } = useGetData(
    `/notification/notification.php?user_id=${user?.user_id}`
  );

  console.log("NOTIFICATION DATA:", data);
  console.log("USER ID:", user?.user_id);

  return (
    <aside
      className="fixed right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-xl rounded-lg 
                 w-[350px] h-[80%] overflow-hidden flex flex-col border border-gray-200 
                 dark:border-gray-700 z-50 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm tracking-wide">
          Notifications
        </h3>
        <button
          onClick={close}
          className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-sm transition-colors"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && <p className="text-xs text-gray-500">Loading...</p>}
        {error && (
          <p className="text-xs text-red-500">Error loading notifications</p>
        )}

        {Array.isArray(data) && data.length > 0
          ? data.map((notif) => (
              <div
                key={notif.notif_id}
                className={`p-3 rounded-md text-xs border border-transparent hover:border-blue-400 cursor-pointer transition-colors
              ${
                notif.is_read
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-blue-50 dark:bg-blue-900"
              }`}
              >
                <p className="text-gray-800 dark:text-gray-100 leading-snug">
                  {notif.message}
                </p>
                <span className="block text-[10px] text-gray-500 mt-1">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </div>
            ))
          : !loading && (
              <p className="text-xs text-gray-500 text-center mt-10">
                No notifications found
              </p>
            )}
      </div>

      {/* Footer */}
      <div className="w-full p-2 border-t flex justify-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <Button
          label={
            <>
              Refresh
              <icons.TbRefresh />
            </>
          }
          style="w-full flex justify-center items-center gap-1 h-[20px] bg-transparent text-white rounded-md text-xs transition-colors"
          onClick={refetch}
        />
      </div>
    </aside>
  );
}

export default Notification;
