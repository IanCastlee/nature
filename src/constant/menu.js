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
    name: "Reports",
    to: "/admin/reports",
    icon: icons.BiBlanket,
    children: [
      {
        name: "Active Reports",
        to: "/admin/room4",
      },
      {
        name: "Inactive Reports",
        to: "/admin/rooms4",
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
];
