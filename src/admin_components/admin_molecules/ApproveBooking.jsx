import { useState } from "react";
import { icons } from "../../constant/icon";
import { useForm } from "../../store/useRoomStore";
import useSetInactive from "../../hooks/useSetInactive";
import Toaster from "../../components/molecules/Toaster";

export default function ApproveBooking({ data, refetch, setToast }) {
  const setShowForm = useForm((state) => state.setShowForm);

  const [paymentType, setPaymentType] = useState("half");
  const [customAmount, setCustomAmount] = useState("");

  const {
    setInactive: approveBooking,
    loading,
    error,
  } = useSetInactive("/booking/booking.php", () => {
    setToast({
      message:
        paymentType === "half"
          ? "Booking set as approved with 50% payment"
          : paymentType === "full"
          ? "Booking set as approved with full payment"
          : "Booking approved with custom payment",
      type: "success",
    });

    refetch?.();
    setShowForm(null); // modal closes, toast stays
  });

  if (!data) return null;

  // Parse formatted currency (₱7,420.00 → 7420)
  const price = Number(String(data.price).replace(/[₱,]/g, ""));

  const getPayAmount = () => {
    if (paymentType === "full") return price;
    if (paymentType === "half") return price / 2;
    if (paymentType === "custom") return Number(customAmount || 0);
    return 0;
  };

  const payAmount = getPayAmount();

  const isInvalid =
    payAmount <= 0 || payAmount > price || Number.isNaN(payAmount);

  const handleApprove = () => {
    if (isInvalid || loading) return;

    approveBooking({
      action: "set_approve",
      booking_id: data.booking_id,
      payment_type: paymentType,
      amount: payAmount,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 ${
          loading ? "pointer-events-none" : ""
        }`}
        onClick={() => !loading && setShowForm(null)}
      />

      {/* Modal */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Approve Booking
            </h2>
            <button
              onClick={() => !loading && setShowForm(null)}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <icons.IoIosCloseCircleOutline size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Guest:</span> {data.fullname}
              </p>
              <p>
                <span className="font-medium">Room:</span> {data.room_name}
              </p>
              <p className="font-bold">
                <span className="font-bold">Total Price:</span> ₱
                {price.toFixed(2)}
              </p>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentType === "half"}
                  onChange={() => setPaymentType("half")}
                />
                <span className="text-sm">
                  50% Payment (₱{(price / 2).toFixed(2)})
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentType === "full"}
                  onChange={() => setPaymentType("full")}
                />
                <span className="text-sm">
                  Full Payment (₱{price.toFixed(2)})
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={paymentType === "custom"}
                  onChange={() => setPaymentType("custom")}
                />
                <span className="text-sm">Custom Amount</span>
              </label>

              {paymentType === "custom" && (
                <input
                  type="number"
                  min="1"
                  max={price}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              )}
            </div>

            {/* Summary */}
            <div className="border-t pt-3 text-sm flex justify-between">
              <span className="text-gray-600">Amount to Pay</span>
              <span className="font-semibold">₱{payAmount.toFixed(2)}</span>
            </div>

            {isInvalid && (
              <p className="text-xs text-red-500">
                Invalid amount. Must not exceed total price.
              </p>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t flex justify-end gap-3">
            <button
              onClick={() => setShowForm(null)}
              className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={handleApprove}
              disabled={isInvalid || loading}
              className={`px-4 py-2 text-sm rounded-md text-white flex items-center justify-center min-w-[120px] ${
                isInvalid || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Approve"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
