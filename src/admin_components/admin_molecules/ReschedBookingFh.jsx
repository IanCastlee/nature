import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { fhbooking } from "../../constant/tableColumns";
import useSetInactive from "../../hooks/useSetInactive";
import Toaster from "../../components/molecules/Toaster";
import { icons } from "../../constant/icon";
function ReSchedBookingFh({ booking, refetchApproved }) {
  const setShowForm = useForm((state) => state.setShowForm);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showComputationModal, setShowComputationModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);

  const [paymentType, setPaymentType] = useState("half");
  const [customAmount, setCustomAmount] = useState("");

  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Fetch pending FH bookings
  const { data, loading, error, refetch } = useGetData(
    `/booking/get-fhbooking.php?status=pending`
  );

  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/reschedule_fh.php",
    () => {
      setToast({ message: "Booking updated successfully!", type: "success" });
      setShowComputationModal(false);
      refetch();
      refetchApproved();
      setShowForm(null);
    }
  );

  const toNumber = (value) => {
    if (value == null || value === "") return 0;
    return Number(value.toString().replace(/[₱,]/g, ""));
  };

  // Filtering
  // FILTERING
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const s = String(searchTerm).toLowerCase();

      return (
        String(item?.id || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.fullname || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.phone || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.name || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.start_time || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.end_time || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.date || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.status || "")
          .toLowerCase()
          .includes(s)
      );
    }) || [];

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Format table data
  const formattedData = currentData.map((item) => ({
    ...item,
    price: `₱${Number(item.price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    half_price: `₱${Number(item.half_price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }));

  // Handle Reschedule
  const handleReschedule = async () => {
    if (!newBooking) return;

    const prevPaid = toNumber(booking.paid);
    const newPrice = toNumber(newBooking.price);

    const paymentAmount =
      paymentType === "half"
        ? toNumber(newBooking.half_price)
        : Number(customAmount) || 0;

    // Validate payment amount
    if (paymentAmount <= 0 || paymentAmount > newPrice) {
      setToast({
        message:
          "Please enter a valid payment amount not exceeding the new price.",
        type: "error",
      });
      return;
    }

    const difference = prevPaid - paymentAmount;

    // Explicit statuses to prevent PHP conflicts
    const oldStatus = "resched";
    const newStatus = "rescheduled";

    try {
      await setInactive({
        booking_id: booking.id,
        new_booking_id: newBooking.id,
        paid: paymentAmount,
        difference,
        old_status: oldStatus,
        new_status: newStatus,
      });
      // Callback in useSetInactive handles success UI updates
    } catch (error) {
      console.error(error);
      setToast({
        message: "Failed to reschedule booking.",
        type: "error",
      });
    }
  };

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-[80%] max-h-[90vh] overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-bold dark:text-gray-100">
              Function Hall Booking Record
            </h1>

            <icons.IoIosCloseCircleOutline
              onClick={() => setShowForm(null)}
              className="text-2xl cursor-pointer dark:text-gray-200 text-gray-800"
            />
          </div>

          {/* SEARCH + COUNT */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="dark:text-gray-100 text-xs font-medium">
                Showing {filteredData.length} Booking
              </span>

              <div className="flex items-center gap-1 text-xs">
                <span className="dark:text-gray-300">Rows:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // reset to first page
                  }}
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1
                 bg-white dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
              </div>
            </div>

            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full md:w-64"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <GenericTable
              columns={fhbooking}
              data={formattedData.map((item) => ({
                ...item,
                actions: (
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setNewBooking(item);
                      setShowComputationModal(true);
                    }}
                  >
                    Select
                  </button>
                ),
              }))}
              loading={loading}
              noDataComponent={<NoData />}
              renderActions={(item) => item.actions}
            />
          </div>

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Computation Modal */}
      {showComputationModal && newBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div
            className="bg-white rounded-xl shadow-2xl w-[520px] p-6 border border-gray-200
                max-h-[95vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight">
              Re-Scheduling Computation
            </h2>

            {(() => {
              const prevPaid = toNumber(booking.paid);
              const newHalf = toNumber(newBooking.half_price);
              const newPrice = toNumber(newBooking.price);

              const paymentAmount =
                paymentType === "half" ? newHalf : toNumber(customAmount);
              const difference = prevPaid - paymentAmount;

              return (
                <div className="space-y-5 text-sm text-gray-700">
                  {/* Previous Booking */}
                  <div className="border border-gray-200 p-3 rounded-md bg-gray-50 shadow-sm text-xs">
                    <h3 className="font-semibold text-gray-800 mb-2 tracking-tight text-xs">
                      Previous Booking
                    </h3>

                    <div className="space-y-1">
                      <p>
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="font-medium">{booking.price}</span>
                      </p>
                      <p>
                        <span className="text-gray-500">Previous Paid:</span>

                        <span className="font-medium">{booking.paid}</span>
                      </p>
                    </div>
                  </div>

                  {/* Rescheduled Booking */}
                  <div className="border border-gray-200 p-3 rounded-md bg-gray-50 shadow-sm text-xs">
                    <h3 className="font-semibold text-gray-800 mb-2 tracking-tight text-xs">
                      Reschedule To
                    </h3>

                    <div className="space-y-1">
                      <p>
                        <span className="text-gray-500">Price:</span>{" "}
                        <span className="font-medium">
                          ₱
                          {newPrice.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-500">
                          Required Down Payment
                        </span>
                        <span className="font-medium">
                          ₱
                          {newHalf.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Payment Amount Selector */}
                  <div className="border border-gray-100 p-4 rounded-lg bg-white shadow-sm mt-5">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Payment Amount
                    </h3>
                    <div className="flex flex-col gap-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value="half"
                          checked={paymentType === "half"}
                          onChange={() => setPaymentType("half")}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 select-none">
                          50% (Half Price) — ₱
                          {newHalf.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentType"
                          value="custom"
                          checked={paymentType === "custom"}
                          onChange={() => setPaymentType("custom")}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-2 select-none">Custom Amount</span>
                      </label>

                      {paymentType === "custom" && (
                        <input
                          type="number"
                          min="0"
                          max={newPrice}
                          value={customAmount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || Number(val) <= newPrice) {
                              setCustomAmount(val);
                            }
                          }}
                          placeholder="Enter custom payment amount"
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label="Custom payment amount"
                        />
                      )}
                    </div>
                  </div>

                  {/* Summary & Computation */}
                  <div className="border border-gray-100 p-4 rounded-lg bg-white shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Summary & Computation
                    </h3>
                    {difference > 0 ? (
                      <p className="text-green-600 font-semibold text-base">
                        Refund to Guest: <b>₱{difference.toLocaleString()}</b>
                      </p>
                    ) : difference < 0 ? (
                      <p className="text-red-600 font-semibold text-base">
                        Additional Payment Needed:{" "}
                        <b>₱{Math.abs(difference).toLocaleString()}</b>
                      </p>
                    ) : (
                      <p className="text-blue-600 font-semibold text-base">
                        No refund or additional payment.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end mt-6 gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                onClick={() => setShowComputationModal(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                onClick={handleReschedule}
                disabled={approveLoading}
              >
                {approveLoading ? "Processing..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReSchedBookingFh;
