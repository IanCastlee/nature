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

import jsPDF from "jspdf";
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

  const downloadPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4"); // Portrait A4

    doc.setFontSize(14);
    doc.text("Declined Function Hall Bookings", 14, 12);

    const tableColumn = [
      "Guest Name",
      "Phone",
      "Function Hall",
      "Event Date",
      "Start Time",
      "Total Price",
      "Status",
    ];

    const tableRows = filteredData.map((item) => [
      item.fullname,
      item.phone,
      item.facility_type,
      item.date,
      item.start_time,
      Number(item.price).toFixed(2), // clean number without peso sign
      item.status,
    ]);

    autoTable(doc, {
      startY: 18,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255, halign: "center" },
      tableWidth: "auto",
    });

    doc.save("Declined_FH_Bookings.pdf");
  };

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
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
            >
              Download PDF
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
