import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { icons } from "../../constant/icon";
import { bookingRescheduled } from "../../constant/tableColumns";

import Toaster from "../../components/molecules/Toaster";
import { renderActionsBookingResched } from "../admin_molecules/RenderActions";
import ViewReschedDetails from "../admin_molecules/ViewReschedDetails";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminBookingReschedLog() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);
  const [viewDetailsId, setViewDetailsId] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH RESCHEDULED BOOKINGS
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-resched.php`
  );
  console.log("DATA : ", data);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  console.log(data);
  // FILTERING BY SEARCH TERM
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const q = String(searchTerm).toLowerCase();

      return (
        String(item?.rescheduled_booking_id || "")
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

  // FORMAT DATA FOR DISPLAY
  const formattedData = currentData.map((item) => ({
    ...item,
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

  // VIEW DETAILS HANDLER
  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
  };

  // -------------------------------
  // PDF EXPORT FUNCTION
  // -------------------------------
  const downloadReschedPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();

    // Filter data based on created_at month
    const monthlyData = filteredData.filter((item) => {
      if (!item.created_at) return false;
      const createdDate = new Date(item.created_at);
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    });

    if (monthlyData.length === 0) {
      alert("No rescheduled bookings found for this month.");
      return;
    }

    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      "2JKLA NATURE HOT SPRING AND INN RESORT COPR.",
      pageWidth / 2,
      12,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Monbon, Irosin, Sorsogon", pageWidth / 2, 18, {
      align: "center",
    });

    doc.setLineWidth(0.5);
    doc.line(14, 22, pageWidth - 14, 22);

    // Updated title for rescheduled bookings
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Rescheduled Room Bookings Report", pageWidth / 2, 30, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`${monthName} ${year}`, pageWidth / 2, 36, { align: "center" });

    // Format numbers
    const formatNum = (num) =>
      Number(num).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const tableColumn = [
      "ID",
      "Fullname",
      "Phone",
      "Prev Room",
      "New Room",
      "Sched Date",
      "Resched To",
      "Sched Total",
      "Sched Paid",
      "Resched Total",
      "Resched Paid",
      "Refund/Charge",
      "Created At",
    ];

    const tableRows = monthlyData.map((item) => [
      item.id,
      item.fullname,
      item.phone,
      item.prev_room,
      item.new_room,
      item.sched_date,
      item.resched_to,
      formatNum(item.sched_total_price),
      formatNum(item.sched_paid_payment),
      formatNum(item.resched_total_price),
      formatNum(item.resched_paid_payment),
      formatNum(item.refund_charge),
      item.created_at,
    ]);

    autoTable(doc, {
      startY: 42,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255, halign: "center" },
      tableWidth: "auto",
    });

    doc.save(`Rescheduled_Bookings_${monthName}_${year}.pdf`);
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
          Rescheduled Booking
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
              onClick={downloadReschedPDF}
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
            columns={bookingRescheduled}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBookingResched({
                item,
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

      {showForm === "view_details" && (
        <ViewReschedDetails
          data={viewDetailsId}
          onClose={() => setShowForm(null)}
        />
      )}
    </>
  );
}

export default AdminBookingReschedLog;
