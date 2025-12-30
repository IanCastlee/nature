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
import ReSchedBookingFh from "../admin_molecules/ReschedBookingFh";
import { icons } from "../../constant/icon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ViewFhBookingDetails from "../admin_molecules/ViewFhBookingDetails";
function AdminBookingFhApproved() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);

  //  APPROVAL STATES
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");
  const [reschedItem, setReschedItem] = useState(null);
  const [showResched, setShowResched] = useState(false);

  const [toast, setToast] = useState(null);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("fhbooking-approved");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  //==============//
  //  DATA FETCH  //
  //==============//
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=approved`
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  //=================//
  // FILTERING //
  //=================//
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

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //==========================//
  //  VIEW FH DETAILS //
  //==========================//
  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewFHDetailsId(item); // Pass the full booking object
  };

  //==========================//
  //  OPEN RESCHED MODAL //
  //==========================//
  const openResched = (item) => {
    setReschedItem(item);
    setShowResched(true);
  };

  // Format prices in table
  const formattedData = currentData.map((item) => ({
    ...item,
    paid: `₱${Number(item.paid || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    price: `₱${Number(item.price?.replace(/[^\d.-]/g, "") || 0).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`,
    half_price: `₱${Number(
      (item.price?.replace(/[^\d.-]/g, "") || 0) / 2
    ).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,

    bal_topay: `₱${Number(
      item.bal_topay?.toString().replace(/[^\d.-]/g, "") || 0
    ).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    down_payment: `₱${Number(
      item.down_payment?.toString().replace(/[^\d.-]/g, "") || 0
    ).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }));

  //=========================//
  // APPROVAL HANDLING //
  //=========================//
  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/fh-booking.php",
    () => {
      refetch();
      setApproveItem(null);
      setApproveAction("");
      setToast({
        message:
          approveAction === "set_arrived"
            ? "Booking marked as arrived"
            : approveAction === "set_pending"
            ? "Booking moved back to pending"
            : approveAction === "set_not_attended"
            ? "Booking marked as Not Attended"
            : "",
        type: "success",
      });
    }
  );

  // -------------------------------------------
  // 📌 PDF EXPORT FOR APPROVED FUNCTION HALL BOOKINGS
  // -------------------------------------------
  const downloadDeclinedPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const now = new Date();
    const currentYear = now.getFullYear();

    const downloadDate = new Date().toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Resort Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      "2JKLA NATURE HOT SPRING AND INN RESORT CORP.",
      pageWidth / 2,
      10,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Monbon, Irosin, Sorsogon", pageWidth / 2, 15, {
      align: "center",
    });

    doc.setLineWidth(0.4);
    doc.line(14, 19, pageWidth - 14, 19);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Approved Function Hall Booking Records", pageWidth / 2, 26, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("All Records", pageWidth / 2, 31, { align: "center" });

    // ✅ USE ALL DATA (NO MONTH FILTER)
    const allData = filteredData;

    if (allData.length === 0) {
      alert("No approved bookings found.");
      return;
    }

    const tableColumn = [
      "Booking ID",
      "Guest Name",
      "Phone",
      "Reserved Date",
      "Price",
      "Paid",
      "Facility",
      "Created At",
      "Status",
    ];

    const formatNum = (num) =>
      Number(num).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const tableRows = allData.map((item) => [
      item.id,
      item.fullname,
      item.phone,
      item.date,
      formatNum(item.price),
      formatNum(item.paid),
      item.name,
      item.bookedDate,
      item.status,
    ]);

    autoTable(doc, {
      startY: 36,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.8 },
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
        halign: "center",
      },
      tableWidth: "auto",
    });

    // ✅ Download date on EVERY page (small & subtle)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120); // light gray
      doc.text(
        `Downloaded on: ${downloadDate}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
      doc.setTextColor(0); // reset
    }

    doc.save(`Approved_FunctionHall_Bookings_ALL_${currentYear}.pdf`);
  };

  // -------------------------------------------
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
            <button
              onClick={downloadDeclinedPDF}
              title="Download PDF for Current Month"
              className="bg-green-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1"
            >
              <icons.MdOutlineFileDownload /> PDF
            </button>
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
                viewFHDetails,
                onSetReshed: (item) => {
                  setReschedItem(item);
                  setShowForm("resched_booking_fh");
                },

                onSetPending: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_pending");
                },
                onSetArrived: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_arrived");
                },
                onSetNotAttended: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_not_attended");
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

      {/*  CONFIRMATION MODAL */}
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
              ? "Yes, Back to Pending"
              : approveAction === "set_arrived"
              ? "Yes, Mark as Arrived"
              : approveAction === "set_not_attended"
              ? "Yes, Mark as Not Attended"
              : ""
          }
          label2={
            approveAction === "set_pending"
              ? "pending"
              : approveAction === "set_arrived"
              ? "arrived"
              : approveAction === "set_not_attended"
              ? "not attended"
              : ""
          }
          label3={
            approveAction === "set_pending"
              ? "This booking will be moved back to pending."
              : approveAction === "set_arrived"
              ? "This booking will be moved and marked as Arrived."
              : approveAction === "set_not_attended"
              ? "This booking will be moved and marked as Not Attended."
              : "Are you sure you want to proceed?"
          }
          onConfirm={() => {
            setInactive({
              id: approveItem?.id,
              action: approveAction,
            });
          }}
        />
      )}

      {/*  VIEW FUNCTION HALL DETAILS */}
      {showForm === "view fh-hall" && viewFHDetailsId && (
        <ViewFhBookingDetails booking={viewFHDetailsId} status="approved" />
      )}

      {/*  RESCHED MODAL */}
      {showForm === "resched_booking_fh" && (
        <ReSchedBookingFh booking={reschedItem} refetchApproved={refetch} />
      )}
    </>
  );
}

export default AdminBookingFhApproved;
