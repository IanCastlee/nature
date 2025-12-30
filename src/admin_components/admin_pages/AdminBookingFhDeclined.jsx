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

  const [viewFHDetailsData, setViewFHDetailsData] = useState(null);

  const { data, loading } = useGetData(
    `/booking/get-fhbooking.php?status=declined`
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} Booking
          </span>

          <div className="flex gap-2">
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
