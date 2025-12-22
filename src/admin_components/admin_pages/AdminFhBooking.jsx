import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsFhBooking } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { fhbooking } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import DeclineModal from "../admin_molecules/DeclineModal";
import { icons } from "../../constant/icon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ViewFhBookingDetails from "../admin_molecules/ViewFhBookingDetails";
function AdminFhBooking() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [approveItem, setApproveItem] = useState(null);
  const [declinedItem, setDeclinedItem] = useState(null);
  const [viewFHDetailsData, setViewFHDetailsData] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH DATA
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-fhbooking.php?status=pending`
  );

  console.log("DATA : ", data);

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

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
    doc.text("Pending Function Hall Booking Records", pageWidth / 2, 26, {
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
      alert("No pending bookings found for this month.");
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

    doc.save(`Pending_Bookings_${currentMonthName}_${currentYear}.pdf`);
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

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        {/* SEARCH + COUNT */}
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-xs dark:text-gray-100 font-medium">
            Showing {filteredData.length} Booking
          </span>

          <div className="flex flex-row items-center gap-2">
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
                onSetApprove: setApproveItem,
                onSetDeClined: setDeclinedItem,
                onViewDetails: () => viewFHDetails(item),
              })
            }
          />
        </div>

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
      {approveItem && (
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
      )}

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
        <ViewFhBookingDetails booking={viewFHDetailsData} />
      )}
    </>
  );
}

export default AdminFhBooking;
