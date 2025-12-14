import React from "react";
import Button from "../admin_atoms/Button";

const ModalTerms = ({
  showForm,
  setShowForm,
  form,
  handleChange,
  handleSubmit,
  formLoading,
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {showForm === "update_term" ? "Update Term" : "Add Term"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              Title (EN)
            </label>
            <input
              type="text"
              name="title_en"
              value={form.title_en}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              Title (TL)
            </label>
            <input
              type="text"
              name="title_tl"
              value={form.title_tl}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              Content (EN)
            </label>
            <textarea
              name="content_en"
              value={form.content_en}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">
              Content (TL)
            </label>
            <textarea
              name="content_tl"
              value={form.content_tl}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              onClick={() => setShowForm(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            />
            <Button
              type="submit"
              label={formLoading ? "Saving..." : "Save"}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTerms;
