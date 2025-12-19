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

  const itemsPerPage = 10;

  // Fetch pending FH bookings
  const { data, loading, error, refetch } = useGetData(
    `/booking/get-fhbooking.php?status=pending`
  );

  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/resched_fh.php",
    () => {
      setToast({ message: "Booking updated successfully!", type: "success" });
      setShowComputationModal(false);
      refetch();
      refetchApproved();
      setShowForm(null);
    }
  );

  const toNumber = (value) => {
    if (value == null) return 0;
    return Number(value.toString().replace(/[₱,]/g, ""));
  };

  // Filtering
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        (item?.fullname || "").toLowerCase().includes(s) ||
        (item?.name || "").toLowerCase().includes(s) ||
        (item?.start_time || "").toLowerCase().includes(s) ||
        (item?.end_time || "").toLowerCase().includes(s) ||
        (item?.date?.toString() || "").includes(s)
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
    const newHalf = toNumber(newBooking.half_price);
    const difference = prevPaid - newHalf;

    try {
      // OLD booking
      await setInactive({
        booking_id: booking.id,
        status: "resched",
        difference,
      });

      // NEW booking — pass the real previous booking id
      await setInactive({
        booking_id: newBooking.id,
        prev_booking_id: booking.id, // 🔥 IMPORTANT
        status: "rescheduled",
        difference,
      });

      setToast({
        message: "Booking rescheduled successfully!",
        type: "success",
      });

      setShowComputationModal(false);
      refetch();
      refetchApproved();
      setShowForm(null);
    } catch (err) {
      console.error(err);
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
              className="text-2xl cursor-pointer"
            />
          </div>

          {/* SEARCH + COUNT */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <span className="text-xs dark:text-gray-100 font-medium">
              Showing {filteredData.length} Booking
            </span>

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
          <div className="bg-white rounded-xl shadow-2xl w-[520px] p-6 border border-gray-200">
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
                  <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Previous Booking
                    </h3>
                    <p>
                      <span className="text-gray-600">Date:</span>{" "}
                      <b>{booking.date}</b>
                    </p>
                    <p>
                      <span className="text-gray-600">Room:</span>{" "}
                      <b>{booking.name}</b>
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

                  <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-tight">
                      Rescheduled Booking
                    </h3>
                    <p>
                      <span className="text-gray-600">Date:</span>{" "}
                      <b>{newBooking.date}</b>
                    </p>
                    <p>
                      <span className="text-gray-600">Room:</span>{" "}
                      <b>{newBooking.name}</b>
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
