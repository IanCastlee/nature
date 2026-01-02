import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { bookingRescheduledFh } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import { renderActionsBookingReschedLg } from "../admin_molecules/RenderActions";
import ViewReschedDetailsFh from "../admin_molecules/ViewReschedDetailsFh";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { icons } from "../../constant/icon";
function AdminBookingReschedLogFh() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);
  const [viewDetailsId, setViewDetailsId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [sortField, setSortField] = useState(""); // "" means no sorting
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-resched-fh.php`
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log("RESCHED DATA : ", data);

  // FILTER DATA BASED ON SEARCH
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const s = String(searchTerm).toLowerCase();

      return (
        String(item?.rescheduled_booking_id || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.guest || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.phone || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.new_facility || "")
          .toLowerCase()
          .includes(s) ||
        String(item?.resched_date || "")
          .toLowerCase()
          .includes(s)
      );
    }) || [];

  ////////////////////////////////////////////////////////////////////////////////
  const sortedData = [...filteredData];

  if (sortField) {
    sortedData.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Convert to comparable values
      if (sortField === "id") {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = sortedData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  //////////////////////////////////////////////////////////////////////////////////

  // FORMAT TABLE DATA
  const formattedData = currentData.map((item) => ({
    ...item,
    paid: `₱${Number(item.resched_paid_payment).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
    total: `₱${Number(item.resched_total_price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
    refund: `₱${Number(item.refund_charge).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
  }));

  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
  };

  // -------------------------------
  // PDF EXPORT FUNCTION (FH RESCHEDULE LOG)
  // -------------------------------
  const downloadReschedPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const currentYear = new Date().getFullYear();

    const downloadDate = new Date().toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const allData = filteredData;

    if (!allData.length) {
      alert("No rescheduled function hall records found.");
      return;
    }

    // ---------- HEADER ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      "2JKLA NATURE HOT SPRING AND INN RESORT CORP.",
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Rescheduled Function Hall Records", pageWidth / 2, 30, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("All Records", pageWidth / 2, 36, { align: "center" });

    // ---------- FORMATTERS ----------
    const formatNum = (num) =>
      Number(num || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // ---------- TABLE ----------
    const tableColumn = [
      "No.",
      "Full Name",
      "Phone",
      "Previous Facility",
      "New Facility",
      "Original Date",
      "Rescheduled Date",
      "Previous DP",
      "New Booking DP",
      "Refund / Charge",
      "Created At",
    ];

    const tableRows = allData.map((item) => [
      item.id,
      item.guest,
      item.phone,
      item.previous_facility,
      item.new_facility,
      item.prev_date,
      item.new_date,
      formatNum(item.previous_paid),
      formatNum(item.new_paid),
      formatNum(item.refund_recharge),
      item.inserted_at,
    ]);

    autoTable(doc, {
      startY: 42,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: "center",
      },
      headStyles: {
        fillColor: [40, 40, 40],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        1: { halign: "left" },
        3: { halign: "left" },
        4: { halign: "left" },
      },
    });

    // ---------- FOOTER ----------
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

    doc.save(`FH_Reschedule_Log_${currentYear}.pdf`);
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
          Rescheduled Function Hall Booking
        </h1>

        <div className="w-full flex justify-between items-center mb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="dark:text-gray-100 text-xs font-medium">
              Showing {filteredData.length} Booking
            </span>

            <div className="flex items-center gap-1 text-xs">
              <span className="dark:text-gray-300">Rows:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1
                 bg-white dark:bg-gray-800 dark:text-gray-100"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={100}>250</option>
                <option value={100}>500</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs dark:bg-gray-800 dark:text-gray-100"
                value={sortField} // displays the selected option
                onChange={(e) => {
                  const val = e.target.value;

                  if (val === "booking_id_desc") {
                    setSortField("id");
                    setSortOrder("desc"); // Booking ID descending
                  } else if (val === "booking_id_asc") {
                    setSortField("id");
                    setSortOrder("asc"); // Booking ID ascending
                  } else {
                    setSortField(val);
                    setSortOrder("asc"); // fallback
                  }
                }}
              >
                <option value="">Sort By</option>

                <option value="booking_id_desc">Booking ID Desc</option>
                <option value="booking_id_asc">Booking ID Asc</option>
              </select>
            </div>
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
            columns={bookingRescheduledFh}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBookingReschedLg({
                item,
                onSetViewDetails: (item) => viewDetails(item),
              })
            }
          />
        </div>
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {showForm === "view_details" && (
        <ViewReschedDetailsFh
          data={viewDetailsId}
          onClose={() => setShowForm(null)}
        />
      )}
    </>
  );
}

export default AdminBookingReschedLogFh;
