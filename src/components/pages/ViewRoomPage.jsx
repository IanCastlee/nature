import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import HouseRules from "../organisms/HouseRules";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import useGetData from "../../hooks/useGetData";
import Toaster from "../molecules/Toaster";
function ViewRoomPage() {
  const { roomId } = useParams();

  const [showHouseRules, setShowHouseRules] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  //  Check if user is logged in
  const isLoggedIn = () => {
    const authStorage = sessionStorage.getItem("auth-storage");
    try {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token ? true : false;
    } catch {
      return false;
    }
  };

  //  Protected navigation (for buttons that require login)
  const handleProtectedNavigation = (path) => {
    if (!isLoggedIn()) {
      setToast({
        message: "Please sign in first before continuing.",
        type: "warning",
      });
      return;
    }
    navigate(path);
  };

  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?id=${roomId}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!roomDetails) return null;

  const {
    room_id,
    images,
    room_name,
    price,
    capacity,
    duration,
    description,
    category,
    amenities,
    inclusion,
    extras,
    photo_sphere,
    status,
  } = roomDetails;

  const parsedAmenities =
    amenities && amenities.trim() !== ""
      ? amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a)
      : [];

  const parsedInclusions =
    inclusion && inclusion.trim() !== ""
      ? inclusion
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i)
      : [];

  const parsedExtras =
    extras && extras.trim() !== ""
      ? extras
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e)
      : [];

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <main className="min-h-screen w-full dark:bg-black pb-20">
        <section className="w-full flex flex-row gap-1 lg:h-screen md:h-[400px] h-[400px] m-0 p-0 relative overflow-hidden">
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {/* 🔹 Blurred Background — visible only on lg */}
            <div
              className="absolute inset-0 bg-center bg-cover blur-2xl scale-110 hidden lg:block"
              style={{
                backgroundImage: `url(${uploadUrl.uploadurl}/rooms/${images[currentIndex]})`,
              }}
            ></div>

            {/* 🔹 Foreground Image (always visible) */}
            <LazyLoadImage
              src={`${uploadUrl.uploadurl}/rooms/${images[currentIndex]}`}
              alt={`Room image ${currentIndex + 1}`}
              effect="blur"
              wrapperClassName="w-full h-full relative z-10"
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* 🔹 Left Button */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
            >
              &#10094;
            </button>

            {/* 🔹 Right Button */}
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
            >
              &#10095;
            </button>

            {/* 🔹 Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                    currentIndex === index ? "bg-white" : "bg-white/40"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-2 lg:px-[130px] mt-4">
          <div className="w-full flex flex-row  justify-between items-center gap-20">
            <div className="flex flex-row items-center gap-20">
              <div className="flex flex-col gap-2">
                <h3 className="dark:text-gray-300 text-gray-700 text-2xl md:text-2xl lg:text-5xl font-semibold">
                  {room_name}
                </h3>
                <p className="dark:text-white text-lg md:text-lg lg:text-2xl font-medium flex flex-row items-center">
                  <icons.IoPricetagsOutline className="mr-1 text-lg" /> P{price}{" "}
                  / Night
                </p>
              </div>

              <icons.FaStreetView
                onClick={() => navigate(`/room-view/${photo_sphere}`)}
                title="View Room"
                className="text-[40px] text-blue-400 cursor-pointer transform transition-transform duration-300 hover:scale-125 hidden lg:block"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowHouseRules(true)}
                className="dark:bg-blue-400 bg-gray-900 dark:border-blue-400 border border-gray-700 
  text-white dark:text-white py-1 px-2 rounded-lg text-sm 
  flex flex-row items-center gap-2 transition-all duration-300 
  hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900"
              >
                <icons.GrNotes className="text-sm" />
                View House Rules
              </button>
            </div>
          </div>

          <div className=" flex flex-flex-row flex-wrap justify-start gap-5">
            <span className="inline-flex items-center text-lg dark:text-gray-100 text-gray-700 ">
              <icons.LuUsers className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
              {capacity} Person
            </span>

            <span className="inline-flex items-center text-lg dark:text-gray-100 text-gray-700">
              <icons.IoIosTimer className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
              {duration} hrs
            </span>
          </div>
        </section>
        <section className="w-full px-2 md:px-2 lg:px-[130px] mt-4">
          <div className="w-full flex flex-col lg:flex-row gap-8 mt-6">
            {parsedAmenities.filter((a) => a && a.trim() !== "").length > 0 && (
              <ul className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                  Amenities
                </h3>
                {parsedAmenities
                  .filter((a) => a && a.trim() !== "")
                  .map((amenity, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                    >
                      {amenity}
                    </li>
                  ))}
              </ul>
            )}

            {parsedInclusions.filter((i) => i && i.trim() !== "").length >
              0 && (
              <ul className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                  Room Inclusions
                </h3>
                {parsedInclusions
                  .filter((i) => i && i.trim() !== "")
                  .map((inclusion, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                    >
                      {inclusion}
                    </li>
                  ))}
              </ul>
            )}

            {parsedExtras.filter((e) => e && e.trim() !== "").length > 0 && (
              <ul className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                  Room Extras
                </h3>
                {parsedExtras
                  .filter((e) => e && e.trim() !== "")
                  .map((extra, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                    >
                      {extra}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </section>

        <section className="w-full flex flex-col px-2 md:px-2 lg:px-[130px] mt-4">
          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50">
              * Description
            </h3>
            <p className="dark:text-white text-lg">{description}</p>
          </div>
        </section>
      </main>

      {showHouseRules && <HouseRules close={() => setShowHouseRules(false)} />}

      <icons.FiArrowLeftCircle
        className="text-2xl text-white cursor-pointer absolute top-8 left-8 z-20"
        onClick={() => navigate(-1)}
      />
    </>
  );
}

export default ViewRoomPage;
