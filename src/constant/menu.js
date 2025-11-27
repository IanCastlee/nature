import { icons } from "./icon";

// Admin Sidebar Menu
export const menuItems = [
  {
    name: "Dashboard",
    to: "/admin",
    icon: icons.LuLayoutDashboard,
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
    name: "Function Hall",
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
    name: "Cottage",
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
        name: "Declined Booking",
        to: "/admin/declined-booking",
      },
      {
        name: "Booking History",
        to: "/admin/booking-history",
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
        name: "Declined Booking",
        to: "/admin/fhbooking-declined",
      },
      {
        name: "Booking History",
        to: "/admin/fhbooking-history",
      },
    ],
  },

  {
    name: "Users",
    icon: icons.LuUsers,
    children: [
      {
        name: "Verified Users",
        to: "/admin/verified-users",
      },
      {
        name: "Not-Verified Users",
        to: "/admin/notverified-users",
      },
    ],
  },
  {
    name: "Gallery",
    icon: icons.GoImage,
    children: [
      {
        name: "Pending",
        to: "/admin/pending-post",
      },
      {
        name: "Posted",
        to: "/admin/posted-post",
      },
    ],
  },
  {
    name: "Announcement",
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
    name: "Analytics",
    to: "/admin/analytics",
    icon: icons.GrAnalytics,
  },
  {
    name: "Settings",
    to: "/admin/settings",
    icon: icons.IoSettingsOutline,
    children: [
      {
        name: "Active Rooms",
        to: "/admin/room3",
      },
      {
        name: "Inactive Rooms",
        to: "/admin/rooms33",
      },
    ],
  },
  {
    name: "Logout",
    action: "logout",
    icon: icons.IoIosLogOut,
  },
];
