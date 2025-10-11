import Button from "../admin_atoms/Button";
import { icons } from "../../constant/icon";

// Outside AvailableRoomPage.jsx
export const renderActions = ({
  item,
  onEdit,
  onSetInactive,
  onSetAddAmenity,
  onSetViewRoomDetails,
  onSetAddRoomInclusions,
  onSetAddExtras,
  isNotAvailablePage,
}) => {
  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {!isNotAvailablePage && (
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => onSetAddAmenity(item.room_id)}
              title="Add Amenities"
              className="bg-yellow-700 text-white text-xs px-2 h-[27px] rounded-sm"
              label="Amenities"
            />
            <Button
              onClick={() => onSetAddRoomInclusions(item.room_id)}
              title="Add Inclusions"
              className="bg-yellow-600 text-white text-xs px-2 h-[27px] rounded-sm"
              label="Inclusions"
            />
            <Button
              onClick={() => onSetAddExtras(item.room_id)}
              title="Add Extras"
              className="bg-yellow-500 text-white text-xs px-2 h-[27px] rounded-sm"
              label="Extras"
            />
          </div>
        )}
        <button
          onClick={() => onSetInactive(item)}
          className="bg-red-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center ml-4"
          title={
            isNotAvailablePage ? "Set as available" : "Set as not in-active"
          }
        >
          <icons.TbRefresh />
        </button>
        {!isNotAvailablePage && (
          <button
            onClick={() => onEdit(item)}
            className="bg-blue-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
            title="Edit"
          >
            <icons.FaRegEdit />
          </button>
        )}
        <button
          onClick={() => onSetViewRoomDetails(item.room_id)}
          className="bg-green-600 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
          title="View Room Details"
        >
          <icons.AiOutlineInfoCircle />
        </button>
      </div>
    </>
  );
};

//render Action for Room Other Details
export const renderActionsRoomOtherDeatails = ({
  item,
  onEdit,
  onSetDelete,
}) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => onEdit(item)}
        className="bg-blue-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
        title="Edit "
      >
        <icons.FaRegEdit />
      </button>

      <button
        onClick={() => onSetDelete(item)}
        className="bg-red-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center "
        title="Delete"
      >
        <icons.MdDeleteOutline />
      </button>
    </div>
  );
};

//render Action for function hall
export const renderActionsFuntionHall = ({
  item,
  onEdit,
  showForm,
  onSetViewFHDetails,
  onSetInactive,
  isNotAvailablePage,
}) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {!isNotAvailablePage && (
        <button
          onClick={() => onEdit(item)}
          className="bg-blue-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
          title="Edit"
        >
          <icons.FaRegEdit />
        </button>
      )}
      <button
        onClick={() => onSetInactive(item)}
        className="bg-red-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center "
        title={isNotAvailablePage ? "Set as available" : "Set as not in-active"}
      >
        <icons.TbRefresh className="text-white" />
      </button>
      <button
        onClick={() => onSetViewFHDetails(item.fh_id)}
        className="bg-green-600 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
        title="View Room Details"
      >
        <icons.AiOutlineInfoCircle />
      </button>
    </div>
  );
};

//render Action for cottage
export const renderActionsCottage = ({
  item,
  onEdit,
  showForm,
  onSetInactive,
  isNotAvailablePage,
  onSetViewCottageDetails,
}) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {!isNotAvailablePage && (
        <button
          onClick={() => onEdit(item)}
          className="bg-blue-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
          title="Edit"
        >
          <icons.FaRegEdit />
        </button>
      )}
      <button
        onClick={() => onSetInactive(item)}
        className="bg-red-500 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center "
        title={isNotAvailablePage ? "Set as available" : "Set as not in-active"}
      >
        <icons.TbRefresh className="text-white" />
      </button>

      <button
        onClick={() => onSetViewCottageDetails(item.cottage_id)}
        className="bg-green-600 text-white w-[27px] h-[27px] rounded-sm flex justify-center items-center"
        title="View Room Details"
      >
        <icons.AiOutlineInfoCircle />
      </button>
    </div>
  );
};
