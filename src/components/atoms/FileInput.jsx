import React from "react";

function FileInput({ onChange }) {
  return (
    <div className="w-full">
      <label htmlFor="" className="text-xs dark:text-gray-300">
        File
      </label>
      <input
        type="file"
        onChange={onChange}
        required
        className="mt-1 block w-full px-3 py-2 dark:border-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}

export default FileInput;
