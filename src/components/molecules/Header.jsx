import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import useThemeStore from "../../store/themeStore";
import { dummyRooms } from "../../constant/mockData";
function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[60px] z-50 flex items-center pl-10 transition-colors duration-300 ${
        scrolled ? "bg-white/70 shadow-md dark:bg-black/80" : "bg-transparent"
      }`}
    >
      <div className="w-full h-full flex justify-between items-center relative">
        <img
          onClick={() => navigate("/")}
          src={images.logo}
          alt="Logo"
          className={`absolute top-2 left-10 transition-all duration-300 ${
            scrolled ? "h-[70px]" : "h-[150px]"
          } cursor-pointer`}
        />
        <span></span>

        <nav className="flex  pr-20">
          <ul className="flex items-center gap-10">
            <li className="relative group">
              <Link
                to="/"
                className={`text-black dark:text-white transition-colors duration-300 
      group-hover:text-blue-400
      before:content-[''] before:absolute before:bottom-0 before:left-1/2 
      before:translate-x-[-50%] before:h-[2px] before:w-0 
      before:bg-blue-400 before:transition-all before:duration-300 
      group-hover:before:w-full ${scrolled ? "dark:text-white" : "text-white"}`}
              >
                Home
              </Link>
            </li>

            <li className="relative group">
              <Link
                to="/about"
                className={`text-black dark:text-white transition-colors duration-300 
      group-hover:text-blue-400
      before:content-[''] before:absolute before:bottom-0 before:left-1/2 
      before:translate-x-[-50%] before:h-[2px] before:w-0 
      before:bg-blue-400 before:transition-all before:duration-300 
      group-hover:before:w-full ${scrolled ? "dark:text-white" : "text-white"}`}
              >
                About
              </Link>
            </li>

            <li className="relative group">
              <Link
                to="/"
                className={`text-black dark:text-white transition-colors duration-300 
      group-hover:text-blue-400
      before:content-[''] before:absolute before:bottom-0 before:left-1/2 
      before:translate-x-[-50%] before:h-[2px] before:w-0 
      before:bg-blue-400 before:transition-all before:duration-300 
      group-hover:before:w-full ${scrolled ? "dark:text-white" : "text-white"}`}
              >
                Services
              </Link>
            </li>

            <li className="relative group cursor-pointer">
              <span
                className={`text-black dark:text-white transition-colors duration-300 
      group-hover:text-blue-400
      before:content-[''] before:absolute before:bottom-0 before:left-1/2 
      before:translate-x-[-50%] before:h-[2px] before:w-0 
      before:bg-blue-400 before:transition-all before:duration-300 
      group-hover:before:w-full ${scrolled ? "dark:text-white" : "text-white"}`}
              >
                Offer
              </span>

              {/* First Level Dropdown */}
              <ul
                className="
      absolute left-0 top-full
      w-48 bg-white shadow-lg 
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-300 ease-in-out
      z-50
    "
              >
                {/* Rooms with Nested Dropdown */}
                <li className="relative group/submenu cursor-pointer">
                  <span className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Rooms
                  </span>

                  {/* Second Level Dropdown (Submenu for Rooms) */}
                  <ul
                    className="
    absolute right-full top-0 mt-8
    mr-1  /* Adds margin between first and second level */
    w-64 bg-white shadow-lg
    opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible
    transition-all duration-300 ease-in-out
    z-50
  "
                  >
                    {dummyRooms.map((item) => (
                      <li
                        onClick={() => navigate(`/room-category/${item.name}`)}
                        key={item.name}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </li>

                {/* Other Options */}
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  Cottages
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                  Function Hall
                </li>
              </ul>
            </li>

            <button onClick={toggleDarkMode}>
              {darkMode ? (
                <icons.IoSunnySharp className="text-yellow-500 text-lg" />
              ) : (
                <icons.IoMoonSharp className="text-gray-500 text-lg" />
              )}
            </button>

            <button
              className="flex fle-row items-center gap-1 bg-blue-400 text-white font-semibold text-xs h-[30px] px-4 rounded-full transform transition duration-200 hover:scale-110"
              onClick={() => navigate("/signin")}
            >
              Sign In <icons.PiSignIn className="text-lg" />
            </button>
          </ul>
        </nav>

        {/* <motion.div
          initial={{ opacity: 0, x: 300 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 2.5 }}
          className="flex flex-row bg-white/70 dark:bg-black/50 h-full rounded-l-full px-[30px]"
        >
          <ul className="flex flex-row items-center gap-4">
            <span className="flex-col">
              <li className="text-black text-xs flex flex-row items-center gap-2 dark:text-white">
                <icons.FaPhoneAlt /> 0973647633
              </li>
              <li className="text-black text-xs flex flex-row items-center gap-2 dark:text-white">
                <icons.IoIosMail /> domain@gmail.com
              </li>
            </span>
            <li className="text-black dark:text-white text-xs flex flex-row items-center gap-2">
              <icons.MdLocationOn /> San Francisco, Bulusan Sorsogon
            </li>
          </ul>
        </motion.div> */}
      </div>
    </header>
  );
}

export default Header;
