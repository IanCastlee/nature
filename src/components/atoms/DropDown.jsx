import React, { useState } from "react";
import { icons } from "../../constant/icon";
function DropDown({ options }) {
  const [selectedTitle, setSelectedTitle] = useState("");

  return (
    <div className="w-full">
      <label htmlFor="title" className="text-xs dark:text-gray-300">
        Title
      </label>
      <select
        id="title"
        name="title"
        className="mt-1 block w-full px-3 py-2  dark:border-none  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
        value={selectedTitle}
        onChange={(e) => setSelectedTitle(e.target.value)}
      >
        <option className="text-center" value="" disabled>
          -- Select a title --
        </option>
        {options &&
          options.map((option) => (
            <option key={option.category_id} value={option.category}>
              <icons.IoCheckmarkCircle className="text-green-600 text-lg" />
              {option.category}
            </option>
          ))}
      </select>
    </div>
  );
}

export default DropDown;
