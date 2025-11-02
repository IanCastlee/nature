import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import CustomDropDownn from "../../components/atoms/CustomDropDownn";
import FileInput from "../../components/atoms/FileInput";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import Button from "../admin_atoms/Button";
import useGetData from "../../hooks/useGetData";
import useSetInactive from "../../hooks/useSetInactive";
import { uploadUrl } from "../../utils/fileURL";

export default function ModalForm_Room({
  showForm,
  setShowForm,
  form,
  setForm,
  formLoading,
  handleChange,
  handleSubmit,
  roomCategoryData,
}) {
  const [previews, setPreviews] = useState([]);
  const [selectedDelete, setSelectedDelete] = useState(null);

  //  Only define endpoint when room_id exists
  const roomImagesUrl = form?.room_id
    ? `/gallery/room-images.php?room_id_get=${form.room_id}`
    : null;

  //  Only fetch if URL is valid
  const {
    data: imageData,
    loading,
    refetch,
    error,
  } = useGetData(roomImagesUrl, Boolean(roomImagesUrl));

  //  Hook for deleting images
  const { setInactive: deleteImage, loading: deleteLoading } = useSetInactive(
    "/gallery/room-images.php",
    () => {
      refetch();
      setSelectedDelete(null);
    }
  );

  // Cleanup image previews
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const isVisible = showForm === "add_room" || showForm === "update_room";
  if (!isVisible) return null;

  const handleDeleteImage = (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    deleteImage({ id, action: "delete" });
  };

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setForm((prev) => ({ ...prev, images: files }));

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="w-[95%] max-w-[700px] max-h-[90%] overflow-auto rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">
            {showForm === "add_room" ? "Add New Room" : "Update Room"}
          </h3>
          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="text-2xl cursor-pointer text-gray-600 hover:text-red-500 dark:text-gray-300"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Category & Images */}
          <div className="flex flex-col md:flex-row gap-3">
            <CustomDropDownn
              label="Category"
              options={roomCategoryData}
              value={form.category}
              onChange={(selectedId) =>
                setForm((prev) => ({ ...prev, category: selectedId }))
              }
              valueKey="category_id"
              labelKey="category"
              required
            />

            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold dark:text-gray-200">
                Room Images (max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImages}
                required={showForm === "add_room"}
                className="text-sm border border-gray-300 rounded-md p-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />

              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {previews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/*  Room Image Gallery — only when room_id exists */}
          {form?.room_id && (
            <div className="mt-3">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                Existing Room Images
              </p>

              {loading ? (
                <p className="text-gray-500 text-sm">Loading images...</p>
              ) : error ? (
                <p className="text-red-500 text-sm">Error loading images</p>
              ) : imageData?.length ? (
                <div className="grid grid-cols-3 gap-2">
                  {imageData.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={`${uploadUrl.uploadurl}/rooms/${img.image_path}`}
                        alt="Room"
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={deleteLoading}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No images found.</p>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              label="Room Name"
              name="room_name"
              type="text"
              value={form.room_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Capacity & Duration */}
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              required
            />
            <Input
              label="Duration"
              name="duration"
              type="text"
              value={form.duration}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          {/* Photo Sphere Upload */}
          <FileInput
            label="Photo Sphere"
            isRequired={showForm === "add_room"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                photo_sphere: e.target.files[0],
              }))
            }
          />

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              label={
                formLoading
                  ? "Submitting..."
                  : showForm === "update_room"
                  ? "Update Room"
                  : "Add Room"
              }
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
}
