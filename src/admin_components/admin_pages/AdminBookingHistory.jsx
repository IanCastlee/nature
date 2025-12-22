import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBookingHistory } from "../admin_molecules/RenderActions";
import { bookingApproved } from "../../constant/tableColumns";
import useSetInactive from "../../hooks/useSetInactive";
import Toaster from "../../components/molecules/Toaster";
import DeleteModal from "../../components/molecules/DeleteModal";
import ViewDetails from "../admin_molecules/ViewDetails";
import ReSchedBooking from "../admin_molecules/ReSchedBooking";
import { icons } from "../../constant/icon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function AdminBookingHistory() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);
  const [showResched, setShowResched] = useState(false);
  const [viewDetailsId, setViewDetailsId] = useState(null);
  const [toast, setToast] = useState(null);
  const [approveItem, setApproveItem] = useState(null);
  const [reschedItem, setReschedItem] = useState(null);

  const [approveAction, setApproveAction] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //==================//
  //     GET DATA     //
  //==================//
  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=approved,rescheduled`
  );

  console.log("DATA : ", data);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //==================//
  //    FILTER DATA   //
  //==================//
  const filteredData =
    data?.filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      const q = String(search).toLowerCase();

      return (
        String(item?.booking_id || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.fullname || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.phone || "")
          .toLowerCase()
          .includes(q) ||
        String(item?.room_name || "")
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

  const indexOfLastData = currentPage * itemsPerPage;
  const indexOfFirstData = indexOfLastData - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //==================//
  //   VIEW DETAILS   //
  //==================//
  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
  };

  const viewFHDetails = (item) => {
    setShowForm("view fh-hall");
    setViewDetailsId(item);
  };

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
      maximumFractionDigits: 2,
    })}`,
    price: `₱${Number(item.price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    half_price: `₱${Number(item.price / 2).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
  }));

  //==================//
  //   UPDATE STATUS  //
  //==================//
  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setApproveItem(null);
    setApproveAction("");

    setToast({
      message:
        approveAction === "set_arrived"
          ? "Booking marked as arrived"
          : approveAction === "set_not_attended"
          ? "Booking marked as Not Attended"
          : "Booking back to pending",
      type: "success",
    });
  });

  // -------------------------------------------
  // 📌 PDF EXPORT FOR APPROVED BOOKINGS
  // -------------------------------------------
  const downloadApprovedPDF = () => {
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
    doc.text("Approved Room Booking Records", pageWidth / 2, 26, {
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
      alert("No approved bookings found for this month.");
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
      // Calculate total extras price × nights
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

    doc.save(`Approved_Bookings_${currentMonthName}_${currentYear}.pdf`);
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
          Approved Booking
        </h1>

        {loading && <p className="text-blue-500 text-sm mb-4">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.message || "Something went wrong."}
          </p>
        )}

        <div className="w-full flex flex-row justify-between items-center mb-2">
          <span className="dark:text-gray-100 text-xs font-medium">
            Showing {filteredData.length} Booking
          </span>

          <div className="flex flex-row items-center gap-2">
            <button
              onClick={downloadApprovedPDF}
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
            columns={bookingApproved}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBookingHistory({
                item,
                setShowForm,

                onSetPending: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_pending");
                },

                onSetArrived: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_arrived");
                },

                onSetNotAttended: (item) => {
                  setApproveItem(item);
                  setApproveAction("set_not_attended");
                },
                onSetReshed: (item) => {
                  setReschedItem(item);
                  setShowResched(true);
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

      {/* MODAL FOR ARRIVED / PENDING / NOT ATTENDED */}
      {approveItem?.booking_id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => {
            setApproveItem(null);
            setApproveAction("");
          }}
          label={
            approveAction === "set_arrived"
              ? "Yes, Mark as Arrived"
              : approveAction === "set_not_attended"
              ? "Yes, Mark as Not Attended"
              : "Yes, Move to Pending"
          }
          label2={
            approveAction === "set_arrived"
              ? "arrived"
              : approveAction === "set_not_attended"
              ? "not attended"
              : "pending"
          }
          label3={
            approveAction === "set_arrived"
              ? "This booking will be moved and marked as Arrived."
              : approveAction === "set_not_attended"
              ? "This booking will be moved and marked as Not Attended."
              : "Are you sure you want to move this booking back to pending?"
          }
          onConfirm={() => {
            setInactive({
              id: approveItem?.booking_id,
              action: approveAction,
            });
          }}
        />
      )}

      {showForm === "view_details" && (
        <ViewDetails data={viewDetailsId} active="approved" />
      )}

      {showResched && reschedItem && (
        <ReSchedBooking
          booking={reschedItem}
          onClose={() => setShowResched(false)}
          refetchBooking={refetch}
        />
      )}
    </>
  );
}

export default AdminBookingHistory;
