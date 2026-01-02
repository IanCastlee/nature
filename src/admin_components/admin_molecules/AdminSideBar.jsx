import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { icons } from "../../constant/icon";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useThemeStore from "../../store/themeStore";
import useAuthStore from "../../store/authStore";
import { menuItems } from "../../constant/menu";
import { images } from "../../constant/image";

function AdminSideBar({ isCollapsed, toggleCollapse }) {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const open = {};
    menuItems.forEach((item) => {
      if (item.children) {
        open[item.name] = item.children.some((child) =>
          location.pathname.startsWith(child.to)
        );
      }
    });
    setOpenDropdowns(open);
  }, [location.pathname]);

  const toggleItem = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate("/signin");
  };

  const currentYear = new Date().getFullYear();

  return (
    <nav
      onMouseEnter={() => toggleCollapse(false)}
      onMouseLeave={() => toggleCollapse(true)}
      className={`${isCollapsed ? "w-20" : "w-64"} fixed top-0 left-0 h-screen
      bg-white dark:bg-gray-900
      transition-all duration-300 ease-in-out
      z-40 flex flex-col overflow-y-auto hide-scrollbar`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-2 dark:bg-gray-800">
        <button onClick={toggleDarkMode}>
          {darkMode ? (
            <icons.IoSunnySharp className="text-yellow-400 text-lg" />
          ) : (
            <icons.IoMoonSharp className="text-gray-600 text-lg" />
          )}
        </button>
      </div>

      {/* Logo */}
      <div className="flex justify-center my-4">
        {isCollapsed ? (
          <img src={images.logo} alt="logo" className="w-10 h-10" />
        ) : (
          <h3 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
            <span className="text-blue-500 dark:text-blue-400">NATURE</span> HOT
            SPRING
          </h3>
        )}
      </div>

      {/* Menu */}
      <ul className="flex flex-col gap-2 px-2">
        {menuItems.map((item) => {
          const hasChildren = item.children?.length > 0;

          const parentIsActive =
            (item.to && location.pathname.startsWith(item.to)) ||
            (hasChildren &&
              item.children.some((c) => location.pathname.startsWith(c.to)));

          if (item.action === "logout") {
            return (
              <li key={item.name}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 h-[36px] px-2 w-full
                  text-sm font-medium text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  <item.icon className="text-blue-600 dark:text-blue-400 text-lg" />
                  {!isCollapsed && item.name}
                </button>
              </li>
            );
          }

          return (
            <li key={item.name}>
              <div
                className={`flex items-center justify-between h-[36px] px-2 rounded-md cursor-pointer
                ${
                  parentIsActive
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() =>
                  !isCollapsed && hasChildren && toggleItem(item.name)
                }
              >
                <NavLink
                  to={item.to || "#"}
                  className="flex items-center gap-2 w-full text-sm font-medium
                  text-gray-700 dark:text-gray-300"
                >
                  <item.icon className="text-blue-600 dark:text-blue-400 text-lg" />
                  {!isCollapsed && item.name}
                </NavLink>

                {hasChildren &&
                  !isCollapsed &&
                  (openDropdowns[item.name] ? (
                    <FiChevronLeft size={14} className="text-blue-400" />
                  ) : (
                    <FiChevronRight size={14} className="text-blue-400" />
                  ))}
              </div>

              {/* Submenu */}
              {hasChildren && openDropdowns[item.name] && !isCollapsed && (
                <ul className="ml-6 mt-1 flex flex-col gap-1">
                  {item.children.map((sub) => (
                    <li key={sub.name}>
                      <NavLink
                        to={sub.to}
                        className={({ isActive }) =>
                          `h-[28px] px-2 flex items-center rounded-md text-xs
                          ${
                            isActive
                              ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`
                        }
                      >
                        {sub.name}
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
        <footer className="mt-auto p-2 text-xs text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
          © {currentYear} Nature Hot Spring
        </footer>
      )}
    </nav>
  );
}

export default AdminSideBar;
