import React, { useState, useEffect } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { bookingPending } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import useSetInactive from "../../hooks/useSetInactive";
import { icons } from "../../constant/icon";

function ReSchedBooking({ booking, onClose, refetchBooking }) {
  const setShowForm = useForm((state) => state.setShowForm);

  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showComputationModal, setShowComputationModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);

  const itemsPerPage = 10;

  const {
    setInactive,
    loading: approveLoading,
    error: subError,
  } = useSetInactive("/booking/resched.php", () => {
    setToast({
      message: "Booking updated successfully!",
      type: "success",
    });
    refetchBooking();
    onClose();
    setShowComputationModal(false);
    refetch();
  });

  // Fetch pending booking data
  const { data, loading, error, refetch } = useGetData(
    `/booking/get-booking.php?status=pending`
  );

  // Reset to page 1 whenever search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Helper: Convert mixed values (string/number) to usable number
  const toNumber = (value) => {
    if (value == null) return 0;
    return Number(value.toString().replace(/[₱,]/g, ""));
  };

  // Filtering
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const search = searchTerm.toLowerCase();

      const q = String(search).toLowerCase();

      return (
        String(item?.booking_id || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.fullname || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.phone || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.room_name || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.start_date || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.end_date || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.nights || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.status || "")
          .toLowerCase()
          .includes(q)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Format table data
  const formattedData = currentData.map((item) => ({
    ...item,
    email: item.firstname === "Admin" ? "No Email Provided" : item.email,
    room_name: item.room?.room_name || "N/A",
    extras:
      item.extras?.length > 0
        ? item.extras
            .map((extra) => `${extra.name} (x${extra.quantity})`)
            .join(", ")
        : "None",
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
    const newHalf = toNumber(newBooking.half_price);
    const difference = prevPaid - newHalf;

    try {
      // STEP 1: mark OLD booking as resched
      await setInactive({
        booking_id: booking.booking_id,
        status: "resched",
        difference,
      });

      // STEP 2: mark NEW booking as rescheduled
      await setInactive({
        booking_id: newBooking.booking_id,
        prev_booking_id: booking.booking_id,
        status: "rescheduled",
        difference,
      });

      setToast({
        message: "Booking rescheduled successfully!",
        type: "success",
      });

      setShowComputationModal(false);
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
          <div className="w-full flex flex-row justify-between">
            <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
              Booking Record
            </h1>
            <icons.IoIosCloseCircleOutline
              onClick={onClose}
              className="text-2xl cursor-pointer dark:text-gray-100 text-gray-900"
            />
          </div>

          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-500">{error.message}</p>}

          <div className="flex justify-between mb-2">
            <span className="dark:text-gray-100 text-xs">
              Showing {filteredData.length} Booking
            </span>

            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <GenericTable
              columns={bookingPending}
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
          <div className="bg-white rounded-xl shadow-2xl w-[520px] p-6 border border-gray-200">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight">
              Re-Scheduling Computation
            </h2>

            {(() => {
              const prevPaid = toNumber(booking.paid);
              const newHalf = toNumber(newBooking.half_price);
              const newPrice = toNumber(newBooking.price);
              const difference = prevPaid - newHalf;

              return (
                <div className="space-y-5 text-sm text-gray-700">
                  {/* Previous Booking */}
                  <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Previous Booking
                    </h3>

                    <div className="space-y-1.5">
                      <p>
                        <span className="text-gray-600">Date:</span>{" "}
                        <b>{booking.start_date}</b> to <b>{booking.end_date}</b>
                      </p>
                      <p>
                        <span className="text-gray-600">Room:</span>{" "}
                        <b>{booking.room_name}</b>
                      </p>
                      <p>
                        <span className="text-gray-600">Price:</span>{" "}
                        <b>{booking.price}</b>
                      </p>
                      <p>
                        <span className="text-gray-600">Paid:</span>{" "}
                        <b>{booking.paid}</b>
                      </p>
                    </div>
                  </div>

                  {/* New Booking */}
                  <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Rescheduled Booking
                    </h3>

                    <div className="space-y-1.5">
                      <p>
                        <span className="text-gray-600">Date:</span>{" "}
                        <b>{newBooking.start_date}</b> to{" "}
                        <b>{newBooking.end_date}</b>
                      </p>
                      <p>
                        <span className="text-gray-600">Room:</span>{" "}
                        <b>{newBooking.room?.room_name}</b>
                      </p>

                      <p>
                        <span className="text-gray-600">Price:</span>{" "}
                        <b>
                          ₱
                          {newPrice.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </b>
                      </p>

                      <p>
                        <span className="text-gray-600">Half Price:</span>{" "}
                        <b>
                          ₱
                          {newHalf.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </b>
                      </p>
                    </div>
                  </div>

                  {/* Computation */}
                  <div className="border border-gray-100 p-4 rounded-lg bg-white shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Summary & Computation
                    </h3>

                    <div className="space-y-1.5">
                      <p>
                        Previous Booking Paid:{" "}
                        <b>₱{prevPaid.toLocaleString()}</b>
                      </p>
                      <p>
                        New Booking Half Price:{" "}
                        <b>₱{newHalf.toLocaleString()}</b>
                      </p>

                      <hr className="my-3 border-gray-300" />

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
                </div>
              );
            })()}

            {/* Action Buttons */}
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

export default ReSchedBooking;
