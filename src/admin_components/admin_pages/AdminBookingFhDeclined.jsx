import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { fhbookingDeclined } from "../../constant/tableColumns";
import { renderActionsFhBookingDeclined } from "../admin_molecules/RenderActions";

import { icons } from "../../constant/icon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ViewFhBookingDetails from "../admin_molecules/ViewFhBookingDetails";

function AdminBookingFhDeclined() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [sortField, setSortField] = useState(""); // "" means no sorting
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const [viewFHDetailsData, setViewFHDetailsData] = useState(null);

  const { data, loading } = useGetData(
    `/booking/get-fhbooking.php?status=declined`
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

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

  ////////////////////////////////////////////////////////////////////////////////
  const sortedData = [...filteredData];

  if (sortField) {
    sortedData.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle null / undefined
      if (valA == null) return 1;
      if (valB == null) return -1;

      // Booking ID (number)
      if (sortField === "id") {
        valA = Number(valA);
        valB = Number(valB);
      }
      // Date / DateTime fields
      else if (
        ["date", "bookedDate", "created_at", "updated_at"].includes(sortField)
      ) {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      // Fallback (string compare)
      else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
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
  ////////////////////////////////////////////////////////////////////////////////

  const viewFHDetails = (item) => {
    setViewFHDetailsData(item);
    setShowForm("view_fhall");
  };

  // -------------------------------------------
  // ✅ FORMATTED DATA FOR TABLE DISPLAY ONLY
  // -------------------------------------------
  const formattedData = currentData.map((item) => {
    const price = Number(item.price || 0);
    const paid = Number(item.paid || 0);

    return {
      ...item,
      price: `₱${price.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      paid: `₱${paid.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,

      bal_topay: `₱${(price / 2).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    };
  });

  // -------------------------------------------
  // 📌 PDF EXPORT (USES RAW DATA – CORRECT)
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

    // Header
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
    doc.text("Declined Function Hall Booking Records", pageWidth / 2, 26, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("All Records", pageWidth / 2, 31, { align: "center" });

    // ✅ ALL DATA (NO MONTH FILTER)
    const allData = filteredData;

    if (!allData.length) {
      alert("No declined bookings found.");
      return;
    }

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
      head: [
        [
          "Booking ID",
          "Guest Name",
          "Phone",
          "Reserved Date",
          "Price",
          "Paid",
          "Facility",
          "Created At",
          "Status",
        ],
      ],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.8 },
      headStyles: {
        fillColor: [30, 30, 30],
        textColor: 255,
        halign: "center",
      },
    });

    // ✅ Footer on EVERY page (small & subtle)
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

    doc.save(`Declined_FunctionHall_Bookings_ALL_${currentYear}.pdf`);
  };

  return (
    <>
      <div>
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Declined Function Hall Booking
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
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <select
                className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs dark:bg-gray-800 dark:text-gray-100"
                value={sortField}
                onChange={(e) => {
                  const val = e.target.value;

                  switch (val) {
                    case "earliest":
                      setSortField("date"); // or bookedDate
                      setSortOrder("asc"); // earliest date first
                      break;

                    case "latest":
                      setSortField("date"); // or bookedDate
                      setSortOrder("desc"); // latest date first
                      break;

                    case "created_at":
                      setSortField("created_at");
                      setSortOrder("desc"); // latest added on top
                      break;

                    case "updated_at":
                      setSortField("updated_at");
                      setSortOrder("desc"); // latest update on top
                      break;

                    case "booking_id_desc":
                      setSortField("id");
                      setSortOrder("desc"); // newest booking ID first
                      break;

                    case "booking_id_asc":
                      setSortField("id");
                      setSortOrder("asc"); // oldest booking ID first
                      break;

                    default:
                      setSortField("");
                      setSortOrder("asc");
                  }
                }}
              >
                <option value="">Sort By</option>
                <option value="earliest">Earliest Booking</option>
                <option value="latest">Latest Booking</option>
                <option value="created_at">Latest Added</option>
                <option value="updated_at">Latest Updated</option>
                <option value="booking_id_desc">Booking ID (Desc)</option>
                <option value="booking_id_asc">Booking ID (Asc)</option>
              </select>
            </div>
            <button
              onClick={downloadDeclinedPDF}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
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
            columns={fhbookingDeclined}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsFhBookingDeclined({
                item,
                onSetViewDetails: () => viewFHDetails(item),
              })
            }
          />
        </div>
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {showForm === "view_fhall" && (
        <ViewFhBookingDetails booking={viewFHDetailsData} status="declined" />
      )}
    </>
  );
}

export default AdminBookingFhDeclined;
