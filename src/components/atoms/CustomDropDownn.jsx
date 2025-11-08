import React, { useRef, useEffect, useState } from "react";
import { icons } from "../../constant/icon";

function CustomDropDownn({
  options,
  label,
  value,
  top,
  onChange,
  valueKey = "id",
  labelKey = "name",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options?.find((option) => option[valueKey] === value);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs dark:text-gray-300">{label}</label>
      <button
        type="button"
        onClick={toggleDropdown}
        className="mt-1 flex justify-between items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
      >
        {selectedOption ? (
          <span className="flex items-center justify-between w-full text-xs">
            <span className="flex items-center gap-2">
              <icons.IoCheckmarkCircle className="text-green-500 text-lg" />
              {selectedOption[labelKey]}
            </span>
            {selectedOption.price !== undefined && (
              <span className="text-gray-500 dark:text-gray-300 text-xs">
                ₱{selectedOption.price}
              </span>
            )}
          </span>
        ) : (
          <span className="text-gray-400">-- Select Category --</span>
        )}
        <icons.MdOutlineArrowDropDownCircle className="ml-2 text-gray-400 text-lg" />
      </button>

      {isOpen && (
        <ul
          className={`absolute z-50 w-full max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm
            ${top ? "bottom-full mb-1" : "mt-1"}`}
        >
          {options?.map((option) => (
            <li
              key={option[valueKey]}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer select-none px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center text-gray-900 dark:text-white text-xs"
            >
              <span className="flex items-center gap-2">
                <icons.IoCheckmarkCircle className="text-gray-500 text-lg" />
                {option[labelKey]}
              </span>
              {option.price !== undefined && (
                <span className="text-gray-500 dark:text-gray-300 text-xs">
                  ₱{option.price}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomDropDownn;
