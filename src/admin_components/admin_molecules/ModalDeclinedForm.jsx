import { motion } from "framer-motion";
import { icons } from "../../constant/icon";
import TextArea from "../../components/atoms/TextArea";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useState, useEffect } from "react";
import Toaster from "../../components/molecules/Toaster";

function ModalDeclinedForm({ userId, bookingId, action, onClose, onSuccess }) {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  // Hook for sending notification
  const {
    submit: sendNotification,
    loading: notifLoading,
    error: notifError,
  } = useFormSubmit("/notifications/notification.php");

  // Hooks for booking decline (both always declared)
  const {
    submit: submitDeclineFh,
    loading: declineLoadingFh,
    error: declineErrorFh,
  } = useFormSubmit("/booking/fh-booking.php");

  const {
    submit: submitDecline,
    loading: declineLoading,
    error: declineError,
  } = useFormSubmit("/booking/booking.php");

  // Submit handler
  const handleSubmit = async () => {
    const trimmed = message.trim();

    if (!trimmed) {
      setToast({
        message: "Please provide a reason for declining.",
        type: "error",
      });
      return;
    }

    if (trimmed.length < 5) {
      setToast({
        message: "Reason must be at least 5 characters long.",
        type: "error",
      });
      return;
    }

    try {
      // Choose correct API endpoint based on action
      const declineFunc = action === "fh" ? submitDeclineFh : submitDecline;

      // 1. Update booking status
      const declineRes = await declineFunc({
        action: "set_declined",
        id: bookingId,
        reason: trimmed,
      });

      if (!declineRes?.success && declineRes?.success !== undefined) {
        throw new Error("Decline action failed on the server.");
      }

      // 2. Send notification to user
      const notifRes = await sendNotification({
        from_: 12, // system/admin id — adjust as needed
        user_id: userId,
        message: `Your booking has been declined. Reason: ${trimmed}`,
      });

      if (!notifRes?.success && notifRes?.success !== undefined) {
        throw new Error("Notification failed to send.");
      }

      // 3. Show success
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
      console.error("Decline or Notification failed:", err);
      setToast({
        message: err.message || "Something went wrong while declining.",
        type: "error",
      });
    }
  };

  // Auto hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Overlay */}
      <div
        className="w-full h-screen bg-black/40 flex justify-center items-center pt-10 fixed inset-0 z-50"
        onClick={onClose} // Close when clicking outside modal
      >
        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()} // Prevent overlay close
          className="w-[500px] rounded-md dark:bg-gray-800 bg-white relative p-5 shadow-lg"
        >
          {/* Header */}
          <div className="w-full flex justify-between items-center dark:text-white text-gray-800 border-b pb-2">
            <p className="font-semibold text-lg">Decline Booking</p>
            <button
              onClick={onClose}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
            >
              <icons.MdOutlineClose className="text-xl cursor-pointer" />
            </button>
          </div>

          {/* TextArea Input */}
          <div className="mt-5">
            <TextArea
              label="Reason for declining"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Enter reason here..."
            />
          </div>

          {/* Error Display */}
          {(notifError || declineError || declineErrorFh) && (
            <p className="text-red-500 text-sm mt-2">
              {notifError?.message ||
                declineError?.message ||
                declineErrorFh?.message ||
                "Something went wrong."}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:opacity-80"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={notifLoading || declineLoading || declineLoadingFh}
              className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {declineLoading || declineLoadingFh || notifLoading
                ? "Processing..."
                : "Decline"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ModalDeclinedForm;
