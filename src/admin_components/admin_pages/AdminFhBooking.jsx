import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsFhBooking } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { fhbooking } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";
import Toaster from "../../components/molecules/Toaster";
import DeclineModal from "../admin_molecules/DeclineModal";

function AdminFhBooking() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [approveItem, setApproveItem] = useState(null);
  const [declinedItem, setDeclinedItem] = useState(null);
  const [viewFHDetailsData, setViewFHDetailsData] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH DATA
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=pending`
  );

  // PAGINATION
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // FILTERING
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        (item?.fullname || "").toLowerCase().includes(s) ||
        (item?.name || "").toLowerCase().includes(s) ||
        (item?.start_time || "").toLowerCase().includes(s) ||
        (item?.end_time || "").toLowerCase().includes(s) ||
        (item?.date?.toString() || "").includes(s) ||
        (item?.status || "").toLowerCase().includes(s)
      );
    }) || [];

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // API ACTIONS
  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setApproveItem(null);
    setToast({ message: "Booking approved successfully", type: "success" });
  });

  const {
    setInactive: setDeclined,
    loading: declinedLoading,
    error: declinedError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setDeclinedItem(null);
  });

  // VIEW DETAILS MODAL
  const viewFHDetails = (item) => {
    setShowForm("view_fh_hall");
    setViewFHDetailsData(item);
  };

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

  console.log("DATA  : ", data);
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
          Function Hall Booking Record
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        {/* SEARCH + COUNT */}
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-xs dark:text-gray-100 font-medium">
            Showing {filteredData.length} Booking
          </span>

          <SearchInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <GenericTable
            columns={fhbooking}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsFhBooking({
                item,
                setShowForm,
                onSetApprove: setApproveItem,
                onSetDeClined: setDeclinedItem,
                onViewDetails: () => viewFHDetails(item),
              })
            }
          />
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* APPROVE MODAL */}
      {approveItem && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => setApproveItem(null)}
          label="Yes, Approve"
          label2="approve this booking"
          label3="Are you sure you want to approve this booking?"
          onConfirm={() =>
            setInactive({ id: approveItem.id, action: "set_approve" })
          }
        />
      )}

      {/* DECLINE MODAL */}
      {declinedItem && (
        <DeclineModal
          item={declinedItem}
          loading={declinedLoading}
          onCancel={() => setDeclinedItem(null)}
          onConfirm={(note) => {
            setDeclined({
              id: declinedItem.id,
              action: "set_decline",
              note,
            });
            setToast({
              message: "Booking declined successfully",
              type: "success",
            });
          }}
        />
      )}

      {/* VIEW DETAILS MODAL */}
      {showForm === "view_fh_hall" && viewFHDetailsData && (
        <ViewFHDetails booking={viewFHDetailsData} />
      )}
    </>
  );
}

export default AdminFhBooking;
