import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import CustomDropDownn from "../../components/atoms/CustomDropDownn";
import FileInput from "../../components/atoms/FileInput";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import Button from "../admin_atoms/Button";

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
  if (showForm !== "add_room" && showForm !== "update_room") return null;
  console.log("roomCategoryData : ", roomCategoryData);
  return (
    <div className="w-full h-screen fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[700px] rounded-lg bg-white dark:bg-gray-800 p-4"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="dark:text-white text-sm font-semibold">
            {showForm === "add_room" ? "ADD ROOM" : "UPDATE ROOM"}
          </h3>
          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="text-lg cursor-pointer dark:text-gray-100"
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex gap-2">
            <CustomDropDownn
              label="Select Category"
              options={roomCategoryData}
              value={form.category}
              onChange={(selectedId) =>
                setForm((prev) => ({ ...prev, category: selectedId }))
              }
              valueKey="category_id"
              labelKey="category"
            />

            <FileInput
              label="Room Thumbnail"
              isRequired={showForm === "add_room"}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image: e.target.files[0] }))
              }
            />
          </div>

          <div className="flex gap-2">
            <Input
              label="Room Name"
              type="text"
              name="room_name"
              value={form.room_name}
              onChange={handleChange}
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2">
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
            />
            <Input
              label="Duration"
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2">
            <TextArea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2">
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
          </div>

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              label={
                formLoading
                  ? "Submitting..."
                  : showForm === "update_room"
                  ? "Update"
                  : "Submit"
              }
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
}
