import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import useThemeStore from "../../store/themeStore";

function Header() {
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
          src={images.logo}
          alt="Logo"
          className={`absolute top-2 left-10 transition-all duration-300 ${
            scrolled ? "h-[70px]" : "h-[150px]"
          }`}
        />
        <span></span>

        <nav className="flex">
          <ul className="flex items-center gap-10">
            <li
              className={`${
                scrolled ? "dark:text-white" : "dark:text-white text-white"
              }`}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={`${
                scrolled ? "dark:text-white" : "dark:text-white text-white"
              }`}
            >
              <Link to="/">About</Link>
            </li>
            <li
              className={`${
                scrolled ? "dark:text-white" : "dark:text-white text-white"
              }`}
            >
              <Link to="/">Services</Link>
            </li>

            <button onClick={toggleDarkMode}>
              {darkMode ? (
                <icons.IoSunnySharp className="text-yellow-500 text-lg" />
              ) : (
                <icons.IoMoonSharp className="text-gray-500 text-lg" />
              )}
            </button>
          </ul>
        </nav>

        <motion.div
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
        </motion.div>
      </div>
    </header>
  );
}

export default Header;
