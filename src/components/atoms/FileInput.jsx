import React from "react";

function FileInput({ onChange, isRequired, label, hide = false, id }) {
  return (
    <div className={`w-full ${hide ? "hidden" : ""}`}>
      {label && (
        <label htmlFor={id} className="text-xs dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type="file"
        onChange={onChange}
        required={isRequired}
        className="mt-1 block w-full px-3 py-2 dark:border-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}

export default FileInput;
