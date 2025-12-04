import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { icons } from "../../constant/icon";
import HouseRules from "../organisms/HouseRules";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadUrl } from "../../utils/fileURL";
import useGetData from "../../hooks/useGetData";

function ViewCottagePage() {
  const { cottageId } = useParams();

  const [showHouseRules, setShowHouseRules] = useState(false);
  const navigate = useNavigate();

  const {
    data: cottageDetails,
    loading,
    error,
  } = useGetData(`/admin/cottage.php?id=${cottageId}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!cottageDetails) return null;

  const { image, name, price, capacity, duration, description, photosphere } =
    cottageDetails;

  return (
    <>
      <main className="min-h-screen w-full dark:bg-black pb-20">
        {/* IMAGE SECTION */}
        <section className="w-full flex flex-row gap-1 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px]">
          <div className="w-full h-full">
            <LazyLoadImage
              src={`${uploadUrl.uploadurl}/cottage/${image}`}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="w-full px-4 sm:px-8 md:px-10 lg:px-20 xl:px-[130px] mt-4">
          {/* Title, Price & Buttons */}
          <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-20">
            {/* Cottage Name & Price */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 md:gap-20">
              <div className="flex flex-col gap-2">
                <h3 className="dark:text-gray-300 text-gray-700 text-3xl sm:text-4xl md:text-5xl font-semibold">
                  {name}
                </h3>
                <p className="text-blue-400 text-xl sm:text-2xl font-medium flex items-center">
                  <icons.IoPricetagsOutline className="mr-1 text-lg" />P{price}
                </p>
              </div>

              {/* Photosphere Button */}
              <icons.FaStreetView
                onClick={() => navigate(`/room-view/${photosphere}`)}
                title="View Facility"
                className="text-[35px] sm:text-[40px] text-blue-400 cursor-pointer transform transition-transform duration-300 hover:scale-125"
              />
            </div>

            {/* House Rules Button */}
            <button
              onClick={() => setShowHouseRules(true)}
              className="self-start lg:self-auto dark:bg-blue-400 bg-gray-900 dark:border-blue-400 border border-gray-700 
                text-white py-2 px-4 rounded-lg text-sm flex items-center gap-2
                transition-all duration-300 hover:bg-blue-500 dark:hover:bg-blue-600"
            >
              <icons.GrNotes className="text-sm" />
              View House Rules
            </button>
          </div>

          {/* CAPACITY & DURATION */}
          <div className="flex flex-wrap gap-5 mt-4">
            <span className="inline-flex items-center text-md sm:text-lg dark:text-gray-100 text-gray-700">
              <icons.LuUsers className="mr-1 text-blue-400" />
              <span className="text-sm mr-2">Capacity:</span> {capacity} Person
            </span>

            <span className="inline-flex items-center text-md sm:text-lg dark:text-gray-100 text-gray-700">
              <icons.IoIosTimer className="mr-1 text-blue-400" />
              <span className="text-sm mr-2">Duration:</span> {duration} hrs
            </span>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="w-full px-4 sm:px-8 md:px-10 lg:px-20 xl:px-[130px] mt-6">
          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50">
              * Description
            </h3>
            <p className="dark:text-white text-md sm:text-lg">{description}</p>
          </div>
        </section>
      </main>

      {/* HOUSE RULES MODAL */}
      {showHouseRules && <HouseRules close={() => setShowHouseRules(false)} />}
    </>
  );
}

export default ViewCottagePage;
