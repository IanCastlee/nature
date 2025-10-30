import { useState, useEffect } from "react";
import { icons } from "../../constant/icon";
import ImageCard from "../molecules/ImageCard";
import NoData from "../molecules/NoData";
import useFormSubmit from "../../hooks/useFormSubmit";
import useAuthStore from "../../store/authStore";
import useGetData from "../../hooks/useGetData";
import { useNavigate } from "react-router-dom";
import Toaster from "../molecules/Toaster";
import Button from "../atoms/Button";

function Gallery() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const { user } = useAuthStore();

  const {
    data: dataImg,
    loading: loadingImg,
    refetch: refetchImg,
  } = useGetData(`/gallery/gallery.php?status=posted`);

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/gallery/gallery.php", () => {
    setFiles([]);
    setToast({ message: "Images uploaded successfully!", type: "success" });
    refetchImg();
  });

  useEffect(() => {
    if (formError) {
      setToast({
        message: formError.message || "Something went wrong.",
        type: "error",
      });
    }
  }, [formError]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length < 1) {
      setError("Please select at least 1 image.");
      setFiles([]);
      return;
    }

    if (selectedFiles.length > 5) {
      setError("You can only upload a maximum of 5 images.");
      setFiles([]);
      return;
    }

    setError("");
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (files.length < 1) {
      setError("Please select at least 1 image.");
      return;
    }

    if (files.length > 5) {
      setError("You can only upload a maximum of 5 images.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("user_id", user.user_id);
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    const res = await submit(formData);
    if (res?.success === false) {
      setToast({ message: res.message || "Upload failed.", type: "error" });
    }
  };

  const SkeletonCard = () => (
    <div className="w-full h-40 bg-gray-300 animate-pulse rounded mb-4"></div>
  );

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full min-h-screen px-4 sm:px-6 md:px-10 lg:px-16 pt-[70px] dark:bg-gray-800">
        <div className="flex flex-col gap-6">
          {/* Header + Upload */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className=" w-full lg:w-auto lg:border-none border-b pb-2 dark:border-gray-600 border-gray-400">
              <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100 text-gray-800">
                Gallery
              </h1>
              <p className=" mt-2 text-sm sm:text-base dark:text-gray-400 text-gray-800">
                These images are shared by the visitors who have come to see us.
                Enjoy browsing their contributions!
              </p>
            </div>

            <div className="flex flex-row sm:flex-row justify-start items-end sm:items-end gap-3 w-full sm:w-auto">
              <input
                id="file"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col  gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">
                  Upload your captured
                </span>
                <label
                  htmlFor="file"
                  className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-fit"
                >
                  <icons.FiUpload size={20} />
                  Select Images
                </label>
              </div>

              <Button
                onClick={handleUpload}
                style={`px-4 py-2  rounded-md text-white ${
                  files.length >= 1 && files.length <= 5
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition sm:mt-0`}
                label={formLoading ? "Uploading..." : "Upload"}
                disabled={formLoading || files.length < 1}
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

          {/* Selected Images Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap justify-start gap-4 mt-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border rounded overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex justify-center items-center text-sm hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      <icons.FiArrowLeftCircle
        className="text-2xl dark:text-white text-gray-600 cursor-pointer fixed top-4 left-4 z-20"
        onClick={() => navigate(-1)}
      />
    </>
  );
}

export default Gallery;
