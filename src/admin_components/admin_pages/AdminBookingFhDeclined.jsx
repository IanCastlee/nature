import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { fhbookingDeclined } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";
import { renderActionsFhBookingDeclined } from "../admin_molecules/RenderActions";

import { icons } from "../../constant/icon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function AdminBookingFhDeclined() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [viewFHDetailsData, setViewFHDetailsData] = useState(null);

  const { data, loading } = useGetData(
    `/booking/get-fhbooking.php?status=declined`
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        (item.fullname || "").toLowerCase().includes(s) ||
        (item.facility_type || "").toLowerCase().includes(s) ||
        (item.status || "").toLowerCase().includes(s)
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
  // 📌 PDF EXPORT FOR APPROVED FUNCTION HALL BOOKINGS
  // -------------------------------------------
  const downloadDeclinedPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    const now = new Date();
    const currentMonthName = now.toLocaleString("default", { month: "long" });
    const currentYear = now.getFullYear();

    // Resort Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      "2JKLA NATURE HOT SPRING AND INN RESORT COPR.",
      pageWidth / 2,
      10,
      {
        align: "center",
      }
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
    doc.text(`${currentMonthName} ${currentYear}`, pageWidth / 2, 31, {
      align: "center",
    });

    // Filter by START DATE (monthly)
    const monthlyData = filteredData.filter((item) => {
      const bookingDate = new Date(item.date);
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === currentYear
      );
    });

    if (monthlyData.length === 0) {
      alert("No approved bookings found for this month.");
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

    const tableRows = monthlyData.map((item) => [
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

    doc.save(`Declined_Bookings_${currentMonthName}_${currentYear}.pdf`);
  };

  // -------------------------------------------

  return (
    <>
      <div>
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Declined Function Hall Booking
        </h1>

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} Booking
          </span>

          <div className="flex gap-2">
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
            columns={fhbookingDeclined}
            data={currentData}
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
        <ViewFHDetails booking={viewFHDetailsData} />
      )}
    </>
  );
}

export default AdminBookingFhDeclined;
