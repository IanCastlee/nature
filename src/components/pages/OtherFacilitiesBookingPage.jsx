import { LazyLoadImage } from "react-lazy-load-image-component";
import { icons } from "../../constant/icon";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import useFormSubmit from "../../hooks/useFormSubmit";
import { uploadUrl } from "../../utils/fileURL";
import React, { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/authStore";
import Toaster from "../molecules/Toaster";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Button from "../atoms/Button";
import { useForm } from "../../store/useRoomStore";
import Input from "../atoms/Input";
import natureLogo from "../../assets/icons/naturelogo2.png";
import html2canvas from "html2canvas";

function OtherFacilitiesBookingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { facilityId } = useParams();

  const setShowForm = useForm((state) => state.setShowForm);
  const showForm = useForm((state) => state.showForm);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [bookingSummary, setBookingSummary] = useState(null);

  const summaryRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [disabledDates, setDisabledDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    firstname: localStorage.getItem("firstname") || "",
    lastname: localStorage.getItem("lastname") || "",
    phone: localStorage.getItem("phone") || "",
    remember: localStorage.getItem("remember_info") === "true" ? true : false,
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/booking/fh-booking.php", (response) => {
    setToast({
      message: "Reservation submitted successfully!",
      type: "success",
    });

    setBookingSummary(response);
    setShowSummaryModal(true);

    refetchNAD();
    setStartTime("");
    setSelectedDate(null);
  });

  const {
    data: notAvailableDatesTime,
    loading: loadingNAD,
    refetch: refetchNAD,
    error: errorFh,
  } = useGetData(`/booking/booked-dates-fh.php?facility_id=${facilityId}`);

  // fetch fh data
  const { data: fhIds } = useGetData(`/admin/functionhall.php?status=active`);

  //handleNextRoom
  const handleNextRoom = () => {
    if (!fhIds || fhIds.length === 0) return;

    const currentIndex = fhIds.findIndex(
      (fh) => String(fh.fh_id) === facilityId
    );

    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % fhIds.length;
    const nextFacilityId = fhIds[nextIndex].fh_id;

    navigate(`/other-facilities-booking/${nextFacilityId}`);
  };

  //handlePreviousRoom
  const handlePreviousRoom = () => {
    if (!fhIds || fhIds.length === 0) return;

    const currentIndex = fhIds.findIndex(
      (fh) => String(fh.fh_id) === facilityId
    );

    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + fhIds.length) % fhIds.length;
    const prevFacilityId = fhIds[prevIndex].fh_id;

    navigate(`/other-facilities-booking/${prevFacilityId}`);
  };

  useEffect(() => {
    if (notAvailableDatesTime?.booked_dates?.length > 0) {
      const dates = notAvailableDatesTime.booked_dates.map(
        (entry) => new Date(entry.date)
      );
      setDisabledDates(dates);
    }
  }, [notAvailableDatesTime]);

  const {
    data: fhDetails,
    loading: fhLoading,
    error: fhError,
  } = useGetData(`/admin/functionhall.php?id=${facilityId}`);

  if (fhLoading) return <div>Loading...</div>;
  if (fhError) return <div>Error fetching facility details.</div>;
  if (!fhDetails) return <div>No facility found.</div>;

  const { image, name, price, capacity, duration } = fhDetails;

  const handleBooking = async () => {
    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true); // disable further clicks

    try {
      if (!form.terms) {
        setToast({
          message:
            "You must agree to the Terms & Conditions before proceeding.",
          type: "message",
        });
        return;
      }

      if (!selectedDate || !startTime) {
        setToast({
          message: "Please complete all booking fields.",
          type: "error",
        });
        return;
      }

      setShowForm(null);

      // REMEMBER ME — Save or Remove Local Storage
      if (form.remember) {
        localStorage.setItem("firstname", form.firstname);
        localStorage.setItem("lastname", form.lastname);
        localStorage.setItem("phone", form.phone);
        localStorage.setItem("remember_info", "true");
      } else {
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("phone");
        localStorage.removeItem("remember_info");
      }

      const slotHours = 8;

      const bookingDate = new Date(selectedDate);
      const formattedDate = bookingDate.toLocaleDateString("en-CA");

      const startDateTime = new Date(`${formattedDate}T${startTime}`);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + slotHours);

      const startHour = startDateTime.getHours();
      const endHour = endDateTime.getHours();

      if (startHour < 4 || endHour > 22 || endHour <= startHour) {
        setToast({
          message: `Booking must start at least between 4:00 AM and end by 10:00 PM.`,
          type: "error",
        });
        return;
      }

      const formattedEndTime = endDateTime.toTimeString().split(" ")[0]; // HH:MM:SS

      // Await the submit function if it's async
      await submit({
        fullname: `${form.firstname} ${form.lastname}`,
        phone: form.phone,
        fhId: Number(facilityId),
        date: formattedDate,
        startTime: startTime,
        endTime: formattedEndTime,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookingDate = new Date(selectedDate);
  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleScreenshot = () => {
    const overlay = document.getElementById("overlay-message");

    // Hide overlay before screenshot
    if (overlay) overlay.style.display = "none";

    if (summaryRef.current) {
      html2canvas(summaryRef.current).then((canvas) => {
        // Show overlay again
        if (overlay) overlay.style.display = "flex";

        const link = document.createElement("a");
        link.download = `booking_summary_${bookingSummary.booking_id}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const formattedPrice = Number(price).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });
  const currentDate = new Date().toLocaleDateString();

  const handleCloseFormModal = () => {
    setSelectedDate(null);
    setStartTime("");
    setShowForm(null);
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

      {formError && (
        <Toaster
          message="Something went wrong during submission."
          type="error"
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full dark:bg-black">
        <div className="w-full flex flex-col md:flex-col lg:flex-row">
          {/* LEFT IMAGE SECTION */}
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}/function_hall/${image}`}
            alt="Facility image"
            effect="blur"
            wrapperClassName="
        w-full 
        lg:w-1/2 
        h-[280px] 
        md:h-[350px] 
        lg:h-screen
      "
            className="w-full h-full object-cover rounded-b-lg lg:rounded-none"
          />

          {/* RIGHT PANEL */}
          <div
            className="
      w-full 
      lg:w-1/2 
      p-5 
      md:p-8 
      lg:p-10 
      overflow-y-auto 
      lg:h-screen 
      bg-white 
      dark:bg-gray-900
    "
          >
            {/* HEADER */}
            <div className="w-full flex flex-row justify-between items-center mb-6 pb-2 border-b dark:border-gray-700 border-gray-300">
              <h1 className="text-2xl md:text-3xl dark:text-white text-gray-800 font-bold">
                {name}
              </h1>

              <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
                {/* <Button
                  onClick={handlePreviousRoom}
                  label={
                    <>
                      <icons.BsArrowRight className="transform -scale-x-100" />
                      Previous
                    </>
                  }
                  style="flex items-center gap-1 text-sm text-blue-500 font-medium rounded px-2 py-1 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                /> */}
                <Button
                  onClick={handleNextRoom}
                  label={
                    <>
                      Next <icons.BsArrowRight />
                    </>
                  }
                  style="flex items-center gap-1 text-sm text-blue-500 font-medium rounded px-2 py-1 hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                />
              </div>
            </div>

            {/* TITLE AND BASIC INFO */}

            <p className="text-base md:text-lg dark:text-white text-gray-800 font-medium tracking-wide">
              Price: {formattedPrice} / per {duration} hours
            </p>
            <p className="text-base md:text-lg dark:text-white text-gray-800 font-medium tracking-wide">
              Capacity: {capacity} persons
            </p>

            {/* BOOKING SECTION */}
            <div className="mt-8">
              <h3 className="text-lg md:text-xl font-normal text-gray-700 dark:text-white mb-3">
                Book This Facility
              </h3>

              {/* DATE + TIME ROW */}
              <div className="w-full flex flex-col sm:flex-row gap-6">
                {/* DATE PICKER */}
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Select Date:
                  </label>

                  <div className="border rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      required
                      disabled={[{ before: new Date() }, ...disabledDates]}
                    />
                  </div>
                </div>

                {/* TIME INPUT */}
                <div className="sm:w-[40%] w-full">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Start Time:
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    min="05:00"
                    max="21:59"
                    onChange={(e) => setStartTime(e.target.value)}
                    className="
                w-full p-3 
                border dark:border-gray-700 
                rounded-md 
                dark:bg-gray-800 
                dark:text-white 
                shadow-sm
              "
                  />
                </div>
              </div>

              {/* BOOK NOW BUTTON */}
              <button
                onClick={() => setShowForm("add_user_details")}
                disabled={formLoading || startTime === "" || !selectedDate}
                className="
            mt-6 
            bg-blue-600 hover:bg-blue-700 
            text-white font-semibold 
            w-full sm:w-auto 
            px-6 py-3 rounded-lg 
            shadow-md disabled:opacity-50 
            transition-all
          "
              >
                {formLoading ? "Booking..." : "Reserve Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <icons.FiArrowLeftCircle
        className="text-2xl text-white cursor-pointer absolute top-8 left-8 z-20"
        onClick={() => navigate(-1)}
      />

      {/* FORM MODAL WITH ADJUSTED WIDTH */}
      {showForm === "add_user_details" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[95%] max-w-5xl max-h-[98vh] overflow-y-auto relative">
            <h2 className="text-lg md:text-2xl font-bold text-center text-gray-900 mb-8">
              Reservation Details & Your Information
            </h2>
            <icons.MdOutlineClose
              onClick={handleCloseFormModal}
              className="absolute top-2 right-2 text-2xl cursor-pointer"
            />
            <div className="flex flex-col md:flex-row md:gap-12">
              <div className="md:w-3/5 mb-8 md:mb-0 pr-6 border-r border-gray-300">
                <div className="grid grid-cols-3 gap-6 mb-6 text-gray-700">
                  {/* Make "Choosen Date" span 2 columns */}
                  <div className="flex flex-col items-center border-r border-gray-300 pr-4 col-span-2">
                    <span className="text-xs md:text-sm uppercase font-semibold mb-1">
                      Choosen Date
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex flex-col items-center pl-4">
                    <span className="text-xs md:text-sm uppercase font-semibold mb-1">
                      Start Time
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {startTime} AM
                    </span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 text-center font-bold text-xl text-gray-900">
                  Total Price: ₱
                  {price.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Form - 40% width on md+ */}
              <div className="md:w-2/5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBooking();
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Firstname"
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                    <Input
                      label="Lastname"
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </div>

                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full mb-4"
                    required
                  />

                  {/* REMEMBER ME */}
                  <div className="flex items-center mt-2 mb-3 text-xs md:text-sm">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={form.remember}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          remember: e.target.checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 select-none cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                      Remember my info for next time
                    </label>
                  </div>

                  {/* TERMS & CONDITIONS */}
                  <div className="flex items-start mb-4 text-xs md:text-sm">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                      checked={form.terms}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          terms: e.target.checked,
                        }))
                      }
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 select-none cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                      I have read and agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Terms & Conditions
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full h-12 bg-blue-600 text-white font-semibold rounded-lg ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Reservation"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING SUMMARY MODAL */}
      {showSummaryModal && bookingSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
          <div
            ref={summaryRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] p-8 relative max-h-[90vh] overflow-y-auto font-sans"
            style={{
              backgroundImage: `url(${natureLogo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full flex flex-col items-center justify-center mb-2">
              <p className="text-xs">{currentDate}</p>

              <p className="text-xs font-bold">
                2JKLA NATURE HOT SPRING AND INN RESORT COPR.
              </p>
              <p className="text-xs font-normal">Monbon, Irosin, Sorsgon</p>
            </div>
            {/* Header */}
            <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-900 tracking-wide">
              Reservation Details
            </h2>

            <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-gray-200 pb-4">
                <p>
                  <span className="font-semibold text-gray-700">Room:</span>{" "}
                  {name}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Booking ID:
                  </span>{" "}
                  {bookingSummary.booking_id}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">Fullname:</span>{" "}
                  {bookingSummary.fullname}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Phone:</span>{" "}
                  {bookingSummary.phone}
                </p>

                <p>
                  <span className="font-semibold text-gray-700">
                    Choosen Date :
                  </span>{" "}
                  {bookingSummary.date}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Start Time :
                  </span>{" "}
                  {bookingSummary.start_time}
                </p>
              </div>

              {/* Prices */}
              <div className="border-b border-gray-200 pb-4 space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">
                    Base Price:
                  </span>{" "}
                  ₱{Number(bookingSummary.base_price).toLocaleString()}
                </p>

                <p className="font-extrabold text-lg text-blue-700">
                  Total Price: ₱
                  {Number(bookingSummary.total_price).toLocaleString()}
                </p>
              </div>

              {/* Payment Reminder */}
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm text-yellow-800 text-xs md:text-sm font-semibold">
                Kindly settle the required <strong>50% advance payment</strong>{" "}
                within the day to secure the reservation. <br />
                <span className="block mt-1">
                  ⚠️ If the advance payment is not received within the day, the
                  reservation will automatically be removed.
                </span>
                <span className="block mt-1">
                  ❌ This booking is <strong>non-refundable</strong> and{" "}
                  <strong>cannot be cancelled</strong>.
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition text-3xl font-bold"
              onClick={() => setShowSummaryModal(false)}
            >
              &times;
            </button>
          </div>

          {/* SCREENSHOT OVERLAY (separate, covers whole screen) */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
            <div className="bg-black bg-opacity-60 flex items-center justify-center w-full h-full">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg max-w-md w-full space-y-4 border border-gray-300">
                <p className="text-blue-800 text-sm font-medium">
                  Please take a screenshot of this summary and send it to{" "}
                  <strong>Nature Hot Spring</strong> to confirm your booking.
                </p>
                <p className="text-red-600 text-xs font-semibold">
                  ⚠️ Do not delete this screenshot. You will need it for entry
                  and confirmation.
                </p>
                <button
                  onClick={handleScreenshot}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
                >
                  📸Take Screenshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OtherFacilitiesBookingPage;
