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
import { faqsColumn } from "../../constant/tableColumns";
import ModalFAQs from "../admin_molecules/ModalFAQs";
import ViewDetailsModal from "../admin_molecules/ViewDetailsModal";

function AdminFAQs() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewItem, setViewItem] = useState(null); // for viewing details
  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    id: "",
    question_en: "",
    question_tl: "",
    answer_en: "",
    answer_tl: "",
  });

  const { data, loading, refetch } = useGetData("/admin/faqs.php");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.question_en?.toLowerCase().includes(search) ||
        item?.question_tl?.toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const { submit, loading: formLoading } = useFormSubmit(
    "/admin/faqs.php",
    () => {
      refetch();
      setShowForm(null);
      clearField();
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const isUpdate = showForm === "update_faq";

    const formData = new FormData();
    formData.append("action", isUpdate ? "update" : "create");
    if (isUpdate) formData.append("id", form.id);

    formData.append("question_en", form.question_en);
    formData.append("question_tl", form.question_tl);
    formData.append("answer_en", form.answer_en);
    formData.append("answer_tl", form.answer_tl);

    submit(formData);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      question_en: item.question_en,
      question_tl: item.question_tl,
      answer_en: item.answer_en,
      answer_tl: item.answer_tl,
    });
    setShowForm("update_faq");
  };

  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/faqs.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  const clearField = () => {
    setForm({
      id: "",
      question_en: "",
      question_tl: "",
      answer_en: "",
      answer_tl: "",
    });
  };

  return (
    <>
      <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
        Frequently Asked Questions (FAQs)
      </h1>

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
            onClick={() => {
              clearField();
              setShowForm("add_faq");
            }}
            className="flex flex-row items-center h-[30px] bg-green-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
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
        columns={faqsColumn}
        data={currentData}
        loading={loading}
        noDataComponent={<NoData />}
        renderActions={(item) => (
          <div className="flex gap-2 flex-row justify-end items-center">
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
              className="bg-green-600 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
              title="View FAQ Details"
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

      <ModalFAQs
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
          name={deleteItem.question_en}
          loading={inactiveLoading}
          label="Yes, Delete"
          label2="Cancel"
          label3="This will permanently delete this record."
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => setInactive({ id: deleteItem.id, action: "delete" })}
        />
      )}

      {viewItem && (
        <ViewDetailsModal item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </>
  );
}

export default AdminFAQs;
