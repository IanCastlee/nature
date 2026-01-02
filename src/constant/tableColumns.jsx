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
        {/* <div className="hidden group-hover:flex fixed inset-0 bg-black/70 justify-center items-center z-50">
          <img
            src={`${uploadUrl.uploadurl}/rooms/${item.images[0]}`}
            alt={item.room_name}
            className="max-w-[90%] max-h-[90%] object-cover rounded-lg shadow-lg border border-white"
          />
        </div> */}
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
    title: "Time In/Out",
    key: "time_in_out",
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
  { title: "No.", key: "booking_id" },
  { title: "Guest", key: "fullname" },
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
  { title: "No.", key: "booking_id" },
  { title: "Guest", key: "fullname" },
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
  { title: "Paid", key: "down_payment" },
  { title: "Balance to Pay", key: "bal_topay" },

  { title: "Status", key: "status" },
];

export const bookingHistory = [
  { title: "No.", key: "booking_id" },

  { title: "Guest", key: "fullname" },
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
  { title: "Paidss", key: "paid" },
  // { title: "Balance to Pay", key: "half_price" },

  { title: "Status", key: "status" },
];

export const bookingDeclined = [
  { title: "No.", key: "booking_id" },

  { title: "Guest", key: "fullname" },
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
  { title: "Paid", key: "down_payment" },

  { title: "Status", key: "status" },
];

export const booking = [
  { title: "No.", key: "booking_id" },

  { title: "Guest", key: "fullname" },
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

export const bookingNonAttended = [
  { title: "No.", key: "booking_id" },

  { title: "Guest", key: "fullname" },
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
  { title: "Paid", key: "down_payment" },
  // { title: "Balance to Pay", key: "half_price" },

  { title: "Status", key: "status" },
];

export const bookingRescheduled = [
  { title: "No.", key: "id" },

  { title: "Full Name", key: "guest" },
  { title: "Phone", key: "phone" },

  { title: "Previous Room", key: "previous_room" },
  { title: "Previous DP", key: "previous_paid" },
  { title: "Previous Check-in / Out", key: "prev_check_in_out" },

  { title: "New Room", key: "new_room" },
  { title: "New DP", key: "new_paid" },
  { title: "New Check-in / Out", key: "new_check_in_out" },

  { title: "Refund / Charge", key: "refund_recharge" },

  { title: "Created At", key: "inserted_at" },
];

export const bookingRescheduledFh = [
  { title: "No.", key: "id" },

  { title: "Full Name", key: "guest" },
  { title: "Phone", key: "phone" },
  { title: "Previous Facility", key: "previous_facility" },
  { title: "New Facility", key: "new_facility" },
  { title: "Original Date", key: "prev_date" },

  { title: "Rescheduled Date", key: "new_date" },

  { title: "Previous DP", key: "previous_paid" },
  { title: "New Booking DP", key: "new_paid" },

  { title: "Refund / Charge", key: "refund_recharge" },

  { title: "Created At", key: "inserted_at" },
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
    title: "No.",
    key: "id",
  },
  {
    title: "Guest",
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
  { title: "Required Payment", key: "half_price" },
  {
    title: "Status",
    key: "status",
  },
];

//function hall approved booking
export const fhbookingApproved = [
  {
    title: "No.",
    key: "id",
  },
  {
    title: "Guest",
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
  { title: "Paid", key: "down_payment" },
  { title: "Balance to Pay", key: "bal_topay" },
  {
    title: "Status",
    key: "status",
  },
];

//function hall declined booking
export const fhbookingDeclined = [
  {
    title: "No.",
    key: "id",
  },
  {
    title: "Guest",
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
    title: "No.",
    key: "id",
  },
  {
    title: "Guest",
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

// terms and faqs column
export const faqsColumn = [
  {
    title: "Question (EN)",
    key: "question_en",
    width: "220px",
    className: "truncate font-medium",
  },
  {
    title: "Answer (EN)",
    key: "answer_en",
    className: "whitespace-pre-line break-words max-w-[500px]",
  },
  {
    title: "Created At",
    key: "created_at",
  },
];

//terms column
export const termsColumn = [
  {
    title: "Title (EN)",
    key: "title_en",
  },
  {
    title: "Title (TL)",
    key: "title_tl",
  },
  {
    title: "Content (EN)",
    key: "content_en",
  },
  {
    title: "Content (TL)",
    key: "content_tl",
  },
];

//activities column
export const availableActivitiesColumns = [
  {
    title: "No.",
    key: "id",
  },
  {
    title: "Image",
    key: "image",
    render: (item) => (
      <img
        src={`${uploadUrl.uploadurl}/activities/${item.image}`}
        alt={item.room_name}
        className="w-10 h-10 rounded shadow-sm"
      />
    ),
  },
  {
    title: "Title",
    key: "title",
  },
];
