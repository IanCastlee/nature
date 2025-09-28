import React from "react";

function ReadMoreButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row dark:border dark:border-blue-400  bg-black items-center text-white text-sm font-medium rounded-sm h-[30px] px-2 self-end ml-auto hover:bg-gray-800 mt-auto "
    >
      {label}
    </button>
  );
}

export default ReadMoreButton;
