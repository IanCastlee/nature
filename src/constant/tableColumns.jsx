import { uploadUrl } from "../utils/fileURL";

export const availableRoomColumns = [
  {
    title: "Image",
    key: "image",
    render: (item) => (
      <div className="relative group">
        <img
          src={`${uploadUrl.uploadurl}/rooms/${item.images[0]}`}
          alt={item.room_name}
          className="w-10 h-10 rounded shadow-sm object-cover"
        />

        {/* Fixed preview on hover */}
        <div className="hidden group-hover:flex fixed inset-0 bg-black/70 justify-center items-center z-50">
          <img
            src={`${uploadUrl.uploadurl}/rooms/${item.images[0]}`}
            alt={item.room_name}
            className="max-w-[90%] max-h-[90%] object-cover rounded-lg shadow-lg border border-white"
          />
        </div>
      </div>
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
    title: "Last Maintenance",
    key: "last_maintenance",
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
export const bookingPending = [
  { title: "Name", key: "fullname" },
  { title: "Phone", key: "phone" },
  { title: "Room Name", key: "room_name" },
  { title: "Check-In", key: "start_date" },
  { title: "Check-Out", key: "end_date" },
  { title: "Night(s)", key: "nights" },
  {
    title: "Extras",
    key: "extras",
    width: "150px",
  },
  { title: "Total Amount", key: "price" },
  { title: "Required Payment", key: "half_price" },

  { title: "Status", key: "status" },
];

export const bookingApproved = [
  { title: "Name", key: "fullname" },
  { title: "Phone", key: "phone" },
  { title: "Room Name", key: "room_name" },
  { title: "Check-In", key: "start_date" },
  { title: "Check-Out", key: "end_date" },
  { title: "Night(s)", key: "nights" },
  {
    title: "Extras",
    key: "extras",
    width: "150px",
  },
  { title: "Total Amount", key: "price" },
  { title: "Paid", key: "paid" },
  { title: "Balance to Pay", key: "half_price" },

  { title: "Status", key: "status" },
];

export const bookingHistory = [
  { title: "Name", key: "fullname" },
  { title: "Phone", key: "phone" },
  { title: "Room Name", key: "room_name" },
  { title: "Check-In", key: "start_date" },
  { title: "Check-Out", key: "end_date" },
  { title: "Night(s)", key: "nights" },
  {
    title: "Extras",
    key: "extras",
    width: "150px",
  },
  { title: "Total Amount", key: "price" },
  { title: "Paid", key: "paid" },
  // { title: "Balance to Pay", key: "half_price" },

  { title: "Status", key: "status" },
];

export const bookingDeclined = [
  { title: "Name", key: "fullname" },
  { title: "Phone", key: "phone" },
  { title: "Room Name", key: "room_name" },
  { title: "Check-In", key: "start_date" },
  { title: "Check-Out", key: "end_date" },
  { title: "Night(s)", key: "nights" },
  {
    title: "Extras",
    key: "extras",
    width: "150px",
  },
  { title: "Total Amount", key: "price" },
  { title: "Paid", key: "paid" },

  { title: "Status", key: "status" },
];

export const booking = [
  { title: "Name", key: "fullname" },
  { title: "Email", key: "email" },
  { title: "Room Name", key: "room_name" },
  { title: "Check-In", key: "start_date" },
  { title: "Check-Out", key: "end_date" },
  { title: "Night(s)", key: "nights" },
  { title: "Price", key: "price" },

  {
    title: "Extras",
    key: "extras",
    width: "200px",
  },
  { title: "Status", key: "status" },
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

//function hall booking
export const fhbooking = [
  {
    title: "Fullname",
    key: "fullname",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Function Hall",
    key: "name",
  },
  {
    title: "Date",
    key: "date",
  },
  {
    title: "Start Time(AM)",
    key: "start_time",
  },
  // {
  //   title: "End Time(mt)",
  //   key: "end_time",
  // },

  { title: "Total Amount", key: "price" },
  // { title: "Paid", key: "paid" },
  { title: "Balance to Pay", key: "half_price" },
  {
    title: "Status",
    key: "status",
  },
];

//function hall approved booking
export const fhbookingApproved = [
  {
    title: "Fullname",
    key: "fullname",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Function Hall",
    key: "name",
  },
  {
    title: "Date",
    key: "date",
  },
  {
    title: "Start Time(AM)",
    key: "start_time",
  },

  { title: "Total Amount", key: "price" },
  { title: "Paid", key: "paid" },
  { title: "Balance to Pay", key: "half_price" },
  {
    title: "Status",
    key: "status",
  },
];

//function hall declined booking
export const fhbookingDeclined = [
  {
    title: "Fullname",
    key: "fullname",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Function Hall",
    key: "name",
  },
  {
    title: "Date",
    key: "date",
  },
  {
    title: "Start Time(AM)",
    key: "start_time",
  },

  { title: "Total Amount", key: "price" },
  { title: "Paid", key: "paid" },
  {
    title: "Status",
    key: "status",
  },
];

//function hall declined booking
export const fhbookingHistory = [
  {
    title: "Fullname",
    key: "fullname",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Function Hall",
    key: "name",
  },
  {
    title: "Date",
    key: "date",
  },
  {
    title: "Start Time(AM)",
    key: "start_time",
  },

  { title: "Total Amount", key: "price" },
  { title: "Paid", key: "paid" },
  {
    title: "Status",
    key: "status",
  },
];
//gallery
export const galleryColumn = [
  {
    title: "Post",
    key: "image",
    render: (item) => (
      <div className="relative group">
        <img
          src={`${uploadUrl.uploadurl}/gallery/${item.image}`}
          alt={item.room_name}
          className="w-10 h-10 rounded shadow-sm object-cover"
        />

        {/* Fixed preview on hover */}
        <div className="hidden group-hover:flex fixed inset-0 bg-black/70 justify-center items-center z-50">
          <img
            src={`${uploadUrl.uploadurl}/gallery/${item.image}`}
            alt={item.room_name}
            className="max-w-[90%] max-h-[90%] object-cover rounded-lg shadow-lg border border-white"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Caption",
    key: "caption",
  },
  {
    title: "Date Posted",
    key: "date_posted",
  },
  {
    title: "Status",
    key: "status",
  },
];

//announcement column
export const announcementColumn = [
  {
    title: "Title",
    key: "title",
    width: "180px",
    className: "truncate",
  },
  {
    title: "Announcement",
    key: "message",
    className: "whitespace-pre-line break-words",
  },
  {
    title: "Date Posted",
    key: "createdAt",
    width: "150px",
    className: "text-center",
  },
];

//terms and conditions column
export const termsAndConditionsColumn = [
  {
    title: "Title",
    key: "title",
    width: "180px",
    className: "truncate",
  },
  {
    title: "Content",
    key: "content",
    className: "whitespace-pre-line break-words",
  },
  {
    title: "Last Update",
    key: "last_update",
    width: "150px",
    className: "text-center",
  },
];
