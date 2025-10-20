import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import TableRow from "../admin_molecules/TableRow";
import Pagination from "../admin_molecules/Pagination";
import Input from "../../components/atoms/Input";
import { motion } from "framer-motion";
import FileInput from "../../components/atoms/FileInput";
import useGetData from "../../hooks/useGetData";
import SearchInput from "../admin_atoms/SearchInput";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useForm } from "../../store/useRoomStore";
import NoData from "../../components/molecules/NoData";
import DeleteModal from "../../components/molecules/DeleteModal";
import useSetInactive from "../../hooks/useSetInactive";
import { roomCategories } from "../../constant/tableColumns";
import GenericTable from "../admin_molecules/GenericTable";

function RoomCategoriesPage() {
  const showRoomCategoryForm = useForm((state) => state.showForm);
  const setRoomCategoryForm = useForm((state) => state.setShowForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Fetch data
  const { data, loading, refetch, error } = useGetData(
    "/admin/room-category.php"
  );

  // Filtered data
  const filteredData =
    data?.filter((item) =>
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Submit Handler Hook
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/room-category.php", () => {
    refetch();
    setRoomCategoryForm(null);
    setCategory("");
    setImageFile(null);
    setEditData(null);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (showRoomCategoryForm === "update" && editData) {
      formData.append("id", editData.category_id);
      formData.append("action", "update");
    }

    submit(formData);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setCategory(item.category);
    setRoomCategoryForm("update");
  };

  const {
    setInactive,
    loading: inactiveLoading,
    error: inactiveError,
  } = useSetInactive("/admin/room-category.php", () => {
    refetch();
    setDeleteItem(null);
  });

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Room Categories
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} categor
            {filteredData.length !== 1 ? "ies" : "y"}
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />

            <Button
              handleClick={() => setRoomCategoryForm("add")}
              className="flex flex-row items-center h-[35px] bg-green-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
              label={
                <>
                  Add New{" "}
                  <icons.IoAddOutline className="text-lg text-white ml-1" />
                </>
              }
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="dark:bg-gray-900 bg-white">
                <th className="p-2 dark:text-gray-100 text-left font-medium">
                  Image
                </th>
                <th className="p-2 dark:text-gray-100 text-left font-medium">
                  Category
                </th>
                <th className="p-2 dark:text-gray-100 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && currentData.length > 0 ? (
                currentData.map((item) => (
                  <GenericTable
                    columns={roomCategories}
                    data={currentData}
                    loading={loading}
                    noDataComponent={<NoData />}
                    renderActions={(item) => {
                      return renderActions({
                        item,
                        showForm,
                        isNotAvailablePage,
                        onSetInactive: (item) => setDeleteItem(item),
                        onSetViewRoomDetails: (item) => viewRoomDetails(item),
                      });
                    }}
                  />
                ))
              ) : !loading && currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    <NoData />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modal Form */}
      {showRoomCategoryForm != null && (
        <div className="w-full h-screen fixed inset-0 bg-black/50 flex flex-row justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[700px] rounded-lg bg-white dark:bg-gray-800 p-4"
          >
            <div className="flex flex-row justify-between items-center mb-5">
              <h3 className="dark:text-white text-lg">
                {showRoomCategoryForm === "add"
                  ? "ADD ROOM CATEGORY"
                  : "UPDATE DETAILS"}
              </h3>
              <icons.MdOutlineClose
                onClick={() => {
                  setRoomCategoryForm(null);
                  setCategory("");
                  setImageFile(null);
                  setEditData(null);
                }}
                className="text-lg cursor-pointer dark:text-gray-100"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-3"
            >
              <div className="w-full flex flex-row gap-2">
                <Input
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <FileInput
                  isRequired={showRoomCategoryForm === "add" ? true : false}
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              {formError && (
                <p className="text-red-500 text-sm mt-2">{formError}</p>
              )}

              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  label={
                    formLoading
                      ? "Submitting..."
                      : showRoomCategoryForm === "update"
                      ? "Update"
                      : "Submit"
                  }
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => {
            setInactive({
              id: deleteItem?.category_id,
              action: "set_inactive",
            });
          }}
        />
      )}
    </>
  );
}

export default RoomCategoriesPage;
