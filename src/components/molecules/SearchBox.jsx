// SearchBox.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";
import Button from "../atoms/Button";
import CustomDropDownn from "../atoms/CustomDropDownn";

function SearchBox() {
  const navigate = useNavigate();

  // Fetch room categories
  const { data } = useGetData("/admin/room-category.php");

  // State for search inputs
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
      alert("Please fill all fields before searching.");
      return;
    }

    navigate(
      `/search-result?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&categoryId=${categoryId}`
    );
  };

  // Calculate tomorrow's date to block past/current dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD format

  return (
    <div className="absolute max-w-[70%] ml-16 bottom-10 left-0 right-0 px-5 z-30">
      <div
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-md shadow-lg p-4
      flex flex-col md:flex-row gap-3 md:items-center w-full"
      >
        {/* Check-in date */}
        <input
          type="date"
          value={searchData.checkIn}
          onChange={(e) => handleChange("checkIn", e.target.value)}
          min={minDate} // prevent selecting past/today
          className="flex-1 bg-transparent text-white placeholder-gray-200 border border-white/30 rounded-lg px-4 py-2 outline-none"
        />

        {/* Check-out date */}
        <input
          type="date"
          value={searchData.checkOut}
          onChange={(e) => handleChange("checkOut", e.target.value)}
          min={minDate} // prevent selecting past/today
          className="flex-1 bg-transparent text-white placeholder-gray-200 border border-white/30 rounded-lg px-4 py-2 outline-none"
        />

        {/* Guests */}
        <select
          value={searchData.guests}
          onChange={(e) => handleChange("guests", e.target.value)}
          className="flex-1 bg-transparent text-white border border-white/30 rounded-lg px-4 py-2 outline-none"
        >
          <option value="" disabled hidden className="text-black">
            Number of Guests
          </option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1} className="text-black">
              {i + 1} Guest{i > 0 ? "s" : ""}
            </option>
          ))}
        </select>

        {/* Category dropdown */}
        <CustomDropDownn
          top={true}
          options={data}
          value={searchData.categoryId}
          onChange={(value) => handleChange("categoryId", value)}
          valueKey="category_id"
          labelKey="category"
        />

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          style="bg-blue-500 hover:bg-blue-600 text-white font-medium flex flex-row px-4 py-2 rounded-lg transition w-full md:w-auto items-center"
          label={
            <>
              <span>Search</span>
              <icons.IoSearch className="text-lg text-white ml-1" />
            </>
          }
        />
      </div>
    </div>
  );
}

export default SearchBox;
