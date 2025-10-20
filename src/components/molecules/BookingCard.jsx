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

  return (
    <div className="p-5 rounded-2xl shadow-md bg-gray-50 dark:bg-gray-900">
      {/* Room Details */}
      <h2 className="text-sm dark:text-gray-200 font-medium text-gray-800 mb-2 tracking-wide">
        Room Details
      </h2>
      <div className="mb-3">
        <h3 className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Room:
          </span>
          {room.room_name || "N/A"}
        </h3>
        <p className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Price:
          </span>
          {room.price ? `${formatCurrency(room.price)} / per night` : "N/A"}
        </p>
        <p className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Capacity:
          </span>
          {room.capacity || "N/A"} persons
        </p>
        <p className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Duration:
          </span>
          {room.duration ? `${room.duration} hours` : "N/A"}
        </p>
      </div>

      {/* Booking Details */}
      <div className="mt-5 mb-3">
        <h2 className="text-sm dark:text-gray-200 font-medium text-gray-800 mb-1 tracking-wide">
          Booking Details
        </h2>
        <h3 className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Check In:
          </span>
          {formatDate(booking.start_date)}
        </h3>
        <p className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Check Out:
          </span>
          {formatDate(booking.end_date)}
        </p>
        <p className="text-sm dark:text-gray-300 text-gray-800">
          <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
            Nights:
          </span>
          {booking.nights} night(s)
        </p>
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="mt-5">
          <h2 className="text-sm dark:text-gray-200 font-medium text-gray-800 mb-1 tracking-wide">
            Extras
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {extras.map((extra, index) => (
              <li
                key={index}
                className="text-sm dark:text-gray-300 text-gray-800"
              >
                {extra.name} — {extra.quantity} × {formatCurrency(extra.price)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status & Total */}
      <p className="text-sm dark:text-gray-300 text-gray-800 mt-3">
        <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
          Status:
        </span>
        {booking.status}
      </p>
      <p className="text-sm dark:text-gray-300 text-gray-800 font-semibold mt-1 bg-gray-200 py-1 px-2 rounded-full w-fit">
        <span className="text-xs dark:text-gray-400 text-gray-700 mr-2 tracking-wide">
          Total Price:
        </span>
        {formatCurrency(booking.price)}
      </p>
    </div>
  );
}

export default BookingCard;
