import { icons } from "./icon";

// Admin Sidebar Menu
export const menuItems = [
  {
    name: "Dashboard",
    to: "/admin/dashboard",
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
    name: "Booking",
    icon: icons.GoChecklist,
    children: [
      {
        name: "Booking",
        to: "/admin/available-cottage",
      },
      {
        name: "Booking History",
        to: "/admin/not-available-cottage",
      },
    ],
  },
  {
    name: "Registered Users",
    to: "/admin/users",
    icon: icons.LuUsers,
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
    to: "/admin/analytics",
    icon: icons.IoIosLogOut,
  },
];
