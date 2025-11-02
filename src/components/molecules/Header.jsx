import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import useThemeStore from "../../store/themeStore";
import useAuthStore from "../../store/authStore";
import Button from "../atoms/Button";
import useGetData from "../../hooks/useGetData";
import Notification from "../organisms/Notification";
import { useForm } from "../../store/useRoomStore";

function Header({ isHome }) {
  const { user } = useAuthStore();
  const setShowForm = useForm((state) => state.setShowForm);
  const showForm = useForm((state) => state.showForm);

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOfferOpen, setMobileOfferOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch data
  const { data, loading, refetch, error } = useGetData(
    "/admin/room-category.php"
  );

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full h-[70px] z-50 flex items-center px-4 md:px-10 transition-colors duration-300 ${
          scrolled
            ? "bg-white shadow-md dark:bg-black"
            : isHome
            ? "bg-transparent"
            : "bg-white dark:bg-black"
        } ${mobileMenuOpen ? "bg-white dark:bg-black" : ""}`}
      >
        <div className="w-full h-full flex justify-between items-center relative">
          {/* Logo */}
          {!mobileMenuOpen && (
            <img
              onClick={() => navigate("/")}
              src={images.logo}
              alt="Logo"
              className={`transition-all duration-300 ${
                scrolled ? "h-[55px]" : isHome ? "h-[150px]" : "h-[55px]"
              } cursor-pointer absolute top-2 left-0`}
            />
          )}

          {mobileMenuOpen && (
            <img
              onClick={() => navigate("/")}
              src={images.logo}
              alt="Logo"
              className="h-[60px] flex lg:hidden"
            />
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 ml-auto pr-10">
            <ul className="flex items-center gap-10">
              {["Home", "About", "Services", "Gallery"].map((item) => (
                <li key={item} className="relative group">
                  <Link
                    to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className={`text-sm transition-colors duration-300 group-hover:text-blue-400
                    before:content-[''] before:absolute before:bottom-0 before:left-1/2 
                    before:translate-x-[-50%] before:h-[2px] before:w-0 
                    before:bg-blue-400 before:transition-all before:duration-300 
                    group-hover:before:w-full ${
                      !scrolled && isHome
                        ? "text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {item}
                  </Link>
                </li>
              ))}

              {/* Offer Dropdown */}
              <li className="relative group cursor-pointer">
                <span
                  className={`text-sm transition-colors duration-300 group-hover:text-blue-400
                  before:content-[''] before:absolute before:bottom-0 before:left-1/2 
                  before:translate-x-[-50%] before:h-[2px] before:w-0 
                  before:bg-blue-400 before:transition-all before:duration-300 
                  group-hover:before:w-full ${
                    !scrolled && isHome
                      ? "text-white"
                      : "text-black dark:text-white"
                  }`}
                >
                  Offer
                </span>

                {/* Offer dropdown menu */}
                <ul
                  className="absolute left-0 top-full mt-6 w-48 bg-white shadow-lg opacity-0 invisible 
                  group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50"
                >
                  {/* Rooms submenu (appears on hover of Rooms only) */}
                  <li className="relative group/rooms cursor-pointer">
                    <span className="block px-4 py-2 hover:bg-gray-100 text-sm">
                      Rooms
                    </span>

                    {/* Submenu positioned to the LEFT */}
                    <ul
                      className="absolute right-full top-0 mt-2 mr-[1px] w-64 bg-white shadow-lg opacity-0 invisible 
                      group-hover/rooms:opacity-100 group-hover/rooms:visible transition-all duration-300 ease-in-out z-50"
                    >
                      {data?.map((item) => (
                        <li
                          key={item.category_id}
                          onClick={() =>
                            navigate(`/room-category/${item.category_id}`)
                          }
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                        >
                          {item.category}
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => navigate("/cottages")}
                  >
                    Cottages
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => navigate("/function-halls")}
                  >
                    Function Hall
                  </li>
                </ul>
              </li>

              {/* Sign In / User Dropdown */}
              {user ? (
                <div className="relative">
                  <div
                    className="flex flex-row items-center gap-2 bg-blue-400 py-1 px-2 rounded-full cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    <icons.FaUserCircle size={28} className="text-white" />
                    <span className="text-xs text-white font-medium">
                      {user.firstname.split(" ")[0]}
                    </span>
                    <icons.MdOutlineArrowDropDownCircle
                      size={18}
                      className={`${
                        showDropdown ? "rotate-180" : "rotate-0"
                      } transition-transform text-gray-200`}
                    />
                  </div>

                  {showDropdown && (
                    <div className="absolute flex flex-col gap-1 top-full right-0 mt-5 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md p-4 z-50">
                      <Button
                        onClick={() => navigate(`/my-booking/${user.id}`)}
                        style="w-full flex flex-row items-center gap-2 text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        label={
                          <>
                            <icons.GoChecklist /> Booking
                          </>
                        }
                      />

                      <Button
                        style="w-full flex flex-row items-center gap-2 text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        label={
                          <>
                            <icons.IoSettingsOutline /> Setting
                          </>
                        }
                      />

                      <Button
                        onClick={() => {
                          useAuthStore.getState().logout();
                          navigate("/signin");
                        }}
                        style="w-full flex flex-row justify-center items-center px-4 py-2 text-sm text-white hover:bg-gray-500 dark:hover:bg-gray-700 bg-red-600 rounded-full text-center gap-2"
                        label={
                          <>
                            Logout{" "}
                            <icons.IoIosLogOut className="text-lg text-white" />
                          </>
                        }
                      />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="flex items-center gap-1 bg-blue-400 text-white font-semibold text-xs h-[30px] px-4 rounded-full transform transition duration-200 hover:scale-110"
                  onClick={() => navigate("/signin")}
                >
                  Sign In <icons.PiSignIn className="text-lg" />
                </button>
              )}
              {user && (
                <li>
                  <div
                    className="relative"
                    onClick={() => setShowForm("notification")}
                  >
                    <icons.IoMdNotifications
                      className={`text-2xl ${
                        scrolled
                          ? "dark:text-gray-300 text-gray-400"
                          : " text-gray-400"
                      } cursor-pointer`}
                    />
                    <div className="h-4 w-4 rounded-full bg-red-600 flex flex-row justify-center items-center absolute -top-2 -right-1">
                      <p className="text-xs text-white">9</p>
                    </div>
                  </div>
                </li>
              )}

              {/* Theme Toggle */}
              <button onClick={toggleDarkMode}>
                {darkMode ? (
                  <icons.IoSunnySharp className="text-yellow-500 text-lg" />
                ) : (
                  <icons.IoMoonSharp className="text-gray-500 text-lg" />
                )}
              </button>
            </ul>
          </nav>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden ml-auto pr-4">
            <icons.RiMenuLine
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${
                scrolled
                  ? "dark:text-white text-black"
                  : "bg-transparent text-black dark:text-white"
              } text-3xl cursor-pointer`}
            />
          </div>
        </div>

        {/* Mobile Menu (unchanged) */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-40 md:hidden">
            <ul className="flex flex-col gap-4 p-4 text-sm text-black dark:text-white">
              {/* Main Links */}
              {["Home", "About", "Services", "Gallery"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {item}
                  </Link>
                </li>
              ))}

              {/* Offer Dropdown */}
              <li>
                <button
                  className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => setMobileOfferOpen(!mobileOfferOpen)}
                >
                  <span>Offer</span>
                  {mobileOfferOpen ? (
                    <icons.MdOutlineKeyboardArrowUp className="text-lg" />
                  ) : (
                    <icons.MdOutlineKeyboardArrowDown className="text-lg" />
                  )}
                </button>

                {/* Offer Submenu */}
                {mobileOfferOpen && (
                  <ul className="pl-4 mt-2 flex flex-col gap-2">
                    {/* Room Categories */}
                    <li>
                      <button
                        className="w-full flex items-center justify-between py-1 hover:underline rounded"
                        onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
                      >
                        Room Categories
                        {mobileRoomsOpen ? (
                          <icons.MdOutlineKeyboardArrowUp className="text-lg" />
                        ) : (
                          <icons.MdOutlineKeyboardArrowDown className="text-lg" />
                        )}
                      </button>

                      {mobileRoomsOpen && (
                        <ul className="pl-4 mt-1 flex flex-col gap-1">
                          {data?.map((item) => (
                            <li
                              key={item.category_id}
                              onClick={() => {
                                navigate(`/room-category/${item.category_id}`);
                                setMobileMenuOpen(false);
                                setMobileOfferOpen(false);
                                setMobileRoomsOpen(false);
                              }}
                              className="cursor-pointer text-xs hover:underline py-1"
                            >
                              {item.category}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>

                    {/* Other Offer Links */}
                    <li
                      className="cursor-pointer py-1 hover:underline rounded"
                      onClick={() => {
                        navigate("/cottages");
                        setMobileMenuOpen(false);
                        setMobileOfferOpen(false);
                      }}
                    >
                      Cottages
                    </li>
                    <li
                      className="cursor-pointer py-1 hover:underline rounded"
                      onClick={() => {
                        navigate("/function-hall");
                        setMobileMenuOpen(false);
                        setMobileOfferOpen(false);
                      }}
                    >
                      Function Hall
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <div>
                  <icons.IoMdNotifications />
                  <div></div>
                </div>
              </li>
              {/* Theme Toggle */}
              <li>
                <button
                  onClick={toggleDarkMode}
                  className="w-full py-2 px-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                  {darkMode ? (
                    <icons.IoSunnySharp className="text-yellow-500" />
                  ) : (
                    <icons.IoMoonSharp className="text-gray-500" />
                  )}
                </button>
              </li>

              {/* Sign In / User */}
              <li>
                {user ? (
                  <span className="block py-2 px-2 text-xs">
                    {user.firstname}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/signin");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-2 bg-blue-400 text-white rounded-full text-xs text-center"
                  >
                    Sign In
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>

      {showForm === "notification" && (
        <Notification close={() => setShowForm(null)} />
      )}
    </>
  );
}

export default Header;
