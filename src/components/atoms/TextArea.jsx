import React from "react";

function TextArea({ label, isNumber, onChange, value, ...rest }) {
  return (
    <div className="w-full">
      <label htmlFor="" className="text-xs dark:text-gray-300">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        required
        {...rest}
        rows="4"
        cols="50"
        className="mt-1 block w-full px-3 py-2 dark:border-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
      ></textarea>
    </div>
  );
}

export default TextArea;
