import React from "react";

function Input({ label, type, onChange, value, ...rest }) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={rest.id || rest.name}
          className="text-xs  text-gray-600 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        {...rest}
        className="mt-1 block w-full px-3 py-2 dark:border-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}

export default Input;
