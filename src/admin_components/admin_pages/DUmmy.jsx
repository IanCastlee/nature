import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActions } from "../admin_molecules/RenderActions";
import useFormSubmit from "../../hooks/useFormSubmit";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import ViewRoomDetails from "../admin_molecules/ViewRoomDetails";
import { availableRoomColumns } from "../../constant/tableColumns";
import ModalForm_Room from "../admin_molecules/ModalForm_Room";
import ModalFormOtherDetails from "../admin_molecules/ModalFormOtherDetails";

function AvailableRoomPage() {
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

  // Other room detail form
  const [otherRoomDetailForm, setOtherRoomDetailForm] = useState({
    id: "",
    room_id: "",
    name: "",
    price: "",
  });

  // Room form
  const [form, setForm] = useState({
    room_id: "",
    room_name: "",
    category: "",
    price: "",
    capacity: "",
    duration: "",
    description: "",
    images: [], // ✅ multiple images
    photo_sphere: null,
  });

  //==============//
  //  DATA FETCH  //
  //==============//

  const { data, loading, refetch, error } = useGetData(
    `/admin/room.php?status=active`
  );

  console.log("DATA : ", data);

  const { data: roomCategoryData } = useGetData("/admin/room-category.php");
  const {
    data: amenitiesData,
    loading: loadingAmenities,
    refetch: refetchAmenity,
  } = useGetData(
    `/admin/amenities.php?room_id_get=${otherRoomDetailForm.room_id}`
  );
  const {
    data: inclusionData,
    loading: loadingInclusion,
    refetch: refetchInclusion,
  } = useGetData(
    `/admin/room-inclusion.php?room_id_get=${otherRoomDetailForm.room_id}`
  );
  const {
    data: extrasData,
    loading: loadingExtras,
    refetch: refetchExtras,
  } = useGetData(
    `/admin/room-extras.php?room_id_get=${otherRoomDetailForm.room_id}`
  );

  //================//
  // HANDLE CHANGE //
  //================//

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=================//
  // DATA FILTERING //
  //================//

  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item?.room_name?.toLowerCase().includes(search) ||
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
  //================//

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/room.php", () => {
    refetch();
    setShowForm(null);
    clearField();
  });

  const { submit: submitAmenity, loading: formLoadingAmenity } = useFormSubmit(
    "/admin/amenities.php",
    () => refetchAmenity()
  );

  const { submit: submitInclusion, loading: formLoadingInclusion } =
    useFormSubmit("/admin/room-inclusion.php", () => refetchInclusion());

  const { submit: submitExtras, loading: formLoadingExtras } = useFormSubmit(
    "/admin/room-extras.php",
    () => refetchExtras()
  );

  //=================//
  //  HANDLE SUBMIT //
  //================//

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    const isUpdate = showForm === "update_room";

    formData.append("action", isUpdate ? "update" : "create");
    formData.append("room_name", form.room_name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("capacity", form.capacity);
    formData.append("duration", form.duration);
    formData.append("description", form.description);

    // ✅ Multiple image upload
    if (form.images && form.images.length > 0) {
      form.images.forEach((file) => formData.append("images[]", file));
    }

    if (form.photo_sphere) formData.append("photo_sphere", form.photo_sphere);

    if (isUpdate) {
      formData.append("id", form.room_id);
    }

    submit(formData);
  };

  //================//
  //  HANDLE EDIT  //
  //================//

  const handleEdit = (item) => {
    setForm({
      room_id: item.room_id,
      room_name: item.room_name,
      category: item.category_id,
      price: item.price,
      capacity: item.capacity,
      duration: item.duration,
      description: item.description,
      images: [], // ✅ reset images array
      photo_sphere: null,
    });
    setShowForm("update_room");
  };

  //============================//
  //   HANDLE DELETE/INACTIVE  //
  //============================//

  const { setInactive, loading: inactiveLoading } = useSetInactive(
    "/admin/room.php",
    () => {
      refetch();
      setDeleteItem(null);
    }
  );

  //=====================//
  //  VIEW ROOM DETAILS  //
  //=====================//

  const viewRoomDetails = (item) => {
    setShowForm("view room");
    setViewRoomDetailsId(item);
  };

  const handleShowAddRoomModal = () => {
    setShowForm("add_room");
    clearField();
  };

  const clearField = () => {
    setForm({
      room_id: "",
      room_name: "",
      category: "",
      price: "",
      capacity: "",
      duration: "",
      description: "",
      images: [], // ✅ clear multiple images
      photo_sphere: null,
    });
  };

  return (
    <>
      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Available Rooms
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} room
            {filteredData.length !== 1 ? "s" : ""}
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={handleShowAddRoomModal}
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
            columns={availableRoomColumns}
            data={currentData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActions({
                item,
                setShowForm,
                onEdit: handleEdit,
                onSetInactive: (item) => setDeleteItem(item),
                onSetViewRoomDetails: (item) => viewRoomDetails(item),
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

      {/* Modal Form Room */}
      <ModalForm_Room
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        setForm={setForm}
        formLoading={formLoading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        roomCategoryData={roomCategoryData}
      />

      {/* Modal Form Other Details */}
      <ModalFormOtherDetails
        showForm={showForm}
        setShowForm={setShowForm}
        otherRoomDetailForm={otherRoomDetailForm}
        setOtherRoomDetailForm={setOtherRoomDetailForm}
        formLoadingAmenity={formLoadingAmenity}
        formLoadingInclusion={formLoadingInclusion}
        formLoadingExtras={formLoadingExtras}
      />

      {deleteItem?.room_name && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem.room_name}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Set as unavailable"
          label2="unavailable"
          label3="This will make this room unavailable, but not delete it permanently."
          onConfirm={() =>
            setInactive({
              id: deleteItem?.room_id,
              action: "set_inactive",
            })
          }
        />
      )}

      {showForm === "view room" && (
        <ViewRoomDetails roomId={viewRoomDetailsId} />
      )}
    </>
  );
}

export default AvailableRoomPage;
