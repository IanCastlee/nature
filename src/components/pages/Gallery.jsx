import { useState, useEffect } from "react";
import { icons } from "../../constant/icon";
import ImageCard from "../molecules/ImageCard";
import NoData from "../molecules/NoData";
import useFormSubmit from "../../hooks/useFormSubmit";
import useAuthStore from "../../store/authStore";
import useGetData from "../../hooks/useGetData";
import { useNavigate } from "react-router-dom";
import Toaster from "../molecules/Toaster";

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
    error: errorFetchImg,
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

  // Show any formError from the hook itself
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

    // Call submit and capture backend response
    const res = await submit(formData);

    // Show toast if backend returned error
    if (res?.success === false) {
      setToast({ message: res.message || "Upload failed.", type: "error" });
    }
    // success handled in useFormSubmit callback
  };

  // Skeleton component
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

      <div className="w-full min-h-screen px-[100px] mt-[70px]">
        <div className="w-full flex flex-col gap-6">
          {/* Header + Upload */}
          <div className="flex justify-between items-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
              <p className="text-gray-600 mt-2">
                These images are shared by the visitors who have come to see us.
                Enjoy browsing their contributions!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="file"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div>
                <span className="text-xs dark:text-gray-400 text-gray-600">
                  Upload your catptured
                </span>
                <label
                  htmlFor="file"
                  className="cursor-pointer flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md w-fit hover:bg-blue-600 transition"
                >
                  <icons.FiUpload size={20} />
                  Select Images
                </label>
              </div>
              <button
                disabled={formLoading || files.length < 1}
                onClick={handleUpload}
                className={`px-4 py-2 rounded-md text-white ${
                  files.length >= 1 && files.length <= 5
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition mt-6`}
              >
                {formLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

          {/* Selected Images Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap justify-end gap-4 mt-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative w-14 h-14 border rounded overflow-hidden"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {loadingImg ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : dataImg?.length > 0 ? (
              dataImg.map((item) => <ImageCard key={item.id} item={item} />)
            ) : (
              <div className="w-full h-screen flex flex-row justify-center items-center">
                <NoData />
              </div>
            )}
          </div>
        </div>
      </div>

      <icons.FiArrowLeftCircle
        className="text-2xl dark:text-white text-gray-600 cursor-pointer absolute top-8 left-8 z-20"
        onClick={() => navigate(-1)}
      />
    </>
  );
}

export default Gallery;
