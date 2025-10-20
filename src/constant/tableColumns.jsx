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
  {
    title: "Status",
    key: "status",
  },
];

//room categories
export const roomCategories = [
  {
    title: "Image",
    key: "image",
    render: (item) => (
      <img
        src={`${uploadUrl.uploadurl}/room_categories/${item.image}`}
        alt={item.room_name}
        className="w-10 h-10 rounded shadow-sm"
      />
    ),
  },
  {
    title: "Category",
    key: "category",
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
  // Show price only if it's for extras
  ...(showForm === "add extras" || showForm === "update extras"
    ? [
        {
          title: "Price",
          key: "price",
        },
      ]
    : []),
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

//cottage
export const availableCottageColumns = [
  {
    title: "Image",
    key: "image",
    render: (item) => (
      <img
        src={`${uploadUrl.uploadurl}/cottage/${item.image}`}
        alt={item.room_name}
        className="w-10 h-10 rounded shadow-sm"
      />
    ),
  },
  {
    title: "Cottage",
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

//booking
export const booking = [
  {
    title: "Name",
    key: "firstname",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Room Name",
    key: "room_name",
  },
  {
    title: "Check-In",
    key: "start_date",
  },
  {
    title: "Check-Out",
    key: "end_date",
  },
  {
    title: "Night(s)",
    key: "nights",
  },
  {
    title: "Price",
    key: "price",
  },
  {
    title: "Status",
    key: "status",
  },
];

//users
export const users = [
  {
    title: "Firstname",
    key: "firstname",
  },
  {
    title: "Lastname",
    key: "lastname",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Created At",
    key: "created_at",
  },
  {
    title: "Updated At",
    key: "updated_at",
  },
  {
    title: "Status",
    key: "email_verified",
  },
];
