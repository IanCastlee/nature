import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import Input from "../../components/atoms/Input";
import TextArea from "../../components/atoms/TextArea";
import Button from "../admin_atoms/Button";

export default function ModalFAQs({
  showForm,
  setShowForm,
  form,
  formLoading,
  handleChange,
  handleSubmit,
}) {
  if (showForm !== "add_faq" && showForm !== "update_faq") return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[650px] rounded-lg bg-white dark:bg-gray-800 p-5"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold dark:text-white">
            {showForm === "add_faq" ? "ADD FAQ" : "UPDATE FAQ"}
          </h3>

          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="cursor-pointer text-lg dark:text-gray-200"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Question (English)"
            name="question_en"
            value={form.question_en}
            onChange={handleChange}
            required
          />

          <Input
            label="Question (Tagalog)"
            name="question_tl"
            value={form.question_tl}
            onChange={handleChange}
            required
          />

          <TextArea
            label="Answer (English)"
            name="answer_en"
            value={form.answer_en}
            onChange={handleChange}
            required
          />

          <TextArea
            label="Answer (Tagalog)"
            name="answer_tl"
            value={form.answer_tl}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={formLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
              label={formLoading ? "Saving..." : "Save"}
            />
          </div>
        </form>
      </motion.div>
    </div>
  );
}
