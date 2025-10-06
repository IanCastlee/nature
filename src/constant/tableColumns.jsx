import { uploadUrl } from "../utils/fileURL";

export const availableRoomColumns = [
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

//getOtherRoomDetails
export const getOtherRoomDetails = (showForm) => [
  {
    title: "Title",
    key:
      showForm === "add amenity" || showForm === "update amenity"
        ? "amenities"
        : showForm === "add inclusion" || showForm === "update inclusion"
        ? "inclusion"
        : showForm === "add extras" || showForm === "update extras"
        ? "extras"
        : "name",
  },
];

//function hall
export const availableFHColumns = [
  {
    title: "Image",
    key: "image",
    render: (item) => (
      <img
        src={`${uploadUrl.uploadurl}/function_hall/${item.image}`}
        alt={item.room_name}
        className="w-10 h-10 rounded shadow-sm"
      />
    ),
  },
  {
    title: "Function Hall Name",
    key: "name",
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
