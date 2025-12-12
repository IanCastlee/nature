import React from "react";

function ViewReschedDetailsFh({ data, onClose }) {
  if (!data) return null;

  const formatCurrency = (value) =>
    `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const refundColor =
    Number(data.refund_charge) >= 0 ? "text-green-600" : "text-red-600";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl w-full max-w-3xl relative text-xs">
          {" "}
          {/* text-xs for smaller font */}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-base"
          >
            ✕
          </button>
          {/* Header */}
          <h2 className="text-lg font-bold mb-3 dark:text-gray-100 border-b pb-1">
            {" "}
            {/* smaller heading */}
            Function Hall Rescheduled Booking Details
          </h2>
          {/* Details */}
          <div className="space-y-2 text-gray-700 dark:text-gray-200">
            {/* Name & Phone */}
            <div className="flex justify-between space-x-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded">
              <div>
                <span className="font-semibold">Full Name:</span>
                <div className="font-medium">{data.fullname}</div>
              </div>
              <div>
                <span className="font-semibold">Phone:</span>
                <div className="font-medium">{data.phone}</div>
              </div>
            </div>

            {/* Facility Info */}
            <div className="flex justify-between space-x-3 bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
              <div>
                <span className="font-semibold">Previous Facility:</span>
                <div className="font-medium">{data.prev_facility}</div>
              </div>
              <div>
                <span className="font-semibold">New Facility:</span>
                <div className="font-medium">{data.new_facility}</div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded space-y-1">
              <span className="font-semibold">Original Schedule:</span>
              <div className="font-medium">
                Date: {data.sched_date}
                <br />
                Time: {data.sched_time} AM
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded space-y-1">
              <span className="font-semibold">Rescheduled Schedule:</span>
              <div className="font-medium">
                Date: {data.resched_date}
                <br />
                Time: {data.resched_time} AM
              </div>
            </div>

            {/* Prices */}
            <div className="flex justify-between space-x-3 bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
              <div>
                <span className="font-semibold">Original Price:</span>
                <div className="font-medium">
                  {formatCurrency(data.sched_total_price)}
                </div>
              </div>
              <div>
                <span className="font-semibold">Rescheduled Price:</span>
                <div className="font-medium">
                  {formatCurrency(data.resched_total_price)}
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="flex justify-between space-x-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded">
              <div>
                <span className="font-semibold">Paid (Original):</span>
                <div className="font-medium">
                  {formatCurrency(data.sched_paid_payment)}
                </div>
              </div>
              <div>
                <span className="font-semibold">Paid (Rescheduled):</span>
                <div className="font-medium">
                  {formatCurrency(data.resched_paid_payment)}
                </div>
              </div>
            </div>

            {/* Refund / Charge */}
            <div className="flex justify-between bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
              <span className="font-semibold">Refund / Charge:</span>
              <span className={`font-medium ${refundColor}`}>
                {formatCurrency(data.refund_charge)}
              </span>
            </div>

            {/* Created At */}
            <div className="flex justify-between bg-gray-100 dark:bg-gray-800 p-1.5 rounded">
              <span className="font-semibold">Created At:</span>
              <span className="font-medium">{data.created_at}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewReschedDetailsFh;
