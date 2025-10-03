import React, { useState } from "react";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import Pagination from "../admin_molecules/Pagination";
import Input from "../../components/atoms/Input";
import { motion } from "framer-motion";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import CustomDropDownn from "../../components/atoms/CustomDropDownn";
import FileInput from "../../components/atoms/FileInput";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { uploadUrl } from "../../utils/fileURL";
import { renderActions } from "../admin_molecules/RenderActions";
import useFormSubmit from "../../hooks/useFormSubmit";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import ViewRoomDetails from "../admin_molecules/ViewRoomDetails";

const columns = [
  {
    title: "Image",
    key: "image",
    render: (item) => (
      <img
        src={`${uploadUrl.uploadurl}/rooms/${item.image}`}
        alt={item.room_name}
        className="w-10 h-10 rounded shadow-sm"
      />
    ),
  },
  {
    title: "Room Name",
    key: "room_name",
  },
  {
    title: "Price",
    key: "price",
  },
  {
    title: "Capacity",
    key: "capacity",
  },
  {
    title: "Duration",
    key: "duration",
  },
];

function AvailableRoomPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [deleteItem, setDeleteItem] = useState(null);
  const [viewRoomDetailsId, setViewRoomDetailsId] = useState(null);

  //extras
  const [amenityForm, setAmenityForm] = useState({
    amenity_id: "",
    room_id: "",
    amenity: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    room_name: "",
    category: "",
    price: "",
    capacity: "",
    duration: "",
    image: null,
  });

  // Fetch data
  const { data, loading, refetch, error } = useGetData("/admin/room.php");
  const { data: roomCategoryData } = useGetData("/admin/room-category.php");

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

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/admin/room.php", () => {
    refetch();
    setShowForm(null);
    setForm({
      room_id: "",
      room_name: "",
      category: "",
      price: "",
      capacity: "",
      duration: "",
      image: null,
    });
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("room_name", form.room_name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("capacity", form.capacity);
    formData.append("duration", form.duration);
    if (form.image) formData.append("image", form.image);

    if (showForm === "update_room") {
      formData.append("action", "update");
      formData.append("id", form.room_id);
      formData.append("room_name", form.room_name);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("capacity", form.capacity);
      formData.append("duration", form.duration);
    }

    submit(formData);
  };

  if (formError) console.error("Error: ", formError);

  const handleEdit = (item) => {
    setForm({
      room_id: item.room_id,
      room_name: item.room_name,
      category: item.category_id,
      price: item.price,
      capacity: item.capacity,
      duration: item.duration,
      image: null,
    });

    setShowForm("update_room");
  };

  const {
    setInactive,
    loading: inactiveLoading,
    error: inactiveError,
  } = useSetInactive("/admin/room.php", () => {
    refetch();
    setDeleteItem(null);
  });

  //amenity
  const addAmenity = (item) => {
    setAmenityForm({
      room_id: item,
    });
    setShowForm("add amenity");
  };

  const {
    submit: submitAmenity,
    loading: formLoadingAmenity,
    error: formErrorAmenity,
  } = useFormSubmit("/admin/amenities.php", () => {
    refetch();
    setShowForm(null);
    setAmenityForm({
      amenity_id: "",
      room_id: "",
      amenity: "",
    });
  });

  const handleSubmitAmenity = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("room_id", amenityForm.room_id);
    formData.append("amenity", amenityForm.amenity);

    // if (showForm === "update_room") {
    //   formData.append("action", "update");
    //   formData.append("id", form.room_id);
    //   formData.append("room_name", form.room_name);
    //   formData.append("price", form.price);
    //   formData.append("category", form.category);
    //   formData.append("capacity", form.capacity);
    //   formData.append("duration", form.duration);
    // }

    submitAmenity(formData);
  };

  //Room Inclusions
  const addRoomInclusions = (item) => {
    setAmenityForm({
      room_id: item,
    });
    setShowForm("add inclusion");
  };

  const {
    submit: submitInclusion,
    loading: formLoadingInclusion,
    error: formErrorInclusion,
  } = useFormSubmit("/admin/room-inclusion.php", () => {
    refetch();
    setShowForm(null);
    setAmenityForm({
      amenity_id: "",
      room_id: "",
      amenity: "",
    });
  });

  console.log("formErrorInclusion : ", formErrorInclusion);

  const handleSubmitInclusion = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("room_id", amenityForm.room_id);
    formData.append("amenity", amenityForm.amenity);

    // if (showForm === "update_room") {
    //   formData.append("action", "update");
    //   formData.append("id", form.room_id);
    //   formData.append("room_name", form.room_name);
    //   formData.append("price", form.price);
    //   formData.append("category", form.category);
    //   formData.append("capacity", form.capacity);
    //   formData.append("duration", form.duration);
    // }

    submitInclusion(formData);
  };

  //view Room Details
  const viewRoomDetails = (item) => {
    setShowForm("view room");
    console.log("SDFHJSHJHHFJSHDH", item);
    setViewRoomDetailsId(item);
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

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} categor
            {filteredData.length !== 1 ? "ies" : "y"}
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search room"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />

            <Button
              onClick={() => setShowForm("add_room")}
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
            columns={columns}
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

      {(showForm === "add_room" || showForm === "update_room") && (
        <div className="w-full h-screen fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[700px] rounded-lg bg-white dark:bg-gray-800 p-4"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="dark:text-white text-lg">
                {showForm === "add_room"
                  ? "ADD ROOM"
                  : showForm === "update_room"
                  ? "UPDATE ROOM"
                  : ""}
              </h3>
              <icons.MdOutlineClose
                onClick={() => setShowForm(null)}
                className="text-lg cursor-pointer dark:text-gray-100"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-3"
            >
              <div className="flex gap-2">
                <CustomDropDownn
                  label="Select Category"
                  options={roomCategoryData}
                  value={form.category}
                  onChange={(selectedId) =>
                    setForm((prev) => ({ ...prev, category: selectedId }))
                  }
                />
                <FileInput
                  isRequired={showForm === "add_room" ? true : false}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image: e.target.files[0] }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Input
                  label="Room Name"
                  name="room_name"
                  value={form.room_name}
                  onChange={handleChange}
                />
                <Input
                  label="Price"
                  name="price"
                  isNumber
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  label="Capacity"
                  name="capacity"
                  isNumber
                  value={form.capacity}
                  onChange={handleChange}
                />
                <Input
                  label="Duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  label={
                    formLoading
                      ? "Submitting..."
                      : showForm === "update_room"
                      ? "Update"
                      : "Submit"
                  }
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {(showForm === "add amenity" || showForm === "add inclusion") && (
        <div className="w-full h-screen fixed inset-0 bg-black/50 flex flex-row justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[500px] rounded-lg bg-white dark:bg-gray-800 p-4"
          >
            <div className="flex flex-row justify-between items-center mb-5">
              <h3 className="dark:text-white text-lg">
                {showForm && showForm.toUpperCase()}
              </h3>
              <icons.MdOutlineClose
                onClick={() => setShowForm(null)}
                className="text-lg cursor-pointer dark:text-gray-100"
              />
            </div>
            <form
              onSubmit={
                showForm === "add amenity"
                  ? handleSubmitAmenity
                  : showForm === "add inclusion"
                  ? handleSubmitInclusion
                  : ""
              }
              className="w-full flex flex-col gap-3"
            >
              <div className="w-full flex flex-row gap-2">
                <Input
                  label="Amenity"
                  name="amenity"
                  value={amenityForm.amenity}
                  onChange={(e) =>
                    setAmenityForm((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  label={
                    formLoadingAmenity
                      ? "Submitting..."
                      : showForm === "update amenity"
                      ? "Update"
                      : "Submit"
                  }
                />
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {deleteItem && (
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

export default AvailableRoomPage;
