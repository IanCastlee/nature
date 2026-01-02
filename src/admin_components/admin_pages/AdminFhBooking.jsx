import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsFhBooking } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import { fhbooking } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import DeclineModal from "../admin_molecules/DeclineModal";
import { icons } from "../../constant/icon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ViewFhBookingDetails from "../admin_molecules/ViewFhBookingDetails";
import ApproveBookingFh from "../admin_molecules/ApproveBookingFh";
function AdminFhBooking() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [sortField, setSortField] = useState(""); // "" means no sorting
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  const [approveItem, setApproveItem] = useState(null);
  const [declinedItem, setDeclinedItem] = useState(null);
  const [viewFHDetailsData, setViewFHDetailsData] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // FETCH DATA
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=pending`
  );

  // PAGINATION
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // FILTERING
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

  // API ACTIONS
  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setApproveItem(null);
    setToast({ message: "Booking approved successfully", type: "success" });
  });

  const {
    setInactive: setDeclined,
    loading: declinedLoading,
    error: declinedError,
  } = useSetInactive("/booking/fh-booking.php", () => {
    refetch();
    setDeclinedItem(null);
  });

  // VIEW DETAILS MODAL
  const viewFHDetails = (item) => {
    setShowForm("view_fh_hall");
    setViewFHDetailsData(item);
  };

  const formattedData = currentData.map((item) => ({
    ...item,
    price: `₱${Number(item.price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    half_price: `₱${Number(item.half_price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }));

  // -------------------------------------------
  // 📌 PDF EXPORT FOR APPROVED BOOKINGS
  // -------------------------------------------
  const downloadDeclinedPDF = () => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const now = new Date();
    const currentYear = now.getFullYear();

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
    doc.text("Pending Function Hall Booking Records", pageWidth / 2, 26, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("All Records", pageWidth / 2, 31, { align: "center" });

    // ✅ USE ALL DATA (NO MONTH FILTER)
    const allData = filteredData;

    if (allData.length === 0) {
      alert("No pending bookings found.");
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

    // ✅ Download date footer on EVERY page (small & subtle)
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
      doc.setTextColor(0); // reset color
    }

    doc.save(`Pending_FunctionHall_Bookings_ALL_${currentYear}.pdf`);
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

      <div className="scroll-smooth">
        <h1 className="text-lg font-bold mb-6 dark:text-gray-100">
          Pending Function Hall Booking
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        {/* SEARCH + COUNT */}
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
          <div className="flex flex-row items-center gap-2">
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

        {/* TABLE */}
        <div className="overflow-x-auto">
          <GenericTable
            columns={fhbooking}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsFhBooking({
                item,
                setShowForm,
                // onSetApprove: setApproveItem,
                onSetDeClined: setDeclinedItem,
                onViewDetails: () => viewFHDetails(item),

                onSetApprovedOptions: (item) => {
                  setApproveItem(item);
                  setShowForm("approved_options");
                },
              })
            }
          />
        </div>
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* APPROVE MODAL */}
      {/* {approveItem && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => setApproveItem(null)}
          label="Yes, Approve"
          label2="approve this booking"
          label3="This booking will be moved and marked as Approved."
          onConfirm={() =>
            setInactive({ id: approveItem.id, action: "set_approve" })
          }
        />
      )} */}

      {/* DECLINE MODAL */}
      {declinedItem && (
        <DeclineModal
          item={declinedItem}
          loading={declinedLoading}
          onCancel={() => setDeclinedItem(null)}
          onConfirm={(note) => {
            setDeclined({
              id: declinedItem.id,
              action: "set_decline",
              note,
            });
            setToast({
              message: "Booking declined successfully",
              type: "success",
            });
          }}
        />
      )}

      {/* VIEW DETAILS MODAL */}
      {showForm === "view_fh_hall" && viewFHDetailsData && (
        <ViewFhBookingDetails booking={viewFHDetailsData} status="pending" />
      )}

      {showForm === "approved_options" && (
        <ApproveBookingFh
          refetch={refetch}
          data={approveItem}
          setToast={setToast}
        />
      )}
    </>
  );
}

export default AdminFhBooking;
