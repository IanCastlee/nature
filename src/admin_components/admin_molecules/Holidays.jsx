import React, { useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import useGetData from "../../hooks/useGetData";
import { icons } from "../../constant/icon";

function Holidays({ onclose }) {
  const { data, refetch } = useGetData("/admin/holidays.php");

  // ✅ normalize response (array OR { data })
  const holidays = Array.isArray(data) ? data : data?.data || [];

  const { submit, loading } = useFormSubmit("/admin/holidays.php", refetch);

  const [form, setForm] = useState({
    id: null,
    name: "",
    date: "",
  });

  const resetForm = () => setForm({ id: null, name: "", date: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    submit({
      action: form.id ? "update" : "create",
      ...form,
    });
    resetForm();
  };

  const handleEdit = (holiday) => setForm(holiday);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this holiday?")) return;
    submit({ action: "delete", id });
    if (form.id === id) resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded shadow p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onclose}
          className="absolute top-2 right-3 text-gray-500 dark:text-gray-400 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Manage Holidays
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Holiday name (e.g. Valentine's)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded"
            />

            <input
              type="text"
              placeholder="MM/DD (e.g. 02/14)"
              value={form.date}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9/]*$/.test(value)) {
                  setForm({ ...form, date: value });
                }
              }}
              required
              className="border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1 text-sm border dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded"
              >
                Cancel
              </button>
            )}

            <button
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 text-sm rounded"
            >
              {form.id ? "Update" : "Save"}
            </button>
          </div>
        </form>

        {/* LIST */}
        <div className="max-h-64 overflow-auto">
          <table className="w-full border dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border dark:border-gray-700 p-2 text-left text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="border dark:border-gray-700 p-2 text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="border dark:border-gray-700 p-2 text-right text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => (
                <tr
                  key={h.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="border dark:border-gray-700 p-2 text-gray-800 dark:text-gray-200">
                    {h.name}
                  </td>
                  <td className="border dark:border-gray-700 p-2 text-center text-gray-800 dark:text-gray-200">
                    {h.date}
                  </td>
                  <td className="border dark:border-gray-700 p-2 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(h)}
                      className="text-blue-600 dark:text-blue-400"
                      title="Edit"
                    >
                      <icons.FaRegEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="text-red-600 dark:text-red-400"
                      title="Delete"
                    >
                      <icons.MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}

              {!holidays.length && (
                <tr>
                  <td
                    colSpan="3"
                    className="p-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No holidays
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Holidays;
