import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import useThemeStore from "../../store/themeStore";
import useAuthStore from "../../store/authStore";
import useGetData from "../../hooks/useGetData";
import Notification from "../organisms/Notification";
import { useAnnouncementStore, useForm } from "../../store/useRoomStore";
import Announcement from "../pages/Announcement";
import { motion, AnimatePresence } from "framer-motion";

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
  const announcementCount = useAnnouncementStore(
    (state) => state.announcementCount
  );
  const setAnnouncementCount = useAnnouncementStore(
    (state) => state.setAnnouncementCount
  );

  const { data: announcementData } = useGetData(
    `/admin/announcement.php?status=active`
  );

  useEffect(() => {
    if (!announcementData) return;

    setAnnouncementCount(announcementData.length);
  }, [announcementData]);

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
              } cursor-pointer absolute top-2 left-[-10px]`}
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
              {["Home", "About", "Gallery"].map((item) => (
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
                  before:translate-x-[-50%] before:h-[2px] before:w-0 flex flex-row items-center
                  before:bg-blue-400 before:transition-all before:duration-300
                  group-hover:before:w-full ${
                    !scrolled && isHome
                      ? "text-white"
                      : "text-black dark:text-white"
                  }`}
                >
                  Offers <icons.MdOutlineKeyboardArrowDown />
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

              {[
                {
                  label: "Announcement",
                  isLink: false,
                  action: () => setShowForm("announcement"),
                },
                {
                  label: "Contacts",
                  path: "/contacts",
                  isLink: true,
                },
                {
                  label: "FAQs",
                  path: "/faq",
                  isLink: true,
                },
              ].map((item) => (
                <li key={item.label} className="relative group">
                  <Link
                    title={item.label}
                    {...(item.isLink
                      ? { to: item.path }
                      : { onClick: item.action })}
                    className={`text-sm transition-colors duration-300 group-hover:text-blue-400
        before:content-[''] before:absolute before:bottom-0 before:left-1/2
        before:translate-x-[-50%] before:h-[2px] before:w-0
        before:bg-blue-400 before:transition-all before:duration-300
        group-hover:before:w-full ${
          !scrolled && isHome ? "text-white" : "text-black dark:text-white"
        }`}
                  >
                    {item.label}
                  </Link>

                  {/*  Notification Badge */}
                  {item.label === "Announcement" && announcementCount > 0 && (
                    <span className="absolute -top-1 -right-2 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">
                      {announcementCount}
                    </span>
                  )}
                </li>
              ))}

              {/* Theme Toggle */}
              <button onClick={toggleDarkMode}>
                {darkMode ? (
                  <icons.IoSunnySharp className="text-yellow-500 text-lg" />
                ) : (
                  <icons.IoMoonSharp className="text-gray-500 text-lg" />
                )}
              </button>
              {/* Sign In / User Dropdown */}
            </ul>
          </nav>

          {/* Mobile Hamburger Icon */}
          <div className="flex flex-row gap-4 items-center md:hidden ml-auto">
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

            <div
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all
        ${
          mobileMenuOpen
            ? "bg-red-500 text-white"
            : isHome && !scrolled
            ? "bg-transparent text-white" // home & not scrolled: transparent bg, white text
            : scrolled
            ? "dark:bg-gray-900 dark:text-white bg-white text-black shadow-md"
            : "dark:bg-gray-900 dark:text-white"
        }
      `}
            >
              {mobileMenuOpen ? (
                <icons.MdOutlineClose className="text-2xl" />
              ) : (
                <icons.RiMenuLine className="text-2xl" />
              )}
            </div>
          </div>
        </div>
        {/* Mobile Menu (unchanged) */}
        {mobileMenuOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-xl z-40 md:hidden"
            >
              {/* USER SECTION */}
              {user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <icons.FaUserCircle className="text-[44px] text-blue-600" />
                    <span className="text-base font-medium text-gray-800 dark:text-white">
                      {user?.firstname.split(" ")[0]}
                    </span>
                  </div>
                  <icons.IoSettingsOutline className="text-2xl text-gray-700 dark:text-gray-300 cursor-pointer" />
                </motion.div>
              )}

              {/* MENU LIST */}
              <ul className="flex flex-col gap-2 px-5 py-4 text-gray-800 dark:text-gray-100 text-base">
                {/* My Booking */}
                {user && (
                  <li>
                    <Link
                      to={`/my-booking/${user?.user_id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      My Booking
                    </Link>
                  </li>
                )}

                {/* Main Links */}
                {["Home", "About", "Gallery"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}

                {/* OFFER */}
                <li>
                  <button
                    className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileOfferOpen(!mobileOfferOpen)}
                  >
                    Offers
                    {mobileOfferOpen ? (
                      <icons.MdOutlineKeyboardArrowUp className="text-xl" />
                    ) : (
                      <icons.MdOutlineKeyboardArrowDown className="text-xl" />
                    )}
                  </button>

                  {/* Offer Dropdown Animation */}
                  <AnimatePresence>
                    {mobileOfferOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="pl-2 mt-2 flex flex-col gap-2 overflow-hidden"
                      >
                        {/* ROOM CATEGORIES */}
                        <li className="w-full border-l-2 border-blue-500 dark:border-blue-400 pl-3">
                          {/* Dropdown Button */}
                          <button
                            className="w-full flex items-center justify-between py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                            onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
                          >
                            Room Categories
                            {mobileRoomsOpen ? (
                              <icons.MdOutlineKeyboardArrowUp className="text-lg" />
                            ) : (
                              <icons.MdOutlineKeyboardArrowDown className="text-lg" />
                            )}
                          </button>

                          {/* Dropdown Items */}
                          <AnimatePresence>
                            {mobileRoomsOpen && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="mt-2 flex flex-col gap-2 pl-4 overflow-hidden"
                              >
                                {data?.map((item) => (
                                  <li
                                    key={item.category_id}
                                    onClick={() => {
                                      navigate(
                                        `/room-category/${item.category_id}`
                                      );
                                      setMobileMenuOpen(false);
                                      setMobileOfferOpen(false);
                                      setMobileRoomsOpen(false);
                                    }}
                                    className="cursor-pointer text-sm py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                  >
                                    {item.category}
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </li>

                        {/* OTHER OFFERS */}
                        <li className="border-l-2 border-transparent pl-3">
                          <ul className="flex flex-col gap-2 mt-2">
                            <li
                              className="cursor-pointer py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
                              onClick={() => {
                                navigate("/cottages");
                                setMobileMenuOpen(false);
                                setMobileOfferOpen(false);
                              }}
                            >
                              Cottages
                            </li>

                            <li
                              className="cursor-pointer py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
                              onClick={() => {
                                navigate("/function-halls");
                                setMobileMenuOpen(false);
                                setMobileOfferOpen(false);
                              }}
                            >
                              Function Hall
                            </li>
                          </ul>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* OTHER LINKS */}
                {[
                  { label: "Announcement", form: "announcement" },
                  { label: "Contacts", form: "/contacts", navigate: true },
                  { label: "FAQs", form: "/faq", navigate: true },
                ].map((item) => (
                  <li key={item.label}>
                    <div
                      onClick={() => {
                        item.navigate
                          ? navigate(item.form)
                          : setShowForm(item.form);
                        setMobileMenuOpen(false);
                        setMobileOfferOpen(false);
                      }}
                      className="relative flex items-center justify-between py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {/* Text */}
                      <span className="text-black dark:text-white">
                        {item.label}
                      </span>

                      {/*  Announcement Badge */}
                      {item.label === "Announcement" &&
                        announcementCount > 0 && (
                          <span className="ml-2  bg-red-500 text-white text-xs px-2 py-[1px] rounded-full">
                            {announcementCount}
                          </span>
                        )}
                    </div>
                  </li>
                ))}

                {/* THEME TOGGLE */}
                <li>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                  >
                    {darkMode ? "Light Mode" : "Dark Mode"}
                    {darkMode ? (
                      <icons.IoSunnySharp className="text-yellow-500" />
                    ) : (
                      <icons.IoMoonSharp className="text-gray-500" />
                    )}
                  </button>
                </li>
              </ul>
            </motion.div>
          </AnimatePresence>
        )}
      </header>

      {showForm === "notification" && (
        <Notification close={() => setShowForm(null)} />
      )}

      {showForm === "announcement" && (
        <Announcement close={() => setShowForm(null)} />
      )}
    </>
  );
}

export default Header;
