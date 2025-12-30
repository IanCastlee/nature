import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsFhBookingArrived } from "../admin_molecules/RenderActions";
import { fhbookingHistory } from "../../constant/tableColumns";
import { useLocation } from "react-router-dom";
import DeleteModal from "../../components/molecules/DeleteModal";
import Toaster from "../../components/molecules/Toaster";
import useSetInactive from "../../hooks/useSetInactive";
import { icons } from "../../constant/icon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ViewFhBookingDetails from "../admin_molecules/ViewFhBookingDetails";

function AdminFhBookingArrived() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("fhbooking-approved");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=arrived`
  );

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

  const indexOfLast = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLast - itemsPerPage,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const viewFHDetails = (item) => {
    setShowForm("view_fh_hall");
    setViewFHDetailsId(item);
  };

  // Formatted display values
  const formattedData = currentData.map((item) => ({
    ...item,
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

  // Move back to approved
  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/fh-booking.php",
    () => {
      refetch();
      setApproveItem(null);
      setApproveAction("");
      setToast({ message: "Booking moved back to approved", type: "success" });
    }
  );

  // -------------------------------------------
  // 📌 PDF EXPORT FOR ARRIVED FUNCTION HALL BOOKINGS
  // -------------------------------------------
  const downloadDeclinedPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const currentYear = new Date().getFullYear();

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
    doc.text("Arrived Function Hall Booking Records", pageWidth / 2, 26, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("All Records", pageWidth / 2, 31, { align: "center" });

    // ✅ ALL DATA (NO MONTH FILTER)
    const allData = filteredData;

    if (allData.length === 0) {
      alert("No arrived bookings found.");
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

    // ✅ Footer on EVERY page (small, thin, not highlighted)
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
      doc.setTextColor(0);
    }

    doc.save(`Arrived_FunctionHall_Bookings_ALL_${currentYear}.pdf`);
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

      <div>
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Arrived Function Hall Booking
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-xs text-gray-600 dark:text-gray-100">
            Showing {filteredData.length} bookings
          </span>

          <div className="flex items-center gap-2">
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
            columns={fhbookingHistory}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsFhBookingArrived({
                isNotAvailablePage,
                item,
                setShowForm,
                onSetBackToApproved: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_backtoapproved");
                },
                onViewDetails: () => viewFHDetails(item),
              })
            }
          />
        </div>

        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {approveItem?.id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.fullname}
          loading={approveLoading}
          onCancel={() => {
            setApproveItem(null);
            setApproveAction("");
          }}
          label="Yes, Move Back to Approved"
          label2="back_approved"
          label3="Are you sure you want to move this booking back to approved?"
          onConfirm={() =>
            setInactive({ id: approveItem?.id, action: approveAction })
          }
        />
      )}

      {showForm === "view_fh_hall" && (
        <ViewFhBookingDetails
          booking={viewFHDetailsId}
          status="arrived"
          onClose={() => showForm(null)}
        />
      )}
    </>
  );
}

export default AdminFhBookingArrived;
