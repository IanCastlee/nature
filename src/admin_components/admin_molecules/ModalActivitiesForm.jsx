import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import FileInput from "../../components/atoms/FileInput";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import Button from "../admin_atoms/Button";

export default function ModalActivitiesForm({
  showForm,
  setShowForm,
  form,
  setForm,
  formLoading,
  handleSubmit,
}) {
  if (showForm !== "add_activity" && showForm !== "update_activity")
    return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  return (
    <div className="w-full h-screen fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[500px] rounded-lg bg-white dark:bg-gray-800 p-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="dark:text-white text-sm font-semibold">
            {showForm === "add_activity" ? "ADD ACTIVITY" : "UPDATE ACTIVITY"}
          </h3>
          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="text-lg cursor-pointer dark:text-gray-100"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
          />

          <TextArea
            label="Subtitle"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            required
          />

          <FileInput
            label="Thumbnail Image"
            isRequired={showForm === "add_activity"}
            onChange={handleFileChange}
          />

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              label={
                formLoading
                  ? "Submitting..."
                  : showForm === "update_activity"
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
