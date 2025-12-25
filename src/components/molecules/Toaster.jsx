import React, { useEffect } from "react";

function Toaster({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-4
        left-1/2 -translate-x-1/2
        w-[80%] sm:w-auto
        lg:left-auto lg:right-4 lg:translate-x-0
        px-4 py-2 rounded shadow-lg text-white text-sm
        text-center
        z-[9999] transition-all duration-300
        ${
          type === "success"
            ? "bg-green-500"
            : type === "message"
            ? "bg-blue-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-gray-700"
        }
      `}
    >
      {message}
    </div>
  );
}

export default Toaster;
