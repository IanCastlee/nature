import React from "react";

function SearchInput({ placeholder, value, onChange, disabled }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-64 h-[35px] text-xs px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={disabled}
    />
  );
}

export default SearchInput;
