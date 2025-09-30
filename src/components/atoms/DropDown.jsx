import React, { useState } from "react";

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
        <option value="" disabled>
          -- Select a title --
        </option>
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default DropDown;
