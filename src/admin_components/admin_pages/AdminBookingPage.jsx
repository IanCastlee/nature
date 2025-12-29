import React, { useState } from "react";
import Pagination from "../admin_molecules/Pagination";
import { useForm } from "../../store/useRoomStore";
import useGetData from "../../hooks/useGetData";
import NoData from "../../components/molecules/NoData";
import SearchInput from "../admin_atoms/SearchInput";
import GenericTable from "../admin_molecules/GenericTable";
import { renderActionsBooking } from "../admin_molecules/RenderActions";
import useSetInactive from "../../hooks/useSetInactive";
import DeleteModal from "../../components/molecules/DeleteModal";
import { bookingPending } from "../../constant/tableColumns";
import Toaster from "../../components/molecules/Toaster";
import ViewDetails from "../admin_molecules/ViewDetails";
import DeclineModal from "../admin_molecules/DeclineModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { icons } from "../../constant/icon";
import ApproveBooking from "../admin_molecules/ApproveBooking";
function AdminBookingPage() {
  const showForm = useForm((state) => state.showForm);
  const setShowForm = useForm((state) => state.setShowForm);

  const [approveItem, setApproveItem] = useState(null);
  const [approveItemFullpayment, setApproveItemFullpayment] = useState(null);
  const [declinedItem, setDeclinedItem] = useState(null);

  const [viewDetailsId, setViewDetailsId] = useState(null);

  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  //==============//
  //  DATA FETCH  //
  //==============//

  const { data, loading, refetch, error } = useGetData(
    `/booking/get-booking.php?status=pending`
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //=================//
  // DATA FILTERING //
  //===============//

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

  //==========================//
  //   HANDLE APPROVE/ACTIONS //
  //==========================//

  const {
    setInactive,
    loading: approveLoading,
    error: approveError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setApproveItem(null);
    setToast({
      message: "Booking set as approved with 50% payment",
      type: "success",
    });
  });

  //==========================//
  //   HANDLE APPROVE/ACTIONS (FULL PAYMENT) //
  //==========================//
  const {
    setInactive: setInactiveFP,
    loading: approveFPLoading,
    error: approveFPError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setApproveItemFullpayment(null);
    setToast({
      message: "Booking set as approved with full payment",
      type: "success",
    });
  });

  //==========================//
  //   HANDLE DECLINE         //
  //==========================//

  const {
    setInactive: setDeclined,
    loading: declinedLoading,
    error: decclinedError,
  } = useSetInactive("/booking/booking.php", () => {
    refetch();
    setDeclinedItem(null);
  });

  //=====================//
  //  view  details  //
  //=====================//
  const viewDetails = (item) => {
    setShowForm("view_details");
    setViewDetailsId(item);
  };

  const formattedData = currentData.map((item) => ({
    ...item,
    email: item.firstname === "Admin" ? "No Email Provided" : item.email,
    room_name: item.room?.room_name || "N/A",
    extras:
      item.extras && item.extras.length > 0
        ? item.extras
            .map((extra) => `${extra.name} (x${extra.quantity})`)
            .join(", ")
        : "None",
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
  // 📌 PDF EXPORT FOR PENDING BOOKINGS
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
    doc.text("Pending Room Booking Records", pageWidth / 2, 26, {
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
      alert("No pending bookings found for this month.");
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
      // Calculate total price of extras multiplied by nights
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
          Pending Booking
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
              onClick={downloadDeclinedPDF}
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
            columns={bookingPending}
            data={formattedData}
            loading={loading}
            noDataComponent={<NoData />}
            renderActions={(item) =>
              renderActionsBooking({
                item,
                setShowForm,
                onSetApprove: (item) => setApproveItem(item),
                // onSetApproveFullPayment: (item) =>
                //   setApproveItemFullpayment(item),
                onSetDeClined: (item) => setDeclinedItem(item),
                onSetViewDetails: (item) => viewDetails(item),

                // ✅ ADD THIS
                onSetApprovedOptions: (item) => {
                  setApproveItem(item); // save clicked row
                  setShowForm("approved_options"); // show component
                },
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

      {/* APPROVE MODAL */}
      {/* {approveItem?.booking_id && (
        <DeleteModal
          item={approveItem}
          name={approveItem?.firstname}
          loading={approveLoading}
          onCancel={() => setApproveItem(null)}
          label="Yes, Approve"
          label2="approve this booking"
          label3="Confirmation for half payment"
          onConfirm={() => {
            setInactive({
              id: approveItem?.booking_id,
              action: "set_approve",
            });
          }}
        />
      )} */}

      {/* APPROVE MODAL FULL PAYMENT */}
      {/* {approveItemFullpayment?.booking_id && (
        <DeleteModal
          item={approveItemFullpayment}
          name={approveItemFullpayment?.firstname}
          loading={approveFPLoading}
          onCancel={() => setApproveItemFullpayment(null)}
          label="Yes, Approve"
          label2="approve this booking"
          label3="Confirmation for full payment"
          onConfirm={() => {
            setInactiveFP({
              id: approveItemFullpayment?.booking_id,
              action: "set_approve_fp",
            });
          }}
        />
      )} */}

      {/* DECLINE MODAL */}
      {declinedItem?.booking_id && (
        <DeclineModal
          item={declinedItem}
          loading={declinedLoading}
          onCancel={() => setDeclinedItem(null)}
          onConfirm={(reason) => {
            setDeclined({
              id: declinedItem.booking_id,
              action: "set_decline",
              reason: reason,
            });

            setToast({
              message: "The booking has been declined.",
              type: "success",
            });

            setDeclinedItem(null);
          }}
        />
      )}

      {showForm === "view_details" && <ViewDetails data={viewDetailsId} />}

      {showForm === "approved_options" && (
        <ApproveBooking refetch={refetch} data={approveItem} />
      )}
    </>
  );
}

export default AdminBookingPage;
