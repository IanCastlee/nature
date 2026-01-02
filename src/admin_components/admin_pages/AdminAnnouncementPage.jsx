import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsAnnouncement } from "../admin_molecules/RenderActions";
import useFormSubmit from "../../hooks/useFormSubmit";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { announcementColumn } from "../../constant/tableColumns";
import ModalFormAnnouncement from "../admin_molecules/ModalFormAnnouncement";

function AdminAnnouncementPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("DLETE : ", deleteItem);

  // form data
  const [form, setForm] = useState({
    id: "",
    title: "",
    message: "",
  });

  // fetch data
  const { data, loading, refetch, error } = useGetData(
    `/admin/announcement.php?status=active`
  );

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        item?.message?.toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // form submit hook
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/announcement.php", () => {
    refetch();
    setShowForm(null);
    clearField();
  });

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const isUpdate = showForm === "update_announcement";
    formData.append("action", isUpdate ? "update" : "create");
    formData.append("title", form.title);
    formData.append("message", form.message);
    if (isUpdate) formData.append("id", form.id);
    submit(formData);
  };

  // handle edit
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      message: item.message,
    });
    setShowForm("update_announcement");
  };

  // handle set inactive
  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/announcement.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  const handleAddAnnouncement = () => {
    clearField();
    setShowForm("add_announcement");
  };

  const clearField = () => {
    setForm({
      id: "",
      title: "",
      message: "",
    });
  };

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Announcements
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} announcement
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
              onClick={handleAddAnnouncement}
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
            columns={announcementColumn}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsAnnouncement({
                item,
                onEdit: handleEdit,
                onSetInactive: () => setDeleteItem(item),
              })
            }
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

      <ModalFormAnnouncement
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
      />

      {deleteItem?.id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.title}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Set as not active"
          label2="not-active"
          label3="This action will mark the announcement as not-active without deleting it permanently."
          onConfirm={() =>
            setInactive({
              id: deleteItem?.id,
              action: "set_inactive",
            })
          }
        />
      )}
    </>
  );
}

export default AdminAnnouncementPage;
