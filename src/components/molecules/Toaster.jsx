import React, { useEffect } from "react";

function Toaster({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  console.log("first", type);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white text-sm z-[9999] transition-all duration-300 ${
        type === "success"
          ? "bg-green-500"
          : type === "message"
          ? "bg-blue-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-gray-700"
      }`}
    >
      {message}
    </div>
  );
}

export default Toaster;
