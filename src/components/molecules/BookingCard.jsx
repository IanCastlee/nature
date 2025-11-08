import React from "react";

function BookingCard({ booking }) {
  if (!booking) return null;

  const room = booking.room || {};
  const extras = booking.extras || [];

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₱0.00";
    return Number(amount).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 transition hover:shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {room.room_name || "Room"}
        </h2>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status || "Unknown"}
        </span>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Room Info */}
      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Price:
          </span>{" "}
          {room.price ? `${formatCurrency(room.price)} / night` : "N/A"}
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Capacity:
          </span>{" "}
          {room.capacity || "N/A"} persons
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Duration:
          </span>{" "}
          {room.duration ? `${room.duration} hours` : "N/A"}
        </p>
      </div>

      {/* Booking Info */}
      <div className="mt-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
        <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-1">
          Booking Details
        </h3>
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Check-In:
          </span>{" "}
          {formatDate(booking.start_date)}
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Check-Out:
          </span>{" "}
          {formatDate(booking.end_date)}
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-gray-400">
            Nights:
          </span>{" "}
          {booking.nights || "N/A"}
        </p>
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="mt-5">
          <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-2">
            Extras
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {extras.map((extra, index) => (
              <li key={index}>
                {extra.name} — {extra.quantity} × {formatCurrency(extra.price)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Total */}
      <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl flex justify-between items-center">
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          Total Price:
        </span>
        <span className="text-lg font-semibold text-blue-700 dark:text-blue-400">
          {formatCurrency(booking.price)}
        </span>
      </div>
    </div>
  );
}

export default BookingCard;
