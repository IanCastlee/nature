import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsFhBookingApproved } from "../admin_molecules/RenderActions";
import { fhbookingApproved } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";
import { useLocation } from "react-router-dom";
import DeleteModal from "../../components/molecules/DeleteModal";
import Toaster from "../../components/molecules/Toaster";
import useSetInactive from "../../hooks/useSetInactive";

function AdminBookingFhApproved() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);

  // 🔥 APPROVAL STATES
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");

  const [toast, setToast] = useState(null);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("fhbooking-approved");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==============//
  //  DATA FETCH  //
  //==============//

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=approved`
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=================//
  // FILTERING //
  //=================//

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

  //==========================//
  //  VIEW FH DETAILS //
  //==========================//

  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewFHDetailsId(item);
  };

  const formattedData = currentData.map((item) => ({
    ...item,

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

  //=========================//
  // APPROVAL HANDLING //
  //=========================//

  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setApproveItem(null);
    setApproveAction("");
    setToast({
      message:
        approveAction === "set_arrived"
          ? "Booking marked as arrived"
          : "Booking moved back to pending",
      type: "success",
    });
  });

  console.log("approveError : ", approveError);

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
          Approved Function Hall Booking
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
            columns={fhbookingApproved}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsFhBookingApproved({
                isNotAvailablePage,
                item,
                setShowForm,

                // 🔥 ADD THESE ACTIONS
                onSetPending: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_pending");
                },

                onSetArrived: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_arrived");
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

      {/* 🔥 CONFIRMATION MODAL */}
      {approveItem?.id && (
        <DeleteModal
          item={approveItem}
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
              id: approveItem?.id,
              action: approveAction,
            });
          }}
        />
      )}

      {showForm === "view fh-hall" && <ViewFHDetails fhId={viewFHDetailsId} />}
    </>
  );
}

export default AdminBookingFhApproved;
