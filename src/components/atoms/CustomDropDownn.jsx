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
      {/* LABEL */}
      <label className="text-xs text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* BUTTON */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="mt-1 flex justify-between items-center w-full px-3 py-2 
        border rounded-md shadow-sm 
        border-gray-300 dark:border-gray-600 
        bg-white dark:bg-gray-700 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
      >
        {selectedOption ? (
          <span className="flex items-center justify-between w-full text-xs text-gray-700 dark:text-gray-200">
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
          <span className="text-gray-400 dark:text-gray-500">
            -- Select Category --
          </span>
        )}

        <icons.MdOutlineArrowDropDownCircle className="ml-2 text-gray-400 dark:text-gray-300 text-lg" />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <ul
          className={`absolute z-50 w-full max-h-60 overflow-auto rounded-md 
          bg-white dark:bg-gray-700 
          shadow-lg ring-1 ring-black ring-opacity-5 
          focus:outline-none text-sm
          ${top ? "bottom-full mb-1" : "mt-1"}`}
        >
          {options?.map((option) => (
            <li
              key={option[valueKey]}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer select-none px-4 py-2 
              hover:bg-gray-100 dark:hover:bg-gray-600 
              flex justify-between items-center text-xs 
              text-gray-700 dark:text-gray-200"
            >
              <span className="flex items-center gap-2">
                <icons.IoCheckmarkCircle className="text-gray-500 dark:text-gray-300 text-lg" />
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
