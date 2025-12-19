import React from "react";
import { useForm } from "../../store/useRoomStore";

function ViewFhBookingDetails({ booking, status }) {
  if (!booking) return null;
  const setShowForm = useForm((state) => state.setShowForm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80">
      <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Function Hall Reservation Information
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide
              ${
                booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : booking.status === "approved"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }
            `}
          >
            {booking.status}
          </span>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-5 text-sm max-h-[75vh] overflow-y-auto dark:text-gray-200">
          {/* Customer Info */}
          <Section title="Customer Information">
            <Detail label="Full Name" value={booking.fullname} />
            <Detail label="Phone Number" value={booking.phone} />
          </Section>

          {/* Booking Info */}
          <Section title="Booking Information">
            <Detail label="Booking ID" value={booking.id} />
            <Detail label="Facility" value={booking.facility_type} />
            <HighlightDetail
              label="Event Date"
              value={booking.date}
              type="checkin"
            />
            <HighlightDetail
              label="Start Time"
              value={booking.start_time}
              type="checkout"
            />
            <Detail label="Booking Created" value={booking.bookedDate} />
          </Section>

          {/* Payment Info */}
          <Section title="Payment Summary">
            <Detail label="Full Price" value={booking.price} />
            {status !== "arrived" && status !== "not_attended" && (
              <Detail
                label={
                  status === "approved" ? "Balance to Pay" : "Required Payment"
                }
                value={booking.half_price}
              />
            )}
            <Detail label="Amount Paid" value={booking.paid} />
          </Section>

          {/* Decline Reason */}
          {status === "declined" && booking.booking_note_fh && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <h4 className="text-sm font-semibold dark:text-gray-200 mb-3">
                Decline Reason
              </h4>
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-3 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-line leading-relaxed">
                  {booking.booking_note_fh}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 dark:bg-gray-800 px-6 py-4 dark:border-gray-700">
          <button
            onClick={() => setShowForm(null)}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
  return (
    <div className="rounded-lg border bg-gray-50 dark:bg-gray-800 p-4 dark:border-gray-700">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
        {value || "-"}
      </span>
    </div>
  );
}

function HighlightDetail({ label, value, type }) {
  const styles = {
    checkin:
      "bg-green-50 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-300",
    checkout:
      "bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300",
  };

  return (
    <div
      className={`col-span-1 rounded-md border-l-4 p-3 ${styles[type] || ""}`}
    >
      <p className="text-xs uppercase tracking-wide font-semibold opacity-70 dark:text-gray-300">
        {label}
      </p>
      <p className="text-sm font-bold dark:text-gray-100">{value || "-"}</p>
    </div>
  );
}

export default ViewFhBookingDetails;
