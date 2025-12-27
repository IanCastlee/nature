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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {children}
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
      setSearchData({
        checkIn: value,
        checkOut: "", // ✅ reset checkout when check-in changes
        guests: searchData.guests,
      });
    } else {
      setSearchData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSearch = () => {
    const { checkIn, checkOut, guests } = searchData;
    if (!checkIn || !checkOut || !guests) {
      setToast({
        message: "Please complete all fields before searching.",
        type: "error",
      });
      return;
    }

    navigate(
      `/search-result?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  const formatDate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // ✅ helper: next day after check-in
  const getNextDay = (dateString) => {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 1);
    return d;
  };

  /* =======================
     DAYPICKER DARK STYLES
  ======================= */
  const dayPickerClassNames = {
    caption: "text-gray-900 dark:text-gray-200",
    caption_label: "text-sm font-medium text-gray-900 dark:text-gray-200",

    head_row: "text-gray-600 dark:text-gray-300",
    head_cell:
      "text-xs font-medium text-gray-600 dark:text-gray-300 !important",

    day: "text-sm text-gray-900 dark:text-gray-200",
    day_today: "border border-blue-500",
    day_selected: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600",
    day_disabled: "text-gray-400 dark:text-gray-600 opacity-50",
    nav_button: "text-gray-700 dark:text-gray-300 hover:text-blue-500",
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 z-30 px-4 lg:pl-[80px] flex justify-center lg:justify-start">
      {toast && <Toaster {...toast} onClose={() => setToast(null)} />}

      {/* SEARCH CARD */}
      <div
        className="
          w-full sm:max-w-4xl lg:max-w-[60%]
          bg-white/95 dark:bg-gray-900/95
          backdrop-blur
          rounded-2xl
          shadow-xl
          border border-gray-200 dark:border-gray-800
          p-4 sm:p-6
          flex flex-col md:flex-row gap-4 md:items-end
        "
      >
        {/* CHECK-IN */}
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            Check-in
          </label>
          <div
            onClick={() => setOpenCalendar({ checkIn: true, checkOut: false })}
            className="
              flex items-center justify-between
              rounded-full px-4 py-2
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
              cursor-pointer hover:border-blue-400 transition
            "
          >
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {searchData.checkIn || "Select date"}
            </span>
            <IoIosCalendar className="text-lg text-blue-500" />
          </div>
        </div>

        {/* CHECK-OUT */}
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            Check-out
          </label>
          <div
            onClick={() =>
              searchData.checkIn &&
              setOpenCalendar({ checkIn: false, checkOut: true })
            }
            className={`
              flex items-center justify-between
              rounded-full px-4 py-2 border
              bg-white dark:bg-gray-800 transition
              ${
                searchData.checkIn
                  ? "cursor-pointer border-gray-300 dark:border-gray-700 hover:border-blue-400"
                  : "opacity-50 cursor-not-allowed border-gray-200"
              }
            `}
          >
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {searchData.checkOut || "Select date"}
            </span>
            <IoIosCalendar className="text-lg text-blue-500" />
          </div>
        </div>

        {/* GUESTS */}
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">
            Guests
          </label>
          <div
            className="
              flex items-center rounded-full px-4 py-2
              border border-gray-300 dark:border-gray-700
              bg-white dark:bg-gray-800
            "
          >
            <select
              className="
                w-full bg-transparent outline-none
                text-sm text-gray-800 dark:text-gray-200
                [&>option]:bg-white dark:[&>option]:bg-gray-800
                [&>option]:text-gray-900 dark:[&>option]:text-gray-200
              "
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
            <FiUsers className="text-blue-500 text-lg ml-2" />
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <Button
          onClick={handleSearch}
          style="
    bg-blue-600 hover:bg-blue-700
    h-[36px] sm:h-[40px]
    px-5
    text-white text-xs sm:text-sm font-medium
    rounded-full
    flex items-center justify-center gap-2
    transition hover:scale-105
  "
          label={
            <>
              Search Rooms
              <icons.IoSearch className="text-base" />
            </>
          }
        />
      </div>

      {/* CHECK-IN CALENDAR */}
      {openCalendar.checkIn && (
        <CalendarPortal>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl">
            <DayPicker
              mode="single"
              disabled={{ before: tomorrow }}
              classNames={dayPickerClassNames}
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
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl">
            <DayPicker
              mode="single"
              disabled={{
                before: searchData.checkIn
                  ? getNextDay(searchData.checkIn) // ✅ remove same-day checkout
                  : undefined,
              }}
              classNames={dayPickerClassNames}
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
