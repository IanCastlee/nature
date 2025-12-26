import React, { useState } from "react";
import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";

function MessageUs() {
  const [open, setOpen] = useState(false);
  const { data } = useGetData(`/admin/admin_setting.php`);

  if (!data) return null;

  const globeNo = formatPhone(data.globe_no);
  const smartNo = formatPhone(data.smart_no);
  const fbLink = data.fb;

  function formatPhone(num) {
    if (!num) return "";
    return num.startsWith("0") ? `+63${num.slice(1)}` : num;
  }

  return (
    <div className="fixed bottom-5 right-1 lg:right-5 z-50 flex flex-col items-end gap-3">
      {/* CONTACT OPTIONS — ONLY RENDER WHEN OPEN */}
      {open && (
        <div className="flex flex-col gap-3 animate-slideUp">
          {/* Globe */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${globeNo}`}
              className="w-28 text-xs bg-black text-white px-4 py-2 border border-gray-500 rounded-l-full shadow-md text-center"
            >
              Globe
            </a>
            <a
              href={`tel:${globeNo}`}
              className="w-9 h-9 flex items-center justify-center bg-indigo-500 text-white rounded-full shadow-md"
            >
              <icons.FaPhoneAlt size={14} />
            </a>
          </div>

          {/* Smart */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${smartNo}`}
              className="w-28 text-xs bg-black text-white px-4 py-2 border border-gray-500 rounded-l-full shadow-md text-center"
            >
              Smart
            </a>
            <a
              href={`tel:${smartNo}`}
              className="w-9 h-9 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md"
            >
              <icons.FaPhoneAlt size={14} />
            </a>
          </div>

          {/* Messenger */}
          <div className="flex items-center gap-2">
            <a
              href={fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-28 text-xs bg-black text-white px-4 py-2 border border-gray-500 rounded-l-full shadow-md text-center"
            >
              Messenger
            </a>
            <a
              href={fbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-lg"
            >
              <icons.FaFacebookMessenger size={18} />
            </a>
          </div>
        </div>
      )}

      {/* MESSAGE US BUTTON */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-14 h-14 lg:w-16 lg:h-16
          bg-red-600 rounded-full
          flex items-center justify-center
          cursor-pointer
          shadow-lg
          hover:scale-110
          transition-transform duration-200
        "
      >
        <icons.RiCustomerService2Fill className="text-white text-3xl" />
      </div>
    </div>
  );
}

export default MessageUs;
