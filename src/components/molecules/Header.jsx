import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import useThemeStore from "../../store/themeStore";
import { dummyRooms } from "../../constant/mockData";

function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOfferOpen, setMobileOfferOpen] = useState(false);
  const [mobileRoomsOpen, setMobileRoomsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[60px] z-50 flex items-center px-4 md:px-10 transition-colors duration-300 ${
        scrolled
          ? "bg-white shadow-md dark:bg-black"
          : mobileMenuOpen && "dark:bg-black bg-white lg:bg-transparent"
      }`}
    >
      <div className="w-full h-full flex justify-between items-center relative">
        {/* Logo */}
        {!mobileMenuOpen && (
          <img
            onClick={() => navigate("/")}
            src={images.logo}
            alt="Logo"
            className={`transition-all duration-300 ${
              scrolled ? "h-[55px]" : "h-[150px]"
            } cursor-pointer absolute top-2 left-0 `}
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
            {["Home", "About", "Services"].map((item) => (
              <li key={item} className="relative group">
                <Link
                  to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                  className={`text-sm transition-colors duration-300 group-hover:text-blue-400
                    before:content-[''] before:absolute before:bottom-0 before:left-1/2 
                    before:translate-x-[-50%] before:h-[2px] before:w-0 
                    before:bg-blue-400 before:transition-all before:duration-300 
                    group-hover:before:w-full ${
                      scrolled ? "text-black dark:text-white" : "text-white"
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
                    scrolled ? "text-black dark:text-white" : "text-white"
                  }`}
              >
                Offer
              </span>

              <ul
                className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg opacity-0 invisible 
                group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50"
              >
                <li className="relative group/submenu cursor-pointer">
                  <span className="block px-4 py-2 hover:bg-gray-100 text-sm">
                    Rooms
                  </span>

                  <ul
                    className="absolute right-full top-0 mt-8 mr-1 w-64 bg-white shadow-lg opacity-0 invisible 
                    group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-300 ease-in-out z-50"
                  >
                    {dummyRooms.map((item) => (
                      <li
                        key={item.name}
                        onClick={() => navigate(`/room-category/${item.name}`)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                      >
                        {item.name}
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
                  onClick={() => navigate("/function-hall")}
                >
                  Function Hall
                </li>
              </ul>
            </li>

            {/* Theme Toggle */}
            <button onClick={toggleDarkMode}>
              {darkMode ? (
                <icons.IoSunnySharp className="text-yellow-500 text-lg" />
              ) : (
                <icons.IoMoonSharp className="text-gray-500 text-lg" />
              )}
            </button>

            {/* Sign In */}
            <button
              className="flex items-center gap-1 bg-blue-400 text-white font-semibold text-xs h-[30px] px-4 rounded-full transform transition duration-200 hover:scale-110"
              onClick={() => navigate("/signin")}
            >
              Sign In <icons.PiSignIn className="text-lg" />
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg z-40 md:hidden">
          <ul className="flex flex-col gap-4 p-4 text-sm text-black dark:text-white">
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
            </li>

            {/* Mobile Offer Dropdown */}
            <li>
              <button
                className="w-full text-left flex items-center justify-between"
                onClick={() => setMobileOfferOpen(!mobileOfferOpen)}
              >
                <span>Offer</span>
                <span>
                  {mobileOfferOpen ? (
                    <icons.MdOutlineKeyboardArrowUp className="text-lg dark:text-white text-black" />
                  ) : (
                    <icons.MdOutlineKeyboardArrowDown className="text-lg dark:text-white text-black" />
                  )}
                </span>
              </button>

              {mobileOfferOpen && (
                <ul className="pl-6 mt-2 flex flex-col gap-2">
                  <li>
                    <button
                      className="w-full text-left flex items-center justify-between"
                      onClick={() => setMobileRoomsOpen(!mobileRoomsOpen)}
                    >
                      Room Categories
                      <span>
                        {mobileOfferOpen ? (
                          <icons.MdOutlineKeyboardArrowUp className="text-lg dark:text-white text-black" />
                        ) : (
                          <icons.MdOutlineKeyboardArrowDown className="text-lg dark:text-white text-black" />
                        )}
                      </span>
                    </button>
                    {mobileRoomsOpen && (
                      <ul className="pl-6 mt-2 flex flex-col gap-3">
                        {dummyRooms.map((item) => (
                          <li
                            key={item.name}
                            onClick={() => {
                              navigate(`/room-category/${item.name}`);
                              setMobileMenuOpen(false);
                              setMobileOfferOpen(false);
                              setMobileRoomsOpen(false);
                            }}
                            className="cursor-pointer text-xs hover:underline py-1"
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      navigate("/cottages");
                      setMobileMenuOpen(false);
                      setMobileOfferOpen(false);
                    }}
                  >
                    Cottages
                  </li>
                  <li
                    className="cursor-pointer hover:underline"
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

            {/* Theme Toggle */}
            <li>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>

            {/* Sign In */}
            <li>
              <button
                onClick={() => {
                  navigate("/signin");
                  setMobileMenuOpen(false);
                }}
                className="bg-blue-400 text-white px-3 py-1 rounded-full text-xs"
              >
                Sign In
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
