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
import ModalActivitiesForm from "../admin_molecules/ModalActivitiesForm";
import { availableActivitiesColumns } from "../../constant/tableColumns";

function AdminActivities() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [deleteItem, setDeleteItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    image: null,
  });

  const { data, loading, refetch, error } = useGetData(`/admin/activities.php`);

  const { submit, loading: formLoading } = useFormSubmit(
    "/admin/activities.php",
    () => {
      refetch();
      setShowForm(null);
      setForm({ id: "", title: "", subtitle: "", image: null });
    }
  );

  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/activities.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(s) ||
        item.subtitle.toLowerCase().includes(s)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleAdd = () => {
    setForm({ id: "", title: "", subtitle: "", image: null });
    setShowForm("add_activity");
  };

  const handleEdit = (activity) => {
    setForm({
      id: activity.id,
      title: activity.title,
      subtitle: activity.subtitle,
      image: null,
    });
    setShowForm("update_activity");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const isUpdate = showForm === "update_activity";

    formData.append("action", isUpdate ? "update" : "create");
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (isUpdate) {
      formData.append("id", form.id);
    }

    submit(formData);
  };

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Admin Activities
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

        <div className="w-full flex justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} activity
            {filteredData.length > 1 ? "ies" : ""}
          </span>

          <div className="flex gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={handleAdd}
              className="flex items-center h-[35px] bg-green-600 text-white text-xs font-medium px-2 rounded-md whitespace-nowrap"
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
            columns={availableActivitiesColumns}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => (
              <div className="flex gap-2 flex-row justify-end">
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
                  title="Edit"
                >
                  <icons.FaRegEdit />
                </button>

                {/* Delete / Set Inactive Button */}
                <button
                  onClick={() => setDeleteItem(item)}
                  className="bg-red-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
                  title="Delete"
                >
                  <icons.MdDeleteOutline className="text-white" />
                </button>
              </div>
            )}
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {showForm && (
        <ModalActivitiesForm
          showForm={showForm}
          setShowForm={setShowForm}
          form={form}
          setForm={setForm}
          formLoading={formLoading}
          handleSubmit={handleSubmit}
        />
      )}

      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem.title}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Delete"
          label2="delete"
          label3="This action will permanently delete this activity."
          onConfirm={() => setInactive({ id: deleteItem.id, action: "delete" })}
        />
      )}
    </>
  );
}

export default AdminActivities;
