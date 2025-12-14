import { useForm } from "../../store/useRoomStore";
import { motion } from "framer-motion";

function ViewDetails({ active, data }) {
  const setShowForm = useForm((state) => state.setShowForm);
  console.log("FDATA : ", data);
  if (!data) return null;

  const info = data;

  // Normalize extras
  const extras = info.extras
    ? Array.isArray(info.extras)
      ? info.extras
      : [{ name: info.extras, quantity: 1, price: "" }]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-start justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Booking Details
            </h2>
            <p className="text-sm text-gray-500">
              Function Hall Reservation Information
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
              ${
                info.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : info.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {info.status}
          </span>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* CUSTOMER INFO */}
          <Section title="Customer Information">
            <Info label="Full Name" value={info.fullname} />
            <Info label="Phone Number" value={info.phone} />
          </Section>

          {/* BOOKING INFO */}
          <Section title="Booking Information">
            <Info label="Booking ID" value={info.booking_id} />
            <Info
              label="Facility"
              value={info.room?.room_name || info.room_name}
            />

            <HighlightInfo
              label="Check-In Date"
              value={info.start_date}
              type="checkin"
            />

            <HighlightInfo
              label="Check-Out Date"
              value={info.end_date}
              type="checkout"
            />

            <Info label="Booking Created" value={info.bookedDate} />
            <Info label="Nights" value={info.nights} />
          </Section>

          {/* PAYMENT SUMMARY */}
          <Section title="Payment Summary">
            <Info label="Full Price" value={info.price} />
            <Info label="Amount Paid" value={info.paid} />

            {active !== "arrived" && (
              <Info
                label={
                  active === "approved" ? "Balance to Pay" : "Required Payment"
                }
                value={info.half_price}
              />
            )}
          </Section>

          {/* DECLINE NOTE */}
          {info.status === "declined" && info.note && (
            <Section title="Decline Reason">
              <div className="col-span-2 bg-red-50 border border-red-200 p-4 rounded-md">
                <p className="text-sm text-red-700 whitespace-pre-line">
                  {info.note}
                </p>
              </div>
            </Section>
          )}

          {/* EXTRAS */}
          <Section title="Extras">
            {extras.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-2">
                No extras selected.
              </p>
            ) : (
              <ul className="col-span-2 space-y-1 text-sm text-gray-700">
                {extras.map((x, i) => (
                  <li key={i}>
                    {x.quantity ? `${x.quantity} × ` : ""}
                    {x.name} {x.price ? `— ${x.price}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setShowForm(null)}
            className="px-5 py-2 text-sm font-medium border rounded-md text-gray-700 bg-white hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ===== REUSABLE COMPONENTS ===== */

function Section({ title, children }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-y-3 gap-x-6">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value ?? "-"}</p>
    </div>
  );
}

function HighlightInfo({ label, value, type }) {
  const styles = {
    checkin: "bg-green-50 border-green-400 text-green-800",
    checkout: "bg-blue-50 border-blue-400 text-blue-800",
  };

  return (
    <div
      className={`col-span-1 rounded-md border-l-4 p-3 ${styles[type] || ""}`}
    >
      <p className="text-xs uppercase tracking-wide font-semibold opacity-70">
        {label}
      </p>
      <p className="text-sm font-bold">{value ?? "-"}</p>
    </div>
  );
}

export default ViewDetails;
