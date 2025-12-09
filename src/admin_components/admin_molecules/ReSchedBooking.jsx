import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { bookingPending } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import useSetInactive from "../../hooks/useSetInactive";

function ReSchedBooking({ booking }) {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showComputationModal, setShowComputationModal] = useState(false);
  const [newBooking, setNewBooking] = useState(null);

  const itemsPerPage = 10;

  // --- Hook for updating booking statuses ---
  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/resched.php", () => {
    setToast({ message: "Booking updated successfully!", type: "success" });
    setShowComputationModal(false);
    refetch();
  });

  // Fetch Pending Booking Data
  const { data, loading, error, refetch } = useGetData(
    `/booking/get-booking.php?status=pending`
  );

  // Filtering
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item.fullname.toLowerCase().includes(search) ||
        item.room_name?.toLowerCase().includes(search) ||
        item.start_date?.toLowerCase().includes(search) ||
        item.end_date?.toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  // ======================================================
  //                  HANDLE RESCHEDULE ACTION
  // ======================================================
  const handleReschedule = async () => {
    if (!newBooking) return;

    const prevPaid = Number(booking.paid.replace(/[₱,]/g, ""));
    const newHalf = Number(newBooking.half_price.replace(/[₱,]/g, ""));
    const difference = prevPaid - newHalf; // Refund (+) or Charge (-)

    const prevBookingForm = {
      booking_id: booking.booking_id,
      status: "resched",
      difference: difference, // <-- passed to backend
    };

    const newBookingForm = {
      booking_id: newBooking.booking_id,
      status: "approved",
    };

    try {
      // Update previous booking
      await setInactive(prevBookingForm);

      // Update new booking
      await setInactive(newBookingForm);

      setToast({
        message: "Booking rescheduled successfully!",
        type: "success",
      });
      setShowComputationModal(false);
      refetch();
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to reschedule booking.", type: "error" });
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

      {/* Main Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-[80%] max-h-[90vh] overflow-y-auto shadow-lg">
          <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
            Booking Record
          </h1>

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

          {/* Pagination */}
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
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[450px]">
            <h2 className="text-lg font-bold mb-4">
              Re-scheduling Computation
            </h2>

            {(() => {
              const prevPaid = Number(booking.paid.replace(/[₱,]/g, ""));
              const newHalf = Number(
                newBooking.half_price.replace(/[₱,]/g, "")
              );
              const difference = prevPaid - newHalf;

              return (
                <div className="space-y-2 text-sm">
                  <p>
                    Previous Booking Paid:
                    <b> ₱{prevPaid.toLocaleString()}</b>
                  </p>

                  <p>
                    New Booking Half Price:
                    <b> ₱{newHalf.toLocaleString()}</b>
                  </p>

                  <hr />

                  {difference > 0 ? (
                    <p className="text-green-600 font-bold">
                      Refund To Guest: <b>₱{difference.toLocaleString()}</b>
                    </p>
                  ) : difference < 0 ? (
                    <p className="text-red-600 font-bold">
                      Additional Payment Needed:
                      <b> ₱{Math.abs(difference).toLocaleString()}</b>
                    </p>
                  ) : (
                    <p className="text-blue-600 font-bold">
                      No refund or additional payment.
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="flex justify-end mt-6 gap-2">
              <button
                className="px-4 py-1 bg-gray-500 text-white rounded"
                onClick={() => setShowComputationModal(false)}
              >
                Close
              </button>

              <button
                className="px-4 py-1 bg-green-500 text-white rounded"
                onClick={handleReschedule}
                disabled={approveLoading}
              >
                {approveLoading ? "Processing..." : "Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReSchedBooking;
