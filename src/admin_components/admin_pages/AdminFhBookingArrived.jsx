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

  const [sortField, setSortField] = useState(""); // "" means no sorting
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const isNotAvailablePage = location.pathname.includes("fhbooking-approved");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

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

        {error && (
          <p className="text-red-500 text-sm mb-4">
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
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
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
