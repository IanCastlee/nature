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

function AdminFhBooking() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [approveItem, setApproveItem] = useState(null);
  const [declinedItem, setDeclinedItem] = useState(null);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);

  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //=====================//
  // FETCH DATA
  //=====================//
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=pending`
  );

  //=====================//
  // PAGINATION
  //=====================//
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=====================//
  // FILTER DATA
  //=====================//
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        (item?.firstname || "").toLowerCase().includes(search) ||
        (item?.name || "").toLowerCase().includes(search) ||
        (item?.start_time || "").toLowerCase().includes(search) ||
        (item?.end_time || "").toLowerCase().includes(search) ||
        (item?.date?.toString() || "").includes(search) ||
        (item?.status || "").toLowerCase().includes(search)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //=====================//
  // APPROVE / DECLINE
  //=====================//
  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setApproveItem(null);
    setToast({ message: "Booking set as approved", type: "success" });
  });

  const {
    setInactive: setDeclined,
    loading: declinedLoading,
    error: declinedError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setDeclinedItem(null);
  });

  //=====================//
  // VIEW DETAILS
  //=====================//
  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewFHDetailsId(item);
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
            columns={fhbooking}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) => {
              return renderActionsFhBooking({
                item,
                setShowForm,
                onSetApprove: (item) => setApproveItem(item),
                onSetDeClined: (item) => setDeclinedItem(item),
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

      {/* APPROVE MODAL */}
      {approveItem?.id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => setApproveItem(null)}
          label="Yes, Approve"
          label2="booking as approve"
          label3="Are you sure you want to approve this booking?"
          onConfirm={() => {
            setInactive({
              id: approveItem?.id,
              action: "set_approve",
            });
          }}
        />
      )}

      {/* DECLINE MODAL */}
      {declinedItem?.id && (
        <DeleteModal
          item={declinedItem}
          name={declinedItem?.firstname}
          loading={declinedLoading}
          onCancel={() => setDeclinedItem(null)}
          label="Yes, Decline"
          label2="decline this booking"
          label3={`Are you sure you want to decline this booking?`}
          onConfirm={() => {
            setDeclined({
              id: declinedItem?.id,
              action: "set_decline",
            });
            setToast({
              message: "Booking has been declined",
              type: "success",
            });
          }}
        />
      )}

      {showForm === "view fh-hall" && <ViewFHDetails fhId={viewFHDetailsId} />}
    </>
  );
}

export default AdminFhBooking;
