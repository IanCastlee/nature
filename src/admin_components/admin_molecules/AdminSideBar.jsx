import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { icons } from "../../constant/icon";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { images } from "../../constant/image";
import useThemeStore from "../../store/themeStore";
import { menuItems } from "../../constant/menu";

function AdminSideBar({ isCollapsed, toggleCollapse }) {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const location = useLocation();

  // On route change, open any parent whose child route matches current path
  useEffect(() => {
    const newOpen = {};
    menuItems.forEach((item) => {
      if (item.children) {
        // If any child route starts with current path, open that parent
        const shouldOpen = item.children.some((child) =>
          location.pathname.startsWith(child.to)
        );
        newOpen[item.name] = shouldOpen;
      }
    });
    setOpenDropdowns(newOpen);
  }, [location.pathname]);

  const currentYear = new Date().getFullYear();

  const toggleItem = (itemName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <nav
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 text-gray-100 flex flex-col transition-all duration-300 z-50`}
    >
      {/* Top controls */}
      <div className="flex flex-row items-center gap-1 justify-between dark:bg-gray-800 mb-4 p-1">
        <button onClick={toggleDarkMode}>
          {darkMode ? (
            <icons.IoSunnySharp className="text-yellow-500 text-lg" />
          ) : (
            <icons.IoMoonSharp className="text-gray-500 text-lg" />
          )}
        </button>
        <button
          onClick={toggleCollapse}
          className="text-white p-1 hover:bg-gray-700 rounded self-end"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <FiChevronRight size={20} />
          ) : (
            <FiChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Logo */}
      <div className="w-full flex flex-row justify-center mb-4">
        <h3 className="text-lg font-medium dark:text-gray-100 text-gray-800 ">
          <span className="text-blue-400 font-semibold">NATURE</span> HOT SPRING
        </h3>
      </div>

      {/* Menu items */}
      <ul className="flex flex-col gap-4 p-2">
        {menuItems.map((item) => {
          const hasChildren =
            Array.isArray(item.children) && item.children.length > 0;

          const parentIsActive =
            (item.to && location.pathname.startsWith(item.to)) ||
            (hasChildren &&
              item.children.some((child) =>
                location.pathname.startsWith(child.to)
              ));

          return (
            <li key={item.name}>
              <div
                className={`flex items-center justify-between h-[35px] px-2 rounded-md cursor-pointer transition-colors
                  ${
                    parentIsActive
                      ? "bg-gray-200 dark:bg-gray-800 font-semibold"
                      : "dark:hover:bg-gray-800 hover:bg-gray-100"
                  }
                `}
                onClick={() => {
                  if (hasChildren) toggleItem(item.name);
                }}
              >
                <NavLink
                  to={item.to || "#"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 w-full h-full dark:text-gray-400 text-gray-700 text-sm font-semibold ${
                      isActive ? "font-semibold " : ""
                    }`
                  }
                >
                  <item.icon className="text-blue-400 text-sm" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>

                {hasChildren && !isCollapsed && (
                  <span>
                    {openDropdowns[item.name] ? (
                      <FiChevronLeft size={16} className="text-blue-400" />
                    ) : (
                      <FiChevronRight size={16} className="text-blue-400" />
                    )}
                  </span>
                )}
              </div>

              {/* Submenu */}
              {hasChildren && openDropdowns[item.name] && !isCollapsed && (
                <ul className="ml-6 mt-1 flex flex-col gap-1">
                  {item.children.map((subItem) => (
                    <li key={subItem.name}>
                      <NavLink
                        to={subItem.to}
                        className={({ isActive }) =>
                          `flex items-center gap-2 h-[30px] dark:text-gray-400 text-gray-700  text-sm px-2 rounded-md transition-colors ${
                            isActive
                              ? "bg-gray-200 dark:bg-gray-800 "
                              : "dark:hover:bg-gray-800 hover:bg-gray-100"
                          }`
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      {!isCollapsed && (
        <footer className="mt-auto p-2 border-t dark:border-gray-700 border-gray-300 text-sm text-gray-400 text-center flex flex-col items-center justify-center">
          © {currentYear} Nature Hot Spring reserved.
        </footer>
      )}
    </nav>
  );
}

export default AdminSideBar;
