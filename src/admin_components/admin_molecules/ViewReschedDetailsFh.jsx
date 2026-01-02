import { icons } from "../../constant/icon";
function ViewReschedDetailsFh({ data, onClose }) {
  console.log("first", data);
  if (!data) return null;

  const formatCurrency = (value) =>
    `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const refundColor =
    Number(data.refund_charge) >= 0 ? "text-green-600" : "text-red-600";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Rescheduled Booking Details
            </h2>
            <icons.MdOutlineClose
              onClick={onClose}
              className="cursor-pointer text-2xl text-gray-700 dark:text-gray-50 hover:text-red-500"
            />
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 text-sm text-gray-700 dark:text-gray-200">
            {/* Guest Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Full Name
                </span>
                <div className="mt-1 font-medium">{data.guest}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Phone
                </span>
                <div className="mt-1 font-medium">{data.phone}</div>
              </div>
            </div>

            {/* Room Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Previous Room
                </span>
                <div className="mt-1 font-medium">{data.previous_facility}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  New Room
                </span>
                <div className="mt-1 font-medium">{data.new_facility}</div>
              </div>
            </div>

            {/* Stay Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Original Date
                </span>
                <div className="mt-1 font-medium">{data.prev_date}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Rescheduled Date
                </span>
                <div className="mt-1 font-medium">{data.new_date}</div>
              </div>
            </div>

            {/* Payments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Paid (Original)
                </span>
                <div className="mt-1 font-medium">
                  {formatCurrency(data.previous_paid)}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  Paid (Rescheduled)
                </span>
                <div className="mt-1 font-medium">
                  {formatCurrency(data.new_paid)}
                </div>
              </div>
            </div>

            {/* Refund / Charge */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Refund / Charge
              </span>
              <span
                className={`font-medium ${
                  Number(data.refund_recharge) < 0
                    ? "text-red-600 dark:text-red-400"
                    : Number(data.refund_recharge) > 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatCurrency(data.refund_recharge)}
              </span>
            </div>

            {/* Created At */}
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Created At
              </span>
              <span className="font-medium">{data.inserted_at}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewReschedDetailsFh;
