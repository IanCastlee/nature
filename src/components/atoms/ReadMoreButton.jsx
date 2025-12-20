import React from "react";

function ReadMoreButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row dark:border dark:border-blue-400 border border-blue-400  bg-transparent items-center dark:text-gray-100 text-sm font-medium rounded-sm h-[30px] px-2 self-end ml-auto hover:bg-gray-800 hover:text-white mt-auto "
    >
      {label}
    </button>
  );
}

export default ReadMoreButton;
