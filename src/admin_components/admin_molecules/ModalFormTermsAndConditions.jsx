import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import Button from "../admin_atoms/Button";

export default function ModalFormTermsAndConditions({
  showForm,
  setShowForm,
  form,
  formLoading,
  handleChange,
  handleSubmit,
}) {
  if (showForm !== "add_terms" && showForm !== "update_terms") return null;

  return (
    <div className="w-full h-screen fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[600px] rounded-lg bg-white dark:bg-gray-800 p-4"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="dark:text-white text-sm font-semibold">
            {showForm === "add_terms"
              ? "ADD TERMS & CONDITIONS"
              : "UPDATE TERMS & CONDITIONS"}
          </h3>
          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="text-lg cursor-pointer dark:text-gray-100"
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextArea
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              label={
                formLoading
                  ? "Submitting..."
                  : showForm === "update_terms"
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
