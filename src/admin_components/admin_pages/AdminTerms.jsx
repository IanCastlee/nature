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
import { termsColumn } from "../../constant/tableColumns";
import ModalTerms from "../admin_molecules/ModalTerms";
import ViewTermsModal from "../admin_molecules/ViewTermsModal";

function AdminTerms() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);
  const [viewItem, setViewItem] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    id: "",
    title_en: "",
    title_tl: "",
    content_en: "",
    content_tl: "",
  });

  const { data, loading, refetch } = useGetData("/admin/terms.php");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.title_en?.toLowerCase().includes(search) ||
        item?.title_tl?.toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const { submit, loading: formLoading } = useFormSubmit(
    "/admin/terms.php",
    () => {
      refetch();
      setShowForm(null);
      clearField();
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const isUpdate = showForm === "update_term";

    const formData = new FormData();
    formData.append("action", isUpdate ? "update" : "create");
    if (isUpdate) formData.append("id", form.id);

    formData.append("title_en", form.title_en);
    formData.append("title_tl", form.title_tl);
    formData.append("content_en", form.content_en);
    formData.append("content_tl", form.content_tl);

    submit(formData);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title_en: item.title_en,
      title_tl: item.title_tl,
      content_en: item.content_en,
      content_tl: item.content_tl,
    });
    setShowForm("update_term");
  };

  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/terms.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  const clearField = () => {
    setForm({
      id: "",
      title_en: "",
      title_tl: "",
      content_en: "",
      content_tl: "",
    });
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
        Terms & Conditions
      </h1>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-full flex justify-between items-center mb-2">
        <span className="dark:text-gray-100 text-xs font-medium">
          Showing {filteredData.length} record{filteredData.length > 1 && "s"}
        </span>

        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={() => {
              clearField();
              setShowForm("add_term");
            }}
            className="flex items-center h-[30px] bg-green-600 text-white text-xs font-medium px-2 rounded-md"
            label={
              <>
                Add New{" "}
                <icons.IoAddOutline className="text-lg text-white ml-1" />
              </>
            }
          />
        </div>
      </div>

      <GenericTable
        columns={termsColumn}
        data={currentData}
        loading={loading}
        noDataComponent={<NoData />}
        renderActions={(item) => (
          <div className="flex gap-2 justify-end items-center">
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
            <Button
              label={<icons.AiOutlineInfoCircle />}
              onClick={() => setViewItem(item)}
              className="bg-green-500 text-white text-lg px-2 py-1 rounded"
            />
          </div>
        )}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ModalTerms
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
      />

      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem.title_en}
          loading={inactiveLoading}
          label="Yes, Delete"
          label2="Cancel"
          label3="This will permanently delete this record."
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => setInactive({ id: deleteItem.id, action: "delete" })}
        />
      )}

      {viewItem && (
        <ViewTermsModal item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </>
  );
}

export default AdminTerms;
