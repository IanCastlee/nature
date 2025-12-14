import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import useFormSubmit from "../../hooks/useFormSubmit";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import {
  announcementColumn,
  termsAndConditionsColumn,
} from "../../constant/tableColumns"; // replace with your T&C columns
import ModalFormTermsAndConditions from "../admin_molecules/ModalFormTermsAndConditions";

function AdminTermsAndConditions() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    id: "",
    title: "",
    content: "",
  });

  // fetch T&C data
  const { data, loading, refetch, error } = useGetData(
    `/admin/terms_conditions.php?status=active`
  );

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // pagination
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // filter data
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.title?.toLowerCase().includes(search) ||
        item?.content?.toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // form submission
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/terms_conditions.php", () => {
    refetch();
    setShowForm(null);
    clearField();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const isUpdate = showForm === "update_terms";
    formData.append("action", isUpdate ? "update" : "create");
    formData.append("title", form.title);
    formData.append("content", form.content);
    if (isUpdate) formData.append("id", form.id);
    submit(formData);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      content: item.content,
    });
    setShowForm("update_terms");
  };

  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/terms_conditions.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  const handleAddTerms = () => {
    clearField();
    setShowForm("add_terms");
  };

  const clearField = () => {
    setForm({
      id: "",
      title: "",
      content: "",
    });
  };

  console.log("FDBHF: ", deleteItem?.id);

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Terms and Conditions
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} record
            {filteredData.length > 1 ? "s" : ""}
          </span>

          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleAddTerms}
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
          <GenericTable
            columns={termsAndConditionsColumn}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => (
              <div className="flex gap-2">
                <Button
                  label={<icons.FaRegEdit />}
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white text-lg px-2 py-1 rounded"
                />
                <Button
                  label={<icons.MdDeleteForever />}
                  onClick={() => setDeleteItem(item)}
                  className="bg-red-500 text-white text-lg px-2 py-1 rounded"
                />
              </div>
            )}
          />
        </div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <ModalFormTermsAndConditions
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        title="Terms and Conditions"
      />

      {deleteItem?.id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.question_en}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Delete"
          label2="Cancel"
          label3="This will permanently delete this record."
          onConfirm={() =>
            setInactive({ id: deleteItem?.id, action: "delete" })
          }
        />
      )}
    </>
  );
}

export default AdminTermsAndConditions;
