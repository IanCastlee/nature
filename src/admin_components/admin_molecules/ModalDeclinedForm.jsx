import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import TextArea from "../../components/atoms/TextArea";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useState, useEffect } from "react";
import Toaster from "../../components/molecules/Toaster";

function ModalDeclinedForm({ userId, bookingId, onClose, onSuccess }) {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  const {
    submit: sendNotification,
    loading: notifLoading,
    error: notifError,
  } = useFormSubmit("/notifications/notification.php", () => {});

  const {
    submit: submitDecline,
    loading: declineLoading,
    error: declineError,
  } = useFormSubmit("/booking/booking.php", () => {});

  const handleSubmit = async () => {
    if (!message.trim()) {
      setToast({
        message: "Please provide a reason for declining.",
        type: "error",
      });
      return;
    }

    try {
      // 1. Set booking as declined
      const declineRes = await submitDecline({
        action: "set_declined",
        id: bookingId,
        reason: message.trim(),
      });

      // 2. Send notification to user
      const notifRes = await sendNotification({
        from_: 12, // Replace with actual admin ID or user id if available
        user_id: userId,
        message: `Your booking has been declined. Reason: ${message.trim()}`,
      });

      // 3. Show success toast
      setToast({
        message: "Booking declined and user notified successfully.",
        type: "success",
      });

      // 4. Close modal after short delay
      setTimeout(() => {
        onClose?.();
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error("Decline or Notification failed", err);
      setToast({
        message: "Something went wrong while declining the booking.",
        type: "error",
      });
    }
  };

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full h-screen bg-black/10 flex justify-center items-center pt-10 fixed inset-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-[500px] rounded-md dark:bg-gray-800 bg-white relative p-4 shadow-lg"
        >
          {/* Header */}
          <div className="w-full flex justify-between items-center dark:text-white text-gray-800">
            <p className="font-semibold text-lg">Decline Booking</p>
            <button onClick={onClose}>
              <icons.MdOutlineClose className="text-xl cursor-pointer" />
            </button>
          </div>

          {/* TextArea */}
          <div className="mt-5">
            <TextArea
              label="Reason for declining"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          {/* Error message if any */}
          {(notifError || declineError) && (
            <p className="text-red-500 text-sm mt-2">
              {notifError?.message ||
                declineError?.message ||
                "Something went wrong."}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end mt-5 gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={notifLoading || declineLoading}
              className="px-4 py-2 text-sm rounded bg-red-600 text-white disabled:opacity-50"
            >
              {declineLoading || notifLoading ? "Processing..." : "Decline"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ModalDeclinedForm;
