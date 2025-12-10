import React from "react";

function ViewReschedDetails({ data, onClose }) {
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
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-3xl relative text-sm">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-lg"
          >
            ✕
          </button>

          {/* Header */}
          <h2 className="text-2xl font-bold mb-6 dark:text-gray-100 border-b pb-3">
            Rescheduled Booking Details
          </h2>

          {/* Details */}
          <div className="space-y-4 text-gray-700 dark:text-gray-200 text-sm">
            {/* Name & Phone */}
            <div className="flex justify-between space-x-6 bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Full Name:
                </span>
                <div className="font-medium">{data.fullname}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Phone:
                </span>
                <div className="font-medium">{data.phone}</div>
              </div>
            </div>

            {/* Room Info */}
            <div className="flex justify-between space-x-6 bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Previous Room:
                </span>
                <div className="font-medium">{data.prev_room}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  New Room:
                </span>
                <div className="font-medium">{data.new_room}</div>
              </div>
            </div>

            {/* Stay Dates */}
            <div className="flex justify-between space-x-6 bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Original Stay:
                </span>
                <div className="font-medium">{data.sched_date}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Rescheduled Stay:
                </span>
                <div className="font-medium">{data.resched_to}</div>
              </div>
            </div>

            {/* Prices */}
            <div className="flex justify-between space-x-6 bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Original Price:
                </span>
                <div className="font-medium">
                  {formatCurrency(data.sched_total_price)}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Rescheduled Price:
                </span>
                <div className="font-medium">
                  {formatCurrency(data.resched_total_price)}
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="flex justify-between space-x-6 bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Paid (Original):
                </span>
                <div className="font-medium">
                  {formatCurrency(data.sched_paid_payment)}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Paid (Rescheduled):
                </span>
                <div className="font-medium">
                  {formatCurrency(data.resched_paid_payment)}
                </div>
              </div>
            </div>

            {/* Refund / Charge */}
            <div className="flex justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Refund / Charge:
              </span>
              <span className={`font-medium ${refundColor}`}>
                {formatCurrency(data.refund_charge)}
              </span>
            </div>

            {/* Created At */}
            <div className="flex justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Created At:
              </span>
              <span className="font-medium">{data.created_at}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewReschedDetails;
