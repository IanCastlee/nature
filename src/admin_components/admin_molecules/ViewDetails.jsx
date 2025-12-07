import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";
import { useForm } from "../../store/useRoomStore";
import { motion } from "framer-motion";

function ViewDetails({ id }) {
  const setShowForm = useForm((state) => state.setShowForm);

  const {
    data: details,
    loading,
    error,
  } = useGetData(`/booking/get-booking.php?id=${id.booking_id}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading details.</p>;
  if (!details || details.length === 0) return null;

  const info = details[0];

  return (
    <div className="w-full h-screen bg-black/10 flex justify-center items-center fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[60%] max-h-[90%] bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-50">
            Booking Details
          </h3>

          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="cursor-pointer text-2xl text-gray-800 dark:text-gray-50 hover:text-red-500"
          />
        </div>

        {/* Customer & Booking Info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200 mb-6">
          <p>
            <strong>Booking ID:</strong> {info.booking_id}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="capitalize">{info.status}</span>
          </p>
          <p>
            <strong>Full Name:</strong> {info.fullname}
          </p>
          <p>
            <strong>Phone:</strong> {info.phone}
          </p>
          <p>
            <strong>Start Date:</strong> {info.start_date}
          </p>
          <p>
            <strong>End Date:</strong> {info.end_date}
          </p>
          <p>
            <strong>Nights:</strong> {info.nights}
          </p>
        </div>

        {/* Room Info */}
        <div className="border-t dark:border-gray-700 border-gray-200 pt-4 mb-6">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">
            Room Information
          </h4>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>
              <strong>Room:</strong> {info.room.room_name}
            </p>
            <p>
              <strong>Capacity:</strong> {info.room.capacity} persons
            </p>
            <p>
              <strong>Duration:</strong> {info.room.duration} hours
            </p>
            <p>
              <strong>Room Price:</strong> ₱
              {parseFloat(info.room.price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="border-t dark:border-gray-700 border-gray-200 pt-4 mb-6">
          <h4 className="text-sm font-semibold dark:text-white mb-2">
            Payment Details
          </h4>
          <p className="text-sm dark:text-gray-300 text-gray-700">
            <strong>Total Price:</strong> ₱
            {parseFloat(info.price).toLocaleString()}
          </p>
          <p className="text-sm dark:text-gray-300 text-gray-700">
            <strong>Half Price:</strong> ₱
            {parseFloat(info.half_price).toLocaleString()}
          </p>
          <p className="text-sm dark:text-gray-300 text-gray-700">
            <strong>Paid:</strong> ₱{parseFloat(info.paid).toLocaleString()}
          </p>
        </div>

        {/* DECLINE NOTE — Professional UI */}
        {info.status === "declined" && info.note && (
          <div className="border-t dark:border-gray-700 border-gray-200 pt-4 mb-6">
            <h4 className="text-sm font-semibold dark:text-white mb-3">
              Decline Reason
            </h4>

            <div
              className="
              bg-red-50 
              border border-red-200 
              dark:bg-red-900/20 
              dark:border-red-800 
              p-3 rounded-md
            "
            >
              <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-line leading-relaxed">
                {info.note}
              </p>
            </div>
          </div>
        )}

        {/* Extras */}
        <div className="border-t dark:border-gray-700 border-gray-200 pt-4">
          <h4 className="text-sm font-semibold dark:text-white mb-2">Extras</h4>

          {info.extras.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No extras selected.
            </p>
          ) : (
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {info.extras.map((x, i) => (
                <li key={i}>
                  {x.quantity} × {x.name} — ₱
                  {parseFloat(x.price).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ViewDetails;
