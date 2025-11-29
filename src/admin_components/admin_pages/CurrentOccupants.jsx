import React, { useState, useMemo } from "react";
import useGetData from "../../hooks/useGetData";
import {
  MdPerson,
  MdMeetingRoom,
  MdCalendarToday,
  MdOutlineExitToApp,
  MdClose,
} from "react-icons/md";

function CurrentOccupants({ close }) {
  const { data, loading, error } = useGetData(`/admin/current_occupants.php`);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (guest) =>
        guest.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.room_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={close}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-start pt-5 px-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 w-full max-w-[99%] relative">
          {/* Close Button */}
          <button
            onClick={close}
            className="absolute top-0 right-0 text-2xl text-gray-500 hover:text-gray-800 z-50"
          >
            <MdClose />
          </button>

          {/* Header + Search */}
          <div className="w-full flex flex-row justify-between items-center mb-4">
            <h1 className="text-sm font-semibold text-gray-800 mb-4">
              Currently Checked-In Guests
            </h1>

            <input
              type="text"
              placeholder="Search by name or room..."
              className="w-[300px] text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded mb-4 text-sm">
              {error.message || "Error loading data. Please try again."}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredData?.length === 0 && (
            <div className="text-center text-gray-500 py-10 text-sm">
              No matching occupants found.
            </div>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {!loading &&
              filteredData?.length > 0 &&
              filteredData.map((guest, i) => {
                const accentColor =
                  guest.status === "arrived"
                    ? "bg-emerald-500"
                    : guest.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-gray-400";

                return (
                  <div
                    key={i}
                    className="bg-white shadow-md rounded-xl border border-gray-100 p-4 hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    {/* Top Accent Line */}
                    <div
                      className={`h-1 w-full rounded-t-xl ${accentColor} absolute top-0 left-0`}
                    ></div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 mt-2">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-gray-500 text-lg" />
                        <h2 className="text-sm font-semibold text-gray-800">
                          {guest.fullname}
                        </h2>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-sm rounded-full font-medium
                          ${
                            guest.status === "arrived"
                              ? "bg-emerald-100 text-emerald-700"
                              : guest.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {guest.status === "arrived"
                          ? "Checked-In"
                          : guest.status}
                      </span>
                    </div>

                    {/* Body with icons */}
                    <div className="flex items-center text-gray-600 text-sm mb-1 gap-2">
                      <MdMeetingRoom className="text-gray-400" />
                      <span className="font-medium">Room:</span>{" "}
                      {guest.room_name}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-1 gap-2">
                      <MdCalendarToday className="text-gray-400" />
                      <span className="font-medium">Check-In:</span>{" "}
                      {guest.start_date}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm gap-2">
                      <MdOutlineExitToApp className="text-gray-400" />
                      <span className="font-medium">Check-Out:</span>{" "}
                      {guest.end_date}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default CurrentOccupants;
