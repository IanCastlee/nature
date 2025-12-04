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
        name: "Booking History",
        to: "/admin/booking-history",
      },
      {
        name: "Declined Booking",
        to: "/admin/declined-booking",
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
        name: "Booking History",
        to: "/admin/fhbooking-history",
      },
      {
        name: "Declined Booking",
        to: "/admin/fhbooking-declined",
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

  // {
  //   name: "Users",
  //   icon: icons.LuUsers,
  //   children: [
  //     {
  //       name: "Verified Users",
  //       to: "/admin/verified-users",
  //     },
  //     {
  //       name: "Not-Verified Users",
  //       to: "/admin/notverified-users",
  //     },
  //   ],
  // },

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
    icon: icons.RiShakeHandsLine,
    children: [
      {
        name: "Active Terms",
        to: "/admin/terms",
      },
      {
        name: "History",
        to: "/admin/announcement-history",
      },
    ],
  },
  // {
  //   name: "Why Choose Us",
  //   to: "/admin/why-choose-us",
  //   icon: icons.GoImage,
  // },
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
