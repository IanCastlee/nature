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
import { icons } from "../../constant/icon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ViewDetails from "../admin_molecules/ViewDetails";

function AdminBookingHistoryLog() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);
  const [toast, setToast] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [viewDetailsId, setViewDetailsId] = useState(null);

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=arrived`
  );
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const q = String(searchTerm).toLowerCase();

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

  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewFHDetailsId(item);
  };

  // // Format table for display
  // const formattedData = currentData.map((item) => ({
  //   ...item,
  //   extras: item.extras && item.extras.length > 0 ? "Yes" : "None",
  //   room_name: item.room?.room_name || "N/A",
  //   paid: `₱${Number(item.paid).toLocaleString("en-PH", {
  //     minimumFractionDigits: 2,
  //   })}`,
  //   price: `₱${Number(item.price).toLocaleString("en-PH", {
  //     minimumFractionDigits: 2,
  //   })}`,
  // }));

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

  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/booking.php",
    () => {
      refetch();
      setApproveItem(null);
      setApproveAction("");
      setToast({ message: "Booking moved back to approved", type: "success" });
    }
  );

  // PDF export filtered by current month
  const downloadMonthlyPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const now = new Date();
    const currentYear = now.getFullYear();

    // Resort Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      "2JKLA NATURE HOT SPRING AND INN RESORT CORP.",
      pageWidth / 2,
      10,
      { align: "center" }
    );

    // Address
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Monbon, Irosin, Sorsogon", pageWidth / 2, 15, {
      align: "center",
    });

    // Line separator
    doc.setLineWidth(0.4);
    doc.line(14, 19, pageWidth - 14, 19);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Arrived Room Booking Records", pageWidth / 2, 26, {
      align: "center",
    });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("All Records", pageWidth / 2, 31, {
      align: "center",
    });

    // Download date string
    const downloadDate = new Date().toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // ✅ USE ALL DATA (NO MONTH FILTER)
    const allData = filteredData;

    if (allData.length === 0) {
      alert("No bookings found.");
      return;
    }

    const tableColumn = [
      "Booking ID",
      "Guest Name",
      "Phone",
      "Check-In Date",
      "Check-Out Date",
      "Night(s)",
      "Extras Total",
      "Price",
      "Paid",
      "Room",
      "Room Price",
      "Status",
    ];

    const formatNum = (num) =>
      Number(num).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const tableRows = allData.map((item) => {
      let extrasTotal = 0;

      if (Array.isArray(item.extras) && item.extras.length > 0) {
        extrasTotal = item.extras.reduce((sum, extra) => {
          const priceNum =
            parseFloat(extra.price?.toString().replace(/[^0-9.-]+/g, "")) || 0;
          const quantity = Number(extra.quantity) || 1;
          return sum + priceNum * quantity;
        }, 0);

        extrasTotal = extrasTotal * (Number(item.nights) || 1);
      }

      return [
        item.booking_id,
        item.fullname,
        item.phone,
        item.start_date,
        item.end_date,
        item.nights,
        formatNum(extrasTotal),
        formatNum(item.price),
        formatNum(item.paid),
        item.room?.room_name || "N/A",
        item.room?.price || "N/A",
        item.status.charAt(0).toUpperCase() + item.status.slice(1),
      ];
    });

    autoTable(doc, {
      startY: 36,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.8 },
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: 255,
        halign: "center",
      },
    });

    // Add download date on every page at bottom right (small, subtle)
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(
        `Downloaded on: ${downloadDate}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
      doc.setTextColor(0);
    }

    doc.save(`Booking_History_ALL_${currentYear}.pdf`);
  };

  //=====================//
  //  view  details  //
  //=====================//
  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
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

      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Arrived Booking
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
            <button
              onClick={downloadMonthlyPDF}
              title="Download PDF for Current Month"
              className="bg-green-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap flex items-center gap-1"
            >
              <icons.MdOutlineFileDownload /> PDF
            </button>

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
            setInactive({ id: approveItem?.booking_id, action: approveAction })
          }
        />
      )}

      {showForm === "view_details" && (
        <ViewDetails active="arrived" data={viewDetailsId} />
      )}
    </>
  );
}

export default AdminBookingHistoryLog;
