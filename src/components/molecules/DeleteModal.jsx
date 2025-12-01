import { icons } from "../../constant/icon";
import Button from "../../admin_components/admin_atoms/Button";
import { motion } from "framer-motion";

function DeleteModal({
  item,
  name,
  loading,
  onCancel,
  label,
  label2,
  label3,
  onConfirm,
}) {
  // Determine message text
  const message = (() => {
    switch (label2) {
      case "approve this booking":
        return "Are you sure you want to approve this booking?";

      case "decline this booking":
        return "Are you sure you want to decline this booking?";

      case "arrived":
        return name
          ? `You are about to mark ${name}'s booking as arrived.`
          : "You are about to mark this booking as arrived.";

      case "pending":
        return name
          ? `You are about to move ${name}'s booking back to pending.`
          : "You are about to move this booking back to pending.";

      case "back_approved":
        return name
          ? `You are about to move ${name}'s booking back to approved.`
          : "You are about to move this booking back to approved.";

      default:
        return "Are you sure you want to continue?";
    }
  })();

  return (
    <div className="w-full h-screen bg-black/10 flex justify-center items-start pt-10 fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-[300px] rounded-md dark:bg-gray-800 bg-white relative p-2 shadow-lg"
      >
        <div className="mt-8">
          <p className="text-center text-sm font-medium dark:text-white text-gray-800">
            {message}
          </p>

          {label3 && (
            <p className="text-center text-xs dark:text-gray-200 font-medium text-gray-600 mt-5">
              {label3}
            </p>
          )}
        </div>

        <div className="flex flex-row justify-end items-center gap-2 mt-5">
          <Button
            className="h-[28px] border dark:border-gray-700 border-gray-200 px-2 dark:bg-gray-800 text-xs text-gray-800 dark:text-white font-medium rounded-md w-auto hover:bg-gray-300 dark:hover:bg-gray-700"
            label="Cancel"
            onClick={onCancel}
          />
          <Button
            disabled={loading}
            onClick={onConfirm}
            className={`h-[28px] px-2 ${
              label === "Yes, Approve" ||
              label2 === "approve post" ||
              label2 === "arrived" ||
              label2 === "active"
                ? "bg-green-600"
                : "bg-red-500"
            } text-xs text-white font-medium rounded-md w-auto hover:bg-gray-600`}
            label={loading ? "Updating..." : label}
          />
        </div>

        <div className="dark:bg-gray-700 bg-gray-100 h-[50px] w-[50px] rounded-full flex justify-center items-center absolute p-1 -top-4 right-0">
          <div className="rounded-full dark:bg-gray-800 bg-white h-full w-full flex justify-center items-center">
            <icons.LuMessageCircleWarning className="text-[40px] dark:text-gray-400 text-gray-600" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DeleteModal;
