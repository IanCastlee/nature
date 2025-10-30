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

  const [toast, setToast] = useState(null); // ✅ for custom notification

  const [searchData, setSearchData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
    categoryId: "",
  });

  const handleChange = (key, value) => {
    setSearchData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const { checkIn, checkOut, guests, categoryId } = searchData;

    if (!checkIn || !checkOut || !guests || !categoryId) {
      setToast({
        message: "Please fill all fields before searching.",
        type: "error",
      }); // ✅ show toast instead of alert
      return;
    }

    setToast({
      message: "Searching available rooms...",
      type: "success",
    });

    setTimeout(() => {
      navigate(
        `/search-result?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&categoryId=${categoryId}`
      );
    }, 1000);
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <>
      {/* ✅ Toast Notification */}
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="absolute bottom-8 lg:left-16 left-0 right-0 px-4 z-30 flex justify-center lg:justify-start">
        <div
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-md shadow-lg 
          p-4 sm:p-5 flex flex-col md:flex-row gap-3 md:items-end w-full
          max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-[80%] xl:max-w-6xl 2xl:max-w-[75%]"
        >
          {/* Dates (stack on mobile) */}
          <div className="flex flex-row gap-1">
            {/* Check-in date */}
            <div className="flex-1">
              <label className="text-white text-xs block mb-1">Check-In</label>
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleChange("checkIn", e.target.value)}
                min={minDate}
                className="w-full bg-transparent text-white border border-white/30 rounded-lg px-4 py-2 outline-none text-sm"
              />
            </div>

            {/* Check-out date */}
            <div className="flex-1">
              <label className="text-white text-xs block mb-1">Check-Out</label>
              <input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleChange("checkOut", e.target.value)}
                min={minDate}
                className="w-full bg-transparent text-white border border-white/30 rounded-lg px-4 py-2 outline-none text-sm"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="w-full sm:w-auto flex-1">
            <label className="text-white text-xs block mb-1">
              Number of Guests
            </label>
            <select
              value={searchData.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
              className="w-full bg-transparent text-white border border-white/30 rounded-lg px-4 py-2 outline-none text-sm"
            >
              <option value="" disabled hidden className="text-black">
                Select Guests
              </option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1} className="text-black">
                  {i + 1} Guest{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Category dropdown */}
          <div className="w-full sm:w-auto flex-1">
            <label className="text-white text-xs block mb-1">
              Room Category
            </label>
            <CustomDropDownn
              top={true}
              options={data}
              value={searchData.categoryId}
              onChange={(value) => handleChange("categoryId", value)}
              valueKey="category_id"
              labelKey="category"
            />
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={handleSearch}
              style="bg-blue-500 hover:bg-blue-600 text-white font-medium flex flex-row 
              justify-center items-center px-4 py-2 rounded-lg transition w-full md:w-auto mt-3 md:mt-0"
              label={
                <>
                  <span>Search</span>
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
