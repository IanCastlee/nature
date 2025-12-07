import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBooking } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { bookingPending } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import ViewDetails from "../admin_molecules/ViewDetails";
import DeclineModal from "../admin_molecules/DeclineModal";

function AdminBookingPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [approveItem, setApproveItem] = useState(null);
  const [declinedItem, setDeclinedItem] = useState(null);

  const [viewDetailsId, setViewDetailsId] = useState(null);

  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //  DATA FETCH  //
  //==============//

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=pending`
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=================//
  // DATA FILTERING //
  //===============//

  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const search = searchTerm.toLowerCase();

      return (
        (item?.fullname || "").toLowerCase().includes(search) ||
        (item?.room_name || "").toLowerCase().includes(search) ||
        (item?.start_date || "").toLowerCase().includes(search) ||
        (item?.end_date || "").toLowerCase().includes(search) ||
        (item?.nights?.toString() || "").includes(search) ||
        (item?.status || "").toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //==========================//
  //   HANDLE APPROVE/ACTIONS //
  //==========================//

  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setApproveItem(null);
    setToast({ message: "Booking set as approved", type: "success" });
  });

  //==========================//
  //   HANDLE DECLINE         //
  //==========================//

  const {
    setInactive: setDeclined,
    loading: declinedLoading,
    error: decclinedError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setDeclinedItem(null);
  });

  //=====================//
  //  view  details  //
  //=====================//
  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
  };

  const formattedData = currentData.map((item) => ({
    ...item,
    email: item.firstname === "Admin" ? "No Email Provided" : item.email,
    room_name: item.room?.room_name || "N/A",
    extras:
      item.extras && item.extras.length > 0
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

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Booking Record
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} Booking
          </span>

          <div className="flex flex-row items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <GenericTable
            columns={bookingPending}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBooking({
                item,
                setShowForm,
                onSetApprove: (item) => setApproveItem(item),
                onSetDeClined: (item) => setDeclinedItem(item),
                onSetViewDetails: (item) => viewDetails(item),
              })
            }
          />
        </div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* APPROVE MODAL */}
      {approveItem?.booking_id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => setApproveItem(null)}
          label="Yes, Approve"
          label2="approve this booking"
          label3="Are you sure you want to approve this booking?"
          onConfirm={() => {
            setInactive({
              id: approveItem?.booking_id,
              action: "set_approve",
            });
          }}
        />
      )}

      {/* DECLINE MODAL */}
      {declinedItem?.booking_id && (
        <DeclineModal
          item={declinedItem}
          loading={declinedLoading}
          onCancel={() => setDeclinedItem(null)}
          onConfirm={(reason) => {
            setDeclined({
              id: declinedItem.booking_id,
              action: "set_decline",
              reason: reason,
            });

            setToast({
              message: "The booking has been declined.",
              type: "success",
            });

            setDeclinedItem(null);
          }}
        />
      )}

      {showForm === "view_details" && <ViewDetails id={viewDetailsId} />}
    </>
  );
}

export default AdminBookingPage;
