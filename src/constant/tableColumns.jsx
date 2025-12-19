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
  { title: "Paid", key: "paid" },
  { title: "Balance to Pay", key: "half_price" },

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
  { title: "Paid", key: "paid" },
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
  { title: "Paid", key: "paid" },

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

// export const bookingRescheduled = [
//   { title: "No.", key: "rescheduled_booking_id" },
//   { title: "Guest", key: "fullname" },
//   { title: "Phone", key: "phone" },
//   { title: "Previous Room", key: "prev_room" },
//   { title: "New Room", key: "new_room" },
//   { title: "Original Stay", key: "sched_date" }, // start & end of previous booking
//   { title: "Rescheduled Stay", key: "resched_to" }, // start & end of new booking
//   { title: "Original Price", key: "sched_total_price" },
//   { title: "Rescheduled Price", key: "resched_total_price" },
//   { title: "Paid (Original)", key: "sched_paid_payment" },
//   { title: "Paid (Rescheduled)", key: "resched_paid_payment" },
//   { title: "Refund / Charge", key: "refund_charge" },
//   { title: "Created At", key: "created_at" },
// ];

export const bookingRescheduled = [
  { title: "No.", key: "rescheduled_booking_id" },
  { title: "Guest Name", key: "fullname" },
  { title: "Phone Number", key: "phone" },
  { title: "Previous Room", key: "prev_room" },
  { title: "New Room", key: "new_room" },
  { title: "Original Stay Dates", key: "sched_date" }, // start & end of previous booking
  { title: "Rescheduled Stay Dates", key: "resched_to" }, // start & end of new booking
  { title: "Original Total Price", key: "sched_total_price" },
  { title: "Rescheduled Total Price", key: "resched_total_price" },
  { title: "Paid (Original Booking)", key: "sched_paid_payment" },
  { title: "Paid (Rescheduled Booking)", key: "resched_paid_payment" },
  { title: "Refund / Additional Charge", key: "refund_charge" },
  { title: "Date Rescheduled", key: "created_at" },
];

export const bookingRescheduledFh = [
  { title: "No.", key: "rescheduled_booking_id" },

  { title: "Full Name", key: "fullname" },
  { title: "Phone", key: "phone" },
  { title: "Previous Facility", key: "prev_facility" },
  { title: "New Facility", key: "new_facility" },
  { title: "Original Date", key: "sched_date" },
  { title: "Original Time", key: "sched_time" },

  { title: "Rescheduled Date", key: "resched_date" },
  { title: "Rescheduled Time", key: "resched_time" },

  { title: "Original Price", key: "sched_total_price" },
  { title: "Rescheduled Price", key: "resched_total_price" },

  { title: "Paid (Original)", key: "sched_paid_payment" },
  { title: "Paid (Rescheduled)", key: "resched_paid_payment" },

  { title: "Refund / Charge", key: "refund_charge" },

  { title: "Created At", key: "created_at" },
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
