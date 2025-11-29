import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBookingHistory } from "../admin_molecules/RenderActions";
import { bookingApproved } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";
import useSetInactive from "../../hooks/useSetInactive";
import Toaster from "../../components/molecules/Toaster";
import DeleteModal from "../../components/molecules/DeleteModal";

function AdminBookingHistory() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);
  const [toast, setToast] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState(""); // <-- ADDED

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //  DATA FETCH  //
  //==============//

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=approved`
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
        (item?.firstname || "").toLowerCase().includes(search) ||
        (item?.lastname || "").toLowerCase().includes(search) ||
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

  //=====================//
  //  view room details  //
  //=====================//
  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewFHDetailsId(item);
  };

  const formattedData = currentData.map((item) => ({
    ...item,
    email: item.user_id === 12 ? "No Email Provided" : item.email,
    room_name: item.room?.room_name || "N/A",
    extras:
      item.extras && item.extras.length > 0
        ? item.extras
            .map((extra) => `${extra.name} (x${extra.quantity})`)
            .join(", ")
        : "None",
    paid: `₱${Number(item.paid).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    price: `₱${Number(item.price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    half_price: `₱${Number(item.price / 2).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }));

  //set approved
  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setApproveItem(null);
    setApproveAction(""); // reset action
    setToast({
      message:
        approveAction === "set_arrived"
          ? "Booking marked as arrived"
          : "Booking back to pending",
      type: "success",
    });
  });

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
          Approved Booking
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
            columns={bookingApproved}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsBookingHistory({
                item,
                setShowForm,

                onSetPending: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_pending");
                },

                onSetArrived: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_arrived");
                },
              });
            }}
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

      {approveItem?.booking_id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => {
            setApproveItem(null);
            setApproveAction("");
          }}
          label={
            approveAction === "set_pending"
              ? "Yes, Back to pending"
              : "Yes, Mark as Arrived"
          }
          label2={approveAction === "set_pending" ? "pending" : "arrived"}
          label3={
            approveAction === "set_pending"
              ? "Are you sure you want to back this booking to pending?"
              : "Are you sure you want to mark this booking as arrived?"
          }
          onConfirm={() => {
            setInactive({
              id: approveItem?.booking_id,
              action: approveAction, // DYNAMIC ACTION
            });
          }}
        />
      )}

      {showForm === "view fh-hall" && <ViewFHDetails fhId={viewFHDetailsId} />}
    </>
  );
}

export default AdminBookingHistory;
