import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { IoIosCalendar } from "react-icons/io";
import { FiUsers } from "react-icons/fi";
import { createPortal } from "react-dom";
import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";
import Button from "../atoms/Button";
import Toaster from "./Toaster";

/* =======================
   CALENDAR PORTAL
======================= */
function CalendarPortal({ children }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 dark:bg-black/60">
      <div className="pointer-events-auto">{children}</div>
    </div>,
    document.body
  );
}

function SearchBox() {
  const navigate = useNavigate();
  useGetData("/admin/room-category.php");

  const [toast, setToast] = useState(null);

  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const [openCalendar, setOpenCalendar] = useState({
    checkIn: false,
    checkOut: false,
  });

  const handleChange = (key, value) => {
    if (key === "checkIn") {
      setSearchData((prev) => ({
        ...prev,
        checkIn: value,
        checkOut: "",
      }));
    } else {
      setSearchData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSearch = () => {
    const { checkIn, checkOut, guests } = searchData;

    if (!checkIn || !checkOut || !guests) {
      setToast({
        message: "Please fill all fields before searching.",
        type: "error",
      });
      return;
    }

    navigate(
      `/search-result?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const addOneDay = (dateString) => {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    return d;
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="absolute bottom-8 left-0 right-0 px-4 lg:pl-[80px] lg:pr-4 z-30 flex justify-center lg:justify-start w-full">
      {toast && <Toaster {...toast} onClose={() => setToast(null)} />}

      <div className="backdrop-blur-md bg-white dark:bg-gray-900 border-t-2 border-blue-500 rounded-md shadow-lg p-4 sm:p-5 flex flex-col md:flex-row gap-3 md:items-end w-full sm:max-w-4xl lg:max-w-[60%]">
        {/* CHECK-IN */}
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-200">
            Check-in
          </label>
          <div
            className="flex items-center justify-between border-2 border-blue-200 dark:border-blue-400
                       rounded-lg px-3 py-2 cursor-pointer
                       bg-white dark:bg-gray-800"
            onClick={() => setOpenCalendar({ checkIn: true, checkOut: false })}
          >
            <span className="text-sm text-gray-900 dark:text-gray-200">
              {searchData.checkIn || "Select date"}
            </span>
            <IoIosCalendar className="text-xl text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        {/* CHECK-OUT */}
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-200">
            Check-out
          </label>
          <div
            className={`flex items-center justify-between border-2 rounded-lg px-3 py-2
              bg-white dark:bg-gray-800 ${
                !searchData.checkIn
                  ? "opacity-50 cursor-not-allowed  border-blue-200 dark:border-blue-700"
                  : "cursor-pointer border-blue-200 dark:border-blue-400"
              }`}
            onClick={() =>
              searchData.checkIn &&
              setOpenCalendar({ checkIn: false, checkOut: true })
            }
          >
            <span className="text-sm text-gray-900 dark:text-gray-200">
              {searchData.checkOut || "Select date"}
            </span>
            <IoIosCalendar className="text-xl text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        {/* GUESTS */}
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-200">
            Guests
          </label>
          <div className="flex items-center border-2 border-blue-200 dark:border-blue-400 rounded-lg px-3 py-2 bg-white dark:bg-gray-800">
            <select
              className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-200
                         [&>option]:bg-white dark:[&>option]:bg-gray-800
                         [&>option]:text-gray-900 dark:[&>option]:text-gray-200"
              value={searchData.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
            >
              <option value="" hidden>
                Select guests
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} Guest{i > 0 && "s"}
                </option>
              ))}
            </select>
            <FiUsers className="text-blue-500 dark:text-blue-400 text-lg" />
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <Button
          onClick={handleSearch}
          style="flex items-center justify-center gap-1
                 bg-blue-500 hover:bg-blue-600
                 dark:bg-blue-600 dark:hover:bg-blue-700
                 text-white px-5 py-2 rounded-lg transition
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
          label={
            <>
              <span className="text-sm">Search Available Room</span>
              <icons.IoSearch className="text-lg" />
            </>
          }
        />
      </div>

      {/* CHECK-IN CALENDAR */}
      {openCalendar.checkIn && (
        <CalendarPortal>
          <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200
                          p-4 rounded-xl shadow-2xl border border-blue-500 dark:border-blue-400"
          >
            <DayPicker
              mode="single"
              disabled={{ before: tomorrow }}
              onSelect={(date) => {
                if (date) {
                  handleChange("checkIn", formatDate(date));
                  setOpenCalendar({ checkIn: false, checkOut: false });
                }
              }}
            />
          </div>
        </CalendarPortal>
      )}

      {/* CHECK-OUT CALENDAR */}
      {openCalendar.checkOut && (
        <CalendarPortal>
          <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200
                          p-4 rounded-xl shadow-2xl border border-blue-500 dark:border-blue-400"
          >
            <DayPicker
              mode="single"
              disabled={{
                before: searchData.checkIn
                  ? addOneDay(searchData.checkIn)
                  : undefined,
              }}
              onSelect={(date) => {
                if (date) {
                  handleChange("checkOut", formatDate(date));
                  setOpenCalendar({ checkIn: false, checkOut: false });
                }
              }}
            />
          </div>
        </CalendarPortal>
      )}
    </div>
  );
}

export default SearchBox;
