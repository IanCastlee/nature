// RoomDetailFormModal.jsx
import { motion } from "framer-motion";
import Input from "../../components/atoms/Input";
import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";
import GenericTable from "./GenericTable";
import { getOtherRoomDetails } from "../../constant/tableColumns";
import NoData from "../../components/molecules/NoData";
import { renderActionsRoomOtherDeatails } from "./RenderActions";
import DeleteModal from "../../components/molecules/DeleteModal";

export default function ModalFormOtherDetails({
  setDeleteItem,
  deleteItem,
  showForm,
  setShowForm,
  formError,
  otherRoomDetailForm,
  setOtherRoomDetailForm,
  formLoading,
  // formLoadingAmenity,
  handleSubmitAmenity,
  handleSubmitInclusion,
  handleSubmitExtras,

  computedDelete,
  deleteAmenityLoading,
  deleteAmenityError,

  computedData,
}) {
  if (
    showForm !== "add amenity" &&
    showForm !== "update amenity" &&
    showForm !== "add inclusion" &&
    showForm !== "update inclusion" &&
    showForm !== "add extras" &&
    showForm !== "update extras"
  )
    return null;

  // Determine which submit handler to use based on showForm value
  const getSubmitHandler = () => {
    if (showForm === "add amenity" || showForm === "update amenity")
      return handleSubmitAmenity;
    if (showForm === "add inclusion" || showForm === "update inclusion")
      return handleSubmitInclusion;
    if (showForm === "add extras" || showForm === "update extras")
      return handleSubmitExtras;
    return null;
  };

  // Determine label text
  const getLabel = () => {
    if (showForm === "add amenity") return "Amenity";
    if (showForm === "add inclusion") return "Inclusion";
    if (showForm === "add extras") return "Extra";
    return "";
  };

  const handleEditAmenity = (item) => {
    setOtherRoomDetailForm({
      id: item.amenity_id,
      room_id: item.room_id,
      name: item.amenities,
    });
    setShowForm("update amenity");
  };

  const handleEditInclusion = (item) => {
    setOtherRoomDetailForm({
      id: item.inclusion_id,
      room_id: item.room_id,
      name: item.inclusion,
    });
    setShowForm("update inclusion");
  };
  const handleEditExtra = (item) => {
    setOtherRoomDetailForm({
      id: item.extra_id,
      room_id: item.room_id,
      name: item.extras,
    });
    setShowForm("update extras");
  };

  const handleEdit = (item) => {
    if (showForm.includes("amenity")) {
      handleEditAmenity(item);
    } else if (showForm.includes("inclusion")) {
      handleEditInclusion(item);
    } else if (showForm.includes("extras")) {
      handleEditExtra(item);
    }
  };

  const setDelete = (item) => {
    setDeleteItem(item);
  };

  return (
    <>
      <div className="w-full h-screen fixed inset-0 bg-black/50 flex flex-row justify-center items-center z-50">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-[500px] rounded-lg bg-gray-100 dark:bg-gray-800 p-4"
        >
          <div className="flex flex-row justify-between items-center mb-5">
            <h3 className="dark:text-white text-sm font-semibold">
              {showForm.split(" ").slice(1).join(" ").toUpperCase()}
            </h3>
            <icons.MdOutlineClose
              onClick={() => setShowForm(null)}
              className="text-lg cursor-pointer dark:text-gray-100"
            />
          </div>
          <form
            onSubmit={getSubmitHandler()}
            className="w-full flex flex-col gap-1 mb-10"
          >
            {formError && (
              <div className="bg-red-100 dark:bg-gray-800 text-red-700 px-4 py-2 rounded text-sm mb-3">
                <p className="text-red-600 text-xs text-center">{formError}</p>
              </div>
            )}
            <div className="w-full flex flex-row gap-2">
              <Input
                label={getLabel()}
                name="name"
                value={otherRoomDetailForm.name || ""}
                onChange={(e) =>
                  setOtherRoomDetailForm((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                label={
                  formLoading
                    ? "Submitting..."
                    : showForm === "update amenity" ||
                      showForm === "update inclusion" ||
                      showForm === "update extras"
                    ? "Update"
                    : "Add"
                }
              />
            </div>
          </form>

          <GenericTable
            columns={getOtherRoomDetails(showForm)}
            data={computedData}
            loading={formLoading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsRoomOtherDeatails({
                item,
                onEdit: () => handleEdit(item),
                onSetDelete: () => setDelete(item),
              });
            }}
          />
        </motion.div>
      </div>

      {(deleteItem?.amenity_id ||
        deleteItem?.inclusion_id ||
        deleteItem?.extra_id) && (
        <DeleteModal
          item={deleteItem}
          name="GG"
          loading={deleteAmenityLoading}
          onCancel={() => setDeleteItem(null)}
          onConfirm={() => {
            computedDelete?.({
              id:
                deleteItem?.amenity_id ||
                deleteItem?.inclusion_id ||
                deleteItem?.extra_id,

              action: "delete",
            });
          }}
        />
      )}
    </>
  );
}
