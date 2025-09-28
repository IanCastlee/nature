import React from "react";
import { NavLink } from "react-router-dom";
import { icons } from "../../constant/icon";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Toggle icons
import { images } from "../../constant/image";
function AdminSideBar({ isCollapsed, toggleCollapse }) {
  const menuItems = [
    {
      name: "Dashboard",
      to: "/admin/dashboard",
      icon: <icons.BiBlanket size={20} />,
    },
    { name: "Users", to: "/admin/users", icon: <icons.BiBlanket size={20} /> },
    {
      name: "Reports",
      to: "/admin/reports",
      icon: <icons.BiBlanket size={20} />,
    },
    {
      name: "Analytics",
      to: "/admin/analytics",
      icon: <icons.BiBlanket size={20} />,
    },
    {
      name: "Settings",
      to: "/admin/settings",
      icon: <icons.BiBlanket size={20} />,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <nav
      className={`
        ${isCollapsed ? "w-20" : "w-64"} 
        fixed top-0 left-0 h-screen bg-gray-800 text-gray-100 
        flex flex-col p-4 transition-all duration-300 z-50
      `}
    >
      <button
        onClick={toggleCollapse}
        className=" text-white p-1 hover:bg-gray-700 rounded self-end"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <FiChevronRight size={20} />
        ) : (
          <FiChevronLeft size={20} />
        )}
      </button>
      {/* Header */}
      <div className="w-full flex flex-row justify-center">
        <img
          src={images.logo}
          alt="Logo"
          className={`${
            isCollapsed ? "h-[50px] w-[50px] " : "h-[130px] w-[130px] "
          }`}
        />
      </div>

      <ul role="menu" className="flex flex-col gap-2 mt-4">
        {menuItems.map(({ name, to, icon }) => (
          <li role="none" key={name}>
            <NavLink
              to={to}
              role="menuitem"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              {icon}
              {!isCollapsed && <span>{name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {!isCollapsed && (
        <footer className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400 text-center">
          © {currentYear}
          Nature Hot Spring reserved.
        </footer>
      )}
    </nav>
  );
}

export default AdminSideBar;
