import { useState, useEffect } from "react";
import { icons } from "../../constant/icon";
import ImageCard from "../molecules/ImageCard";
import NoData from "../molecules/NoData";
import useAuthStore from "../../store/authStore";
import useGetData from "../../hooks/useGetData";
import { useNavigate } from "react-router-dom";
import Toaster from "../molecules/Toaster";

function Gallery() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const { user } = useAuthStore();

  const {
    data: dataImg,
    loading: loadingImg,
    refetch: refetchImg,
  } = useGetData(`/gallery/gallery.php?status=posted`);

  const SkeletonCard = () => (
    <div className="w-full h-40 bg-gray-300 animate-pulse rounded mb-4"></div>
  );

  return (
    <>
      {/* Toast */}
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* PAGE WRAPPER */}
      <div className="w-full min-h-screen px-4 sm:px-6 md:px-10 lg:px-16 pt-[70px] dark:bg-gray-800">
        <div className="flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex flex-col gap-2 border-b pb-2 border-gray-400 dark:border-gray-600">
            <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100 text-gray-800">
              Gallery
            </h1>
            <p className="text-sm sm:text-base dark:text-gray-400 text-gray-800">
              Explore a collection of photos highlighting the beauty and moments
              within our space. Enjoy the gallery!
            </p>
          </div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {loadingImg ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : dataImg?.length > 0 ? (
              dataImg.map((item) => <ImageCard key={item.id} item={item} />)
            ) : (
              <div className="w-full h-[60vh] flex justify-center items-center">
                <NoData />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BACK BUTTON */}
      <icons.FiArrowLeftCircle
        className="text-2xl dark:text-white text-gray-600 cursor-pointer fixed top-4 left-4 z-20"
        onClick={() => navigate(-1)}
      />
    </>
  );
}

export default Gallery;
