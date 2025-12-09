import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBookingHistoryLog } from "../admin_molecules/RenderActions";
import { bookingHistory } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";
import useSetInactive from "../../hooks/useSetInactive";
import Toaster from "../../components/molecules/Toaster";
import DeleteModal from "../../components/molecules/DeleteModal";

function AdminBookingNotAttended() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);
  const [toast, setToast] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH BOOKING HISTORY
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=not_attended`
  );

  console.log("DATA : ", data);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // FILTERING
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const s = searchTerm.toLowerCase();

      return (
        (item?.fullname || "").toLowerCase().includes(s) ||
        (item?.room_name || "").toLowerCase().includes(s) ||
        (item?.start_date || "").toLowerCase().includes(s) ||
        (item?.end_date || "").toLowerCase().includes(s) ||
        (item?.status || "").toLowerCase().includes(s)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // FORMAT TABLE DATA
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
    })}`,
    price: `₱${Number(item.price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
    half_price: `₱${Number(item.price / 2).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
  }));

  // SET BACK TO APPROVED
  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/booking.php",
    () => {
      refetch();
      setApproveItem(null);
      setApproveAction("");
      setToast({
        message: "Booking moved back to approved",
        type: "success",
      });
    }
  );

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
          Booking History
        </h1>

        {loading && <p className="text-blue-500 text-sm">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} Booking
          </span>

          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <GenericTable
            columns={bookingHistory}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBookingHistoryLog({
                item,
                setShowForm,

                onSetBackToApproved: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_backtoapproved");
                },
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

      {approveItem?.booking_id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => {
            setApproveItem(null);
            setApproveAction("");
          }}
          label="Yes, Move Back to Approved"
          label2="back_approved"
          label3="Are you sure you want to move this booking back to approved?"
          onConfirm={() =>
            setInactive({
              id: approveItem?.booking_id,
              action: approveAction,
            })
          }
        />
      )}

      {showForm === "view fh-hall" && <ViewFHDetails fhId={viewFHDetailsId} />}
    </>
  );
}

export default AdminBookingNotAttended;
