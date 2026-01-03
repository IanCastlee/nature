import { icons } from "./icon";

// Admin Sidebar Menu
export const menuItems = [
  {
    name: "Dashboard",
    to: "/admin",
    icon: icons.LuLayoutDashboard,
  },

  {
    name: "Room Booking",
    icon: icons.GoChecklist,
    children: [
      {
        name: "Pending Booking",
        to: "/admin/booking",
      },
      {
        name: "Approved Booking",
        to: "/admin/booking-approved",
      },

      {
        name: "Arrived Booking",
        to: "/admin/booking-history",
      },
      {
        name: "Not Attended Booking",
        to: "/admin/not-attended",
      },
      {
        name: "Declined Booking",
        to: "/admin/declined-booking",
      },
      {
        name: "Rescheduled Booking Log",
        to: "/admin/rescheduled-log",
      },
    ],
  },

  {
    name: "Function Hall Booking",
    icon: icons.GoChecklist,
    children: [
      {
        name: "Pending Booking",
        to: "/admin/fh-booking",
      },
      {
        name: "Approved Booking",
        to: "/admin/fhbooking-approved",
      },

      {
        name: "Arrived Booking",
        to: "/admin/fhbooking-history",
      },
      {
        name: "Not Attended Booking",
        to: "/admin/fhbooking-not-attended",
      },
      {
        name: "Declined Booking",
        to: "/admin/fhbooking-declined",
      },
      {
        name: "Rescheduled Booking",
        to: "/admin/rescheduled-fh-log",
      },
    ],
  },

  {
    name: "Rooms",
    icon: icons.IoBedOutline,
    children: [
      {
        name: "Available Rooms",
        to: "/admin/available-room",
      },
      {
        name: "Not Available Rooms",
        to: "/admin/not-available-room",
      },

      {
        name: "Room Categories",
        to: "/admin/room-categories",
      },
    ],
  },
  {
    name: "Function Halls",
    icon: icons.HiOutlineUserGroup,
    children: [
      {
        name: "Available Function Hall",
        to: "/admin/available-function-hall",
      },
      {
        name: "Not Active Function Hall",
        to: "/admin/not-available-function-hall",
      },
    ],
  },
  {
    name: "Cottages",
    icon: icons.MdOutlineCottage,
    children: [
      {
        name: "Available Cottage",
        to: "/admin/available-cottage",
      },
      {
        name: "Not Active Cottage",
        to: "/admin/not-available-cottage",
      },
    ],
  },
  {
    name: "Activities",
    to: "/admin/activities",
    icon: icons.LuJoystick,
  },
  {
    name: "Gallery",
    to: "/admin/pending-post",
    icon: icons.GoImage,
  },

  {
    name: "Announcements",
    icon: icons.VscMegaphone,
    children: [
      {
        name: "Annoucement",
        to: "/admin/announcement",
      },
      {
        name: "History",
        to: "/admin/announcement-history",
      },
    ],
  },

  {
    name: "Terms and Conditions",
    to: "/admin/terms",
    icon: icons.RiShakeHandsLine,
  },
  {
    name: "FAQs",
    to: "/admin/faqs",
    icon: icons.TbBookmarkQuestion,
  },
  {
    name: "Settings",
    to: "/admin/setting",
    icon: icons.IoSettingsOutline,
  },

  {
    name: "Logout",
    action: "logout",
    icon: icons.IoIosLogOut,
  },
];
