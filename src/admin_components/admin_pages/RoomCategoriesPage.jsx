import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
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
import {
  renderActions,
  renderActionsRoomCategories,
} from "../admin_molecules/RenderActions";

function RoomCategoriesPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { data, loading, refetch, error } = useGetData(
    "/admin/room-category.php"
  );

  const filteredData =
    data?.filter((item) =>
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/room-category.php", () => {
    refetch();
    setCategory("");
    setImageFile(null);
    setEditData(null);
    setShowForm(null); // ✅ CLOSE MODAL
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);

    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (showForm === "update_room_category" && editData) {
      formData.append("id", editData.category_id);
      formData.append("action", "update");
    }
    submit(formData);
  };

  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/room-category.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  //handle add room
  const handleShowAddCategories = () => {
    setShowForm("add_room_category");
    clearField();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setCategory(item.category);
    setImageFile(null);
    setShowForm("update_room_category");
  };

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

        <div className="w-full flex justify-between mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} categor
            {filteredData.length !== 1 ? "ies" : "y"}
          </span>

          <div className="flex gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={handleShowAddCategories}
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
          {!loading && currentData.length > 0 ? (
            <GenericTable
              columns={roomCategories}
              data={currentData}
              loading={loading}
              noDataComponent={<NoData />}
              renderActions={(item) =>
                renderActionsRoomCategories({
                  item,
                  setShowForm,
                  onEdit: handleEdit,
                  onSetInactive: (item) => setDeleteItem(item),
                  // onSetViewCottageDetails: (item) => viewCottageDetails(item),
                })
              }
            />
          ) : !loading && currentData.length === 0 ? (
            <NoData />
          ) : null}
        </div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* FORM MODAL */}
      {(showForm === "add_room_category" ||
        showForm === "update_room_category") && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-[700px] bg-white dark:bg-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between mb-5">
              <h3 className="dark:text-white text-lg">
                {showForm === "add_room_category"
                  ? "ADD ROOM CATEGORY"
                  : "UPDATE DETAILS"}
              </h3>
              <icons.MdOutlineClose
                onClick={() => {
                  setShowForm(null);
                  setCategory("");
                  setImageFile(null);
                  setEditData(null);
                }}
                className="cursor-pointer dark:text-gray-100"
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <FileInput
                  label="Room Category thumbnail"
                  isRequired={showForm === "add_room_category"}
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              {formError && (
                <p className="text-red-500 text-sm mt-2">{formError}</p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  label={
                    formLoading
                      ? "Submitting..."
                      : showForm === "update_room_category"
                      ? "Update"
                      : "Submit"
                  }
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {deleteItem?.category_id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.category}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Set as not active"
          label2="not-active"
          label3="This action will mark the category as unavailable without deleting it permanently."
          onConfirm={() =>
            setInactive({
              id: deleteItem?.category_id,
              action: "set_inactive",
            })
          }
        />
      )}

      {deleteItem?.cottage_id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.cottage_id}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Set as not active"
          label2="not-active"
          label3="This action will mark the category as unavailable without deleting it permanently."
          onConfirm={() => {
            setInactive({
              id: deleteItem?.cottage_id,
              action: "set_inactive",
            });
          }}
        />
      )}
    </>
  );
}

export default RoomCategoriesPage;
