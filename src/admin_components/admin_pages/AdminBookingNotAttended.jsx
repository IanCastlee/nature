import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBookingHistoryLog } from "../admin_molecules/RenderActions";
import { bookingHistory } from "../../constant/tableColumns";
import ViewFHDetails from "../admin_molecules/ViewFHDetails";
import useSetInactive from "../../hooks/useSetInactive";
import Toaster from "../../components/molecules/Toaster";
import DeleteModal from "../../components/molecules/DeleteModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { icons } from "../../constant/icon";
import ViewDetails from "../admin_molecules/ViewDetails";
function AdminBookingNotAttended() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);
  const [viewDetailsId, setViewDetailsId] = useState(null);

  const [viewFHDetailsId, setViewFHDetailsId] = useState(null);
  const [toast, setToast] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [approveAction, setApproveAction] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH BOOKING HISTORY
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=not_attended`
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // FILTERING
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;

      const s = searchTerm.toLowerCase();

      return (
        (item?.fullname || "").toLowerCase().includes(s) ||
        (item?.room_name || "").toLowerCase().includes(s) ||
        (item?.start_date || "").toLowerCase().includes(s) ||
        (item?.end_date || "").toLowerCase().includes(s) ||
        (item?.status || "").toLowerCase().includes(s)
      );
    }) || [];

  const indexOfLastData = currentPage * itemsPerPage;
  const currentData = filteredData.slice(
    indexOfLastData - itemsPerPage,
    indexOfLastData
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // FORMAT TABLE DATA
  const formattedData = currentData.map((item) => ({
    ...item,
    email: item.user_id === 12 ? "No Email Provided" : item.email,
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

  // SET BACK TO APPROVED
  const { setInactive, loading: approveLoading } = useSetInactive(
    "/booking/booking.php",
    () => {
      refetch();
      setApproveItem(null);
      setApproveAction("");
      setToast({
        message: "Booking moved back to approved",
        type: "success",
      });
    }
  );

  // -------------------------------------------
  // 📌 PDF EXPORT FOR DECLINED BOOKINGS / NOT ATTENDED
  // -------------------------------------------
  const downloadNotAttendedPDF = () => {
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
    doc.text("Not Attended Booking Records", pageWidth / 2, 26, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${currentMonthName} ${currentYear}`, pageWidth / 2, 31, {
      align: "center",
    });

    // Filter by START DATE (monthly)
    const monthlyData = filteredData.filter((item) => {
      const bookingDate = new Date(item.start_date);
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === currentYear
      );
    });

    if (monthlyData.length === 0) {
      alert("No declined bookings found for this month.");
      return;
    }

    const tableColumn = [
      "Booking ID",
      "Guest Name",
      "Phone",
      "Check-In Date",
      "Check-Out Date",
      "Night(s)",
      "Extras Total",
      "Price",
      "Paid",
      "Room",
      "Room Price",
      "Status",
    ];

    const formatNum = (num) =>
      Number(num).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const tableRows = monthlyData.map((item) => {
      // Calculate total extras × nights
      let extrasTotal = 0;
      if (Array.isArray(item.extras) && item.extras.length > 0) {
        extrasTotal = item.extras.reduce((sum, extra) => {
          const priceNum =
            parseFloat(extra.price?.toString().replace(/[^0-9.-]+/g, "")) || 0;
          const quantity = Number(extra.quantity) || 1;
          return sum + priceNum * quantity;
        }, 0);
        extrasTotal = extrasTotal * (Number(item.nights) || 1);
      }

      return [
        item.booking_id,
        item.fullname,
        item.phone,
        item.start_date,
        item.end_date,
        item.nights,
        formatNum(extrasTotal),
        formatNum(item.price),
        formatNum(item.paid),
        item.room?.room_name || "N/A",
        item.room?.price || "N/A",
        item.status,
      ];
    });

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

  //=====================//
  //  view  details  //
  //=====================//
  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
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
          Not Attended Booking
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
              onClick={downloadNotAttendedPDF}
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
            columns={bookingHistory}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBookingHistoryLog({
                item,
                setShowForm,

                onSetBackToApproved: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_backtoapproved");
                },
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

      {approveItem?.booking_id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => {
            setApproveItem(null);
            setApproveAction("");
          }}
          label="Yes, Move Back to Approved"
          label2="back_approved"
          label3="Are you sure you want to move this booking back to approved?"
          onConfirm={() =>
            setInactive({
              id: approveItem?.booking_id,
              action: approveAction,
            })
          }
        />
      )}

      {showForm === "view_details" && (
        <ViewDetails active="not_attended" data={viewDetailsId} />
      )}
    </>
  );
}

export default AdminBookingNotAttended;
