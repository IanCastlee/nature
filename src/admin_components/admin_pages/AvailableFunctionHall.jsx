import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsFuntionHall } from "../admin_molecules/RenderActions";
import useFormSubmit from "../../hooks/useFormSubmit";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import ViewRoomDetails from "../admin_molecules/ViewRoomDetails";
import { availableFHColumns } from "../../constant/tableColumns";
import ModalFormFunctionHall from "../admin_molecules/ModalFormFunctionHall";

function AvailableFunctionHall() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [deleteItem, setDeleteItem] = useState(null);
  const [viewRoomDetailsId, setViewRoomDetailsId] = useState(null);

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
    "/admin/functionhall.php"
  );
  //fethc room categories
  const { data: roomCategoryData } = useGetData("/admin/room-category.php");

  console.log("FUNCIOTN HALL: ", data);
  console.log("FUNCIOTN HALLEE: ", error);
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
  } = useFormSubmit("/admin/functionhall.php", () => {
    refetch();
    setShowForm(null);
    clealAddModalField();
  });

  //=================//
  //  HANDLE SUBMIT //
  //===============//
  console.log("V", formError);
  //rooms
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const isUpdate = showForm === "update_fh";
    console.log("GGG", showForm);

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
      id: item.fh_id,
      name: item.name,
      price: item.price,
      capacity: item.capacity,
      duration: item.duration,
      description: item.description,
      image: null,
      photo_sphere: null,
    });

    setShowForm("update_fh");
  };

  //============================//
  //   HANDLE DELETE/INACTIVE //
  //=========================//

  //room
  const {
    setInactive,
    loading: inactiveLoading,
    error: inactiveError,
  } = useSetInactive("/admin/room.php", () => {
    refetch();
    setDeleteItem(null);
  });

  //=====================//
  //  view room details  //
  //=====================//
  const viewRoomDetails = (item) => {
    setShowForm("view room");
    setViewRoomDetailsId(item);
  };

  //handle add room
  const handleShowAddFH = () => {
    setShowForm("add_fh");
    clearField();
  };
  //clear add rool field
  const clearField = () => {
    setForm({
      fh_id: "",
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
  console.log(form);
  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Available Function Hall
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} function hall
            {filteredData.length > 0 ? "s" : ""}
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search room"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={handleShowAddFH}
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
            columns={availableFHColumns}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsFuntionHall({
                item,
                setShowForm,
                onEdit: handleEdit,
                onSetInactive: (item) => setDeleteItem(item),
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
      <ModalFormFunctionHall
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        setForm={setForm}
        formLoading={formLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        roomCategoryData={roomCategoryData}
      />

      {deleteItem?.room_name && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem.room_name}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => {
            setInactive({
              id: deleteItem?.room_id,
              action: "set_inactive",
            });
          }}
        />
      )}

      {showForm === "view room" && (
        <ViewRoomDetails roomId={viewRoomDetailsId} />
      )}
    </>
  );
}

export default AvailableFunctionHall;
