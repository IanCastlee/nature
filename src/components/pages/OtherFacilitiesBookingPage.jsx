import { LazyLoadImage } from "react-lazy-load-image-component";
import { icons } from "../../constant/icon";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import useFormSubmit from "../../hooks/useFormSubmit";
import { uploadUrl } from "../../utils/fileURL";
import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import Toaster from "../molecules/Toaster";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Button from "../atoms/Button";

function OtherFacilitiesBookingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { facilityId } = useParams();

  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [disabledDates, setDisabledDates] = useState([]);

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/booking/fh-booking.php", () => {
    setToast({
      message: "Booking submitted successfully!",
      type: "success",
    });

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

  const handleBooking = () => {
    if (!selectedDate || !startTime) {
      setToast({
        message: "Please complete all booking fields.",
        type: "error",
      });
      return;
    }

    const slotHours = 8; // default/fixed duration for the booking

    const bookingDate = new Date(selectedDate);
    const formattedDate = bookingDate.toLocaleDateString("en-CA");

    const startDateTime = new Date(`${formattedDate}T${startTime}`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + slotHours);

    const startHour = startDateTime.getHours();
    const endHour = endDateTime.getHours();

    if (startHour < 4 || endHour > 22 || endHour <= startHour) {
      setToast({
        message: `Booking must start atleast between 4:00 AM and end by 10:00 PM.`,
        type: "error",
      });
      return;
    }

    const formattedEndTime = endDateTime.toTimeString().split(" ")[0]; // HH:MM:SS

    submit({
      fhId: Number(facilityId),
      date: formattedDate,
      startTime: startTime,
      endTime: formattedEndTime,
      facilityType: "function hall",
      userId: user?.id,
    });
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
        <div className="w-full flex flex-row">
          {/* Left - Image */}
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}/function_hall/${image}`}
            alt="Facility image"
            effect="blur"
            wrapperClassName="w-1/2 h-screen"
            className="w-full h-full object-cover"
          />

          {/* Right - Booking Form */}
          <div className="w-1/2 p-6 overflow-y-auto h-screen">
            <div className="w-full flex flex-row justify-between items-center mb-5 pb-1 border-b dark:border-gray-600 border-gray-300">
              <h2 className="font-semibold text-sm dark:text-gray-200 text-gray-800">
                Facility Details
              </h2>
              <div className="flex flex-row items-center gap-10">
                <Button
                  onClick={handlePreviousRoom}
                  label={
                    <>
                      <icons.BsArrowRight className="transform -scale-x-100" />
                      Previous Room
                    </>
                  }
                  style="flex flex-row items-center gap-1 text-sm text-blue-500 font-medium rounded-sm px-2 transition-all duration-300 transform hover:scale-105 mb-4"
                />
                <Button
                  onClick={handleNextRoom}
                  label={
                    <>
                      Next Room
                      <icons.BsArrowRight />
                    </>
                  }
                  style="flex flex-row items-center gap-1 text-sm text-blue-500 font-medium rounded-sm px-2 transition-all duration-300 transform hover:scale-105 mb-4"
                />
              </div>
            </div>

            <h1 className="text-3xl dark:text-white text-gray-800 font-semibold">
              {name}
            </h1>
            <p className="text-lg dark:text-white text-gray-800 font-normal">
              Price: ₱{price} / per {duration} hours
            </p>
            <p className="text-lg dark:text-white text-gray-800 font-normal">
              Capacity: {capacity} persons
            </p>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
                Book This Facility
              </h3>

              <div className="flex flex-row gap-6">
                {/* Date Picker */}
                <div>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Select Date:
                  </label>

                  <div className="scale-90 md:scale-100 w-fit border p-2 rounded-lg">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      required
                      disabled={[
                        { before: new Date() }, // Disable past
                        ...disabledDates, // Disable booked
                      ]}
                    />
                  </div>
                </div>

                {/* Time Input */}
                <div>
                  <label className="block mt-4 mb-1 text-sm text-gray-600 dark:text-gray-300">
                    Start Time:
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    min="05:00"
                    max="21:59"
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={formLoading || startTime === "" || !selectedDate}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
              >
                {formLoading ? "Booking..." : "Book Now"}
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
    </>
  );
}

export default OtherFacilitiesBookingPage;
