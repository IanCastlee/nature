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

  console.log("ROOMS: ", availableRoomColumns);

  //==============//
  //   FORMS      //
  //==============//

  //other roomDetail form
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

  // fetch room data
  const { data, loading, refetch, error } = useGetData(
    `/admin/room.php?status=active`
  );
  console.log("DATA : ", data);

  //fethc room categories
  const { data: roomCategoryData } = useGetData("/admin/room-category.php");

  //fetch amenitiesData
  const {
    data: amenitiesData,
    loading: loadingAmenities,
    refetch: refetchAmenity,
    error: errorAmenity,
  } = useGetData(
    `/admin/amenities.php?room_id_get=${otherRoomDetailForm.room_id}`
  );

  //fetch inclusionData
  const {
    data: inclusionData,
    loading: loadingInclusion,
    refetch: refetchInclusion,
    error: errorInclusion,
  } = useGetData(
    `/admin/room-inclusion.php?room_id_get=${otherRoomDetailForm.room_id}`
  );

  //fetch  extrasData
  const {
    data: extrasData,
    loading: loadingExtras,
    refetch: refetchExtras,
    error: errorExtras,
  } = useGetData(
    `/admin/room-extras.php?room_id_get=${otherRoomDetailForm.room_id}`
  );

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
  //==============//

  //room
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/room.php", () => {
    window.location.reload(); // reload the page

    refetch();
    setShowForm(null);
    clealAddModalField();

    setPreviews([]); // clear previews
    setForm((prev) => ({ ...prev, images: [] })); // reset images in form
  });

  //amenity
  const {
    submit: submitAmenity,
    loading: formLoadingAmenity,
    error: formErrorAmenity,
  } = useFormSubmit("/admin/amenities.php", () => {
    refetchAmenity();
    // clearField2();
  });

  //inclusion
  const {
    submit: submitInclusion,
    loading: formLoadingInclusion,
    error: formErrorInclusion,
  } = useFormSubmit("/admin/room-inclusion.php", () => {
    refetchInclusion();
    // clearField2();
  });

  //extras
  const {
    submit: submitExtras,
    loading: formLoadingExtras,
    error: formErrorExtras,
  } = useFormSubmit("/admin/room-extras.php", () => {
    refetchExtras();
    //clearField2();
  });
  console.log("formErrorExtras ____", formErrorExtras);
  //=================//
  //  HANDLE SUBMIT //
  //===============//

  //rooms
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

  //amenity
  const handleSubmitAmenity = (e) => {
    e.preventDefault();

    const formData = new FormData();

    const isUpdate = showForm === "update amenity";

    formData.append("action", isUpdate ? "update" : "create");
    formData.append("room_id", otherRoomDetailForm.room_id);
    formData.append("name", otherRoomDetailForm.name);

    if (isUpdate) {
      formData.append("id", otherRoomDetailForm.id);
    }

    submitAmenity(formData);
  };
  const addAmenity = (item) => {
    setOtherRoomDetailForm({
      room_id: item,
    });
    setShowForm("add amenity");
  };

  //inclusion
  const handleSubmitInclusion = (e) => {
    e.preventDefault();

    const formData = new FormData();

    const isUpdate = showForm === "update inclusion";

    formData.append("action", isUpdate ? "update" : "create");
    formData.append("room_id", otherRoomDetailForm.room_id);
    formData.append("name", otherRoomDetailForm.name);

    if (isUpdate) {
      formData.append("id", otherRoomDetailForm.id);
    }

    submitInclusion(formData);
  };
  const addRoomInclusions = (item) => {
    setOtherRoomDetailForm({
      room_id: item,
    });
    setShowForm("add inclusion");
  };

  //extras
  const handleSubmitExtras = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const isUpdate = showForm === "update extras";

    formData.append("action", isUpdate ? "update" : "create");
    formData.append("room_id", otherRoomDetailForm.room_id);
    formData.append("name", otherRoomDetailForm.name);
    formData.append("price", otherRoomDetailForm.price);

    if (isUpdate) {
      formData.append("id", otherRoomDetailForm.id);
    }

    submitExtras(formData);
  };
  const addRoomExtras = (item) => {
    setOtherRoomDetailForm({
      room_id: item,
    });
    setShowForm("add extras");
  };

  //=================//
  //  HANDLE EDIT //
  //===============//

  //room
  const handleEdit = (item) => {
    setForm({
      room_id: item.room_id,
      room_name: item.room_name,
      category: item.category_id,
      price: item.price,
      capacity: item.capacity,
      duration: item.duration,
      description: item.description,
      image: null,
    });

    setShowForm("update_room");
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

  //amenity
  const {
    setInactive: deleteAmenity,
    loading: deleteAmenityLoading,
    error: deleteAmenityError,
  } = useSetInactive("/admin/amenities.php", () => {
    refetchAmenity();
    setDeleteItem(null);
  });

  //inclusion
  const {
    setInactive: deleteInclusion,
    loading: deleteInclusionLoading,
    error: deleteInclusionError,
  } = useSetInactive("/admin/room-inclusion.php", () => {
    refetchInclusion();
    setDeleteItem(null);
  });

  //extra
  const {
    setInactive: deleteExtra,
    loading: deleteExtraLoading,
    error: deleteExtraError,
  } = useSetInactive("/admin/room-extras.php", () => {
    refetchExtras();
    setDeleteItem(null);
  });

  //==============//
  //  COMPUTING  //
  //============//

  //computedData
  const computedData =
    showForm === "add amenity" || showForm === "update amenity"
      ? amenitiesData || []
      : showForm === "add inclusion" || showForm === "update inclusion"
      ? inclusionData || []
      : showForm === "add extras" || showForm === "update extras"
      ? extrasData || []
      : [];

  //computedFormLoading_Other
  const computedFormLoading_Other =
    showForm === "add amenity" || showForm === "update amenity"
      ? loadingAmenities
      : showForm === "add inclusion" || showForm === "update inclusion"
      ? loadingInclusion
      : showForm === "add extras" || showForm === "update extras"
      ? loadingExtras
      : false;

  //computed error
  const computedError =
    showForm === "add amenity"
      ? formErrorAmenity
      : showForm === "add inclusion"
      ? formErrorInclusion
      : showForm === "add extras"
      ? formErrorExtras
      : false;

  //computed delete
  const safeShowForm = showForm || "";

  const computedDelete = safeShowForm.includes("amenity")
    ? deleteAmenity
    : safeShowForm.includes("inclusion")
    ? deleteInclusion
    : safeShowForm.includes("extras")
    ? deleteExtra
    : null;

  //=====================//
  //  view room details  //
  //=====================//
  const viewRoomDetails = (item) => {
    setShowForm("view room");
    setViewRoomDetailsId(item);
  };

  //handle add room
  const handleShowAddRoomModal = () => {
    setShowForm("add_room");
    clearField();
  };
  //clear add rool field
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
            renderActions={(item) => {
              return renderActions({
                item,
                setShowForm,
                onEdit: handleEdit,
                onSetInactive: (item) => setDeleteItem(item),
                onSetAddAmenity: (item) => addAmenity(item),
                onSetAddRoomInclusions: (item) => addRoomInclusions(item),
                onSetAddExtras: (item) => addRoomExtras(item),
                onSetViewRoomDetails: (item) => viewRoomDetails(item),
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

      {/*  Modal Form OtherDetails*/}
      <ModalFormOtherDetails
        showForm={showForm}
        setShowForm={setShowForm}
        otherRoomDetailForm={otherRoomDetailForm}
        setOtherRoomDetailForm={setOtherRoomDetailForm}
        formError={computedError}
        formLoading={computedFormLoading_Other}
        formLoadingAmenity={formLoadingAmenity}
        handleSubmitAmenity={handleSubmitAmenity}
        handleSubmitInclusion={handleSubmitInclusion}
        handleSubmitExtras={handleSubmitExtras}
        setDeleteItem={setDeleteItem}
        deleteItem={deleteItem}
        computedDelete={computedDelete}
        computedData={computedData}
      />

      {deleteItem?.room_name && (
        <DeleteModal
          item={deleteItem}
          name={deleteItem.room_name}
          loading={inactiveLoading}
          onCancel={() => setDeleteItem(null)}
          label="Yes, Set as unavailable"
          label2="unavailable"
          label3=" This will make this room unavailable, but not delete it
            permanently."
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

export default AvailableRoomPage;
