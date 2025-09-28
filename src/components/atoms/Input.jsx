import React from "react";

function Input() {
  return (
    <div>
      <input
        type="text"
        id="name"
        name="name"
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

export default Input;
