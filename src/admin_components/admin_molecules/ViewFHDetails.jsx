import { icons } from "../../constant/icon";
import { useForm } from "../../store/useRoomStore";
import { motion } from "framer-motion";

function ViewFHDetails({ booking }) {
  const setShowForm = useForm((state) => state.setShowForm);

  // Map of labels and keys to display dynamically
  const bookingFields = [
    { label: "Guest Name", key: "fullname" },
    { label: "Phone", key: "phone" },
    { label: "Function Hall", key: "name" },
    { label: "Booked Date", key: "bookedDate" },
    { label: "Event Date", key: "date" },
    { label: "Start Time", key: "start_time" },
    { label: "Total Price", key: "price", isCurrency: true },
    { label: "Required Payment", key: "half_price", isCurrency: true },
    { label: "Paid", key: "paid", isCurrency: true },
    { label: "Status", key: "status", isStatus: true },
  ];

  // Format as PHP currency safely
  const formatCurrency = (value) => {
    if (!value) return "₱0.00";

    // Remove any non-digit/decimal characters (like ₱ or ,)
    const numberValue = parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(numberValue)) return "₱0.00";

    return `₱${numberValue.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-[70%] max-h-[92%] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-y-auto p-6"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
            Function Hall Booking Details
          </h2>

          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="cursor-pointer text-2xl text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          />
        </div>

        {/* BOOKING DETAILS */}
        <div className="pt-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 tracking-wide">
            Booking Information
          </h3>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {bookingFields.map((field) => {
              if (booking[field.key] == null) return null; // Skip if field is missing

              let value = booking[field.key];

              // Format currency
              if (field.isCurrency) {
                value = formatCurrency(value);
              }

              // Highlight status
              if (field.isStatus) {
                value = (
                  <span
                    className={`font-medium ${
                      value === "declined"
                        ? "text-red-500"
                        : value === "approved"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {value}
                  </span>
                );
              }

              return (
                <Detail key={field.key} label={field.label} value={value} />
              );
            })}
          </div>

          {/* Decline Note (only if exists) */}
          {booking.booking_note_fh && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Decline Reason:
              </p>
              <p className="text-sm text-red-500 mt-1 leading-relaxed">
                {booking.booking_note_fh}
              </p>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        {booking.description && (
          <div className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
              Description
            </h3>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
              {booking.description || "-"}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Helper Component for clean label/value alignment
function Detail({ label, value }) {
  return (
    <p className="flex text-sm leading-relaxed">
      <span className="font-semibold w-36 text-gray-800 dark:text-gray-100">
        {label}:
      </span>
      <span className="text-gray-700 dark:text-gray-300 flex-1">{value}</span>
    </p>
  );
}

export default ViewFHDetails;
