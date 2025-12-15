import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";
import Button from "../atoms/Button";
import CustomDropDownn from "../atoms/CustomDropDownn";
import Toaster from "./Toaster";

function SearchBox() {
  const navigate = useNavigate();
  const { data } = useGetData("/admin/room-category.php");

  const [toast, setToast] = useState(null);

  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  // Handle input changes
  const handleChange = (key, value) => {
    if (key === "checkIn") {
      // Reset check-out when check-in changes
      setSearchData((prev) => ({
        ...prev,
        checkIn: value,
        checkOut: "",
      }));
    } else {
      setSearchData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Handle search button click
  const handleSearch = () => {
    const { checkIn, checkOut, guests } = searchData;

    if (!checkIn || !checkOut || !guests) {
      setToast({
        message: "Please fill all fields before searching.",
        type: "error",
      });
      return;
    }

    setToast({
      message: "Searching available rooms...",
      type: "success",
    });

    setTimeout(() => {
      navigate(
        `/search-result?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
    }, 1000);
  };

  // Get today's date and tomorrow's date for min check-in
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Helper to get the next day after a date string
  const getNextDay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="absolute bottom-8 lg:left-16 left-0 right-0 px-4 z-30 flex justify-center lg:justify-start">
        <div
          className="backdrop-blur-md border border-gray-300 dark:border-gray-600 rounded-md shadow-lg
          p-4 sm:p-5 flex flex-col md:flex-row gap-3 md:items-end w-full
          max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-[60%]
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {/* Dates */}
          <div className="flex lg:flex-row md:flex-row flex-col gap-1">
            {/* Check-In */}
            <div className="flex-1">
              <label className="text-xs block mb-1">Check-In</label>
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleChange("checkIn", e.target.value)}
                min={minDate}
                className="w-full bg-transparent border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Check-Out */}
            <div className="flex-1">
              <label className="text-xs block mb-1">Check-Out</label>
              <input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleChange("checkOut", e.target.value)}
                min={getNextDay(searchData.checkIn) || minDate}
                disabled={!searchData.checkIn}
                className="w-full bg-transparent border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="w-full sm:w-auto flex-1">
            <label className="text-xs block mb-1">Number of Guests</label>
            <select
              value={searchData.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
              className="w-full bg-transparent border border-gray-400 dark:border-gray-600 rounded-lg px-4 py-2 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            >
              <option value="" disabled hidden>
                Select Guests
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={handleSearch}
              style="bg-blue-500 hover:bg-blue-600 text-white font-medium flex flex-row 
              justify-center items-center px-4 py-2 rounded-lg transition w-full md:w-auto mt-3 md:mt-0"
              label={
                <>
                  <span>Search Room</span>
                  <icons.IoSearch className="text-lg text-white ml-1" />
                </>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBox;
