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
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const [sortField, setSortField] = useState(""); // "" means no sorting
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

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
        String(item?.guest || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.phone || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.new_room || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.previous_room || "")
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

  ////////////////////////////////////////////////////////////////////////////////
  const sortedData = [...filteredData];

  if (sortField) {
    sortedData.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Convert to comparable values
      if (sortField === "booking_id") {
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

  console.log("DJHHFGHDFG : ", filteredData);

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
  // PDF EXPORT FUNCTION (ROOM RESCHEDULE LOG)
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

    // ✅ USE ALL DATA
    const allData = filteredData.filter((item) => item.inserted_at);

    if (!allData.length) {
      alert("No rescheduled room bookings found.");
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

    // ---------- TITLE ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Rescheduled Room Booking Records", pageWidth / 2, 30, {
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
      "Previous Room",
      "Previous DP",
      "Previous Check-in / Out",
      "New Room",
      "New DP",
      "New Check-in / Out",
      "Refund / Charge",
      "Created At",
    ];

    const tableRows = allData.map((item) => [
      item.id,
      item.guest,
      item.phone,
      item.previous_room,
      formatNum(item.previous_paid),
      item.prev_check_in_out,
      item.new_room,
      formatNum(item.new_paid),
      item.new_check_in_out,
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
        1: { halign: "left" }, // Full Name
        3: { halign: "left" }, // Previous Room
        6: { halign: "left" }, // New Room
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

    doc.save(`Room_Reschedule_Log_${currentYear}.pdf`);
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

        {error && (
          <p className="text-red-500 text-sm">
            {error.message || "Something went wrong."}
          </p>
        )}

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
        <ViewReschedDetails
          data={viewDetailsId}
          onClose={() => setShowForm(null)}
        />
      )}
    </>
  );
}

export default AdminBookingReschedLog;
