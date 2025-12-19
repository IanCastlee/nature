import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsCottage } from "../admin_molecules/RenderActions";
import useFormSubmit from "../../hooks/useFormSubmit";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { availableCottageColumns } from "../../constant/tableColumns";
import ModalFormCottage from "../admin_molecules/ModalFormCottage";
import ViewCottageDetails from "../admin_molecules/ViewCottageDetails";

function AvailableCottage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [deleteItem, setDeleteItem] = useState(null);
  const [viewCottageDetailsId, setViewCottageDetailsId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //   FORMS      //
  //==============//

  //room form
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    capacity: "",
    duration: "",
    description: "",
    image: null,
    photo_sphere: null,
  });

  //==============//
  //  DATA FETCH  //
  //==============//

  // fetch room data
  const { data, loading, refetch, error } = useGetData(
    `/admin/cottage.php?status=active`
  );

  console.log("____: ", data);

  //================//
  // HANDLE CHANGE //
  //==============//

  //handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handlePageChange
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=================//
  // DATA FILTERING //
  //===============//

  //Filtered data
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const search = searchTerm.toLowerCase();
      return (
        item?.name?.toLowerCase().includes(search) ||
        item?.price?.toString().includes(search) ||
        item?.capacity?.toString().includes(search) ||
        item?.duration?.toString().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //================//
  //   POST HOOKS  //
  //==============//

  //room
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/cottage.php", () => {
    refetch();
    setShowForm(null);
    clealAddModalField();
  });

  //=================//
  //  HANDLE SUBMIT //
  //===============//
  //rooms
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const isUpdate = showForm === "update_cottage";

    formData.append("action", isUpdate ? "update" : "create");
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("capacity", form.capacity);
    formData.append("duration", form.duration);
    formData.append("description", form.description);

    if (form.image) formData.append("image", form.image);
    if (form.photo_sphere) formData.append("photo_sphere", form.photo_sphere);

    if (isUpdate) {
      formData.append("id", form.id);
    }

    submit(formData);
  };

  //=================//
  //  HANDLE EDIT //
  //===============//

  //room
  const handleEdit = (item) => {
    setForm({
      id: item.cottage_id,
      name: item.name,
      price: item.price,
      capacity: item.capacity,
      duration: item.duration,
      description: item.description,
      image: null,
      photo_sphere: null,
    });

    setShowForm("update_cottage");
  };

  //============================//
  //   HANDLE DELETE/INACTIVE //
  //=========================//

  //room
  const {
    setInactive,
    loading: inactiveLoading,
    error: inactiveError,
  } = useSetInactive("/admin/cottage.php", () => {
    refetch();
    setDeleteItem(null);
  });

  //=====================//
  //  view room details  //
  //=====================//

  const viewCottageDetails = (item) => {
    setShowForm("view cottage");
    setViewCottageDetailsId(item);
  };

  //handle add room
  const handleShowAddCottage = () => {
    setShowForm("add_cottage");
    clearField();
  };
  //clear add rool field
  const clearField = () => {
    setForm({
      cottage_id: "",
      name: "",
      category: "",
      price: "",
      capacity: "",
      duration: "",
      description: "",
      image: null,
      photo_sphere: null,
    });
  };

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Available Cottage
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} cottage
            {filteredData.length > 1 ? "s" : ""}
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={handleShowAddCottage}
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
            columns={availableCottageColumns}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsCottage({
                item,
                setShowForm,
                onEdit: handleEdit,
                onSetInactive: (item) => setDeleteItem(item),
                onSetViewCottageDetails: (item) => viewCottageDetails(item),
              });
            }}
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

      {/* Modal Form Room */}
      <ModalFormCottage
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        setForm={setForm}
        formLoading={formLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      {deleteItem?.cottage_id && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem?.name}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Set as not active"
          label2="not-active"
          label3="This action will mark this cottage as unavailable without permanently deleting it."
          onConfirm={() => {
            setInactive({
              id: deleteItem?.cottage_id,
              action: "set_inactive",
            });
          }}
        />
      )}

      {showForm === "view cottage" && (
        <ViewCottageDetails cottageId={viewCottageDetailsId} />
      )}
    </>
  );
}

export default AvailableCottage;
