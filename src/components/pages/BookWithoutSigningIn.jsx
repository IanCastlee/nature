import { LazyLoadImage } from "react-lazy-load-image-component";
import { icons } from "../../constant/icon";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";
import CustomDropDownn from "../atoms/CustomDropDownn";
import Input from "../atoms/Input";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import Toaster from "../molecules/Toaster";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useForm } from "../../store/useRoomStore";
import html2canvas from "html2canvas";
import natureLogo from "../../assets/icons/naturelogo2.png";

function BookWithoutSigningIn() {
  ////////////////////////////////////////////
  const { data: holidaysData } = useGetData("/admin/holidays.php");
  const holidays = holidaysData || [];

  const { data: holiday_charge } = useGetData(`/admin/admin_setting.php`);

  const countHolidayNights = (from, to, holidays) => {
    if (!from || !to || !holidays?.length) return 0;

    const holidaySet = new Set(holidays.map((h) => h.date)); // "MM/DD"
    let count = 0;

    const current = new Date(from);

    while (current < to) {
      const mmdd = `${String(current.getMonth() + 1).padStart(2, "0")}/${String(
        current.getDate()
      ).padStart(2, "0")}`;

      if (holidaySet.has(mmdd)) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  ////////////////////////////////////////////

  const setShowForm = useForm((state) => state.setShowForm);
  const showForm = useForm((state) => state.showForm);

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [addedExtras, setAddedExtras] = useState([]);
  const [extraQty, setExtraQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [showNote, setShowNote] = useState(true);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [bookingSummary, setBookingSummary] = useState(null);

  const summaryRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    firstname: localStorage.getItem("firstname") || "",
    lastname: localStorage.getItem("lastname") || "",
    phone: localStorage.getItem("phone") || "",
    remember: localStorage.getItem("remember_info") === "true" ? true : false,
    terms: false,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [toast, setToast] = useState(null);

  const [selectedRange, setSelectedRange] = useState({
    from: undefined,
    to: undefined,
  });

  const [disabledRanges, setDisabledRanges] = useState([
    { before: new Date() },
  ]);

  // Add local state to track selected extra
  const [selectedExtraId, setSelectedExtraId] = useState("");

  ///////////////////////////

  // fetch not available date
  const {
    data: notAvailableDates,
    loading: loadingNAD,
    refetch: refetchNAD,
    error: errorFh,
  } = useGetData(`/booking/get-notavailable-date.php?facility_id=${roomId}`);

  // extract booked check-in dates
  const bookedCheckIns = useMemo(() => {
    return notAvailableDates?.booked_dates?.map((d) => new Date(d.start)) || [];
  }, [notAvailableDates]);

  function findNearestBookedAfter(fromDate, bookedCheckIns) {
    if (!fromDate) return null;

    const fromTime = fromDate.getTime();

    return (
      bookedCheckIns
        .filter((d) => d.getTime() > fromTime)
        .sort((a, b) => a - b)[0] || null
    );
  }

  const nearestBookedCheckIn = useMemo(() => {
    return findNearestBookedAfter(selectedRange?.from, bookedCheckIns);
  }, [selectedRange?.from, bookedCheckIns]);

  useEffect(() => {
    if (!notAvailableDates?.booked_dates) return;

    const normalizeDate = (d) => {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      return nd;
    };

    const today = normalizeDate(new Date());
    let disabledDates = [];

    // 1️⃣ Expand booked ranges only
    notAvailableDates.booked_dates.forEach(({ start, end }) => {
      const from = normalizeDate(start);
      const to = normalizeDate(end);

      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        disabledDates.push(normalizeDate(d));
      }
    });

    // 2️⃣ Sort + dedupe
    disabledDates.sort((a, b) => a - b);

    let finalDisabled = Array.from(
      new Set(disabledDates.map((d) => d.getTime()))
    ).map((t) => new Date(t));

    // 🔥 3️⃣ TEMPORARY ENABLE nearest booked check-in
    if (selectedRange?.from && nearestBookedCheckIn) {
      const enableTime = normalizeDate(nearestBookedCheckIn).getTime();
      finalDisabled = finalDisabled.filter((d) => d.getTime() !== enableTime);
    }

    // 🔒 4️⃣ Hard stop after nearest booking
    let rules = [{ before: today }, ...finalDisabled];

    if (selectedRange?.from && nearestBookedCheckIn) {
      rules.push({ after: normalizeDate(nearestBookedCheckIn) });
    }

    setDisabledRanges(rules);
  }, [notAvailableDates, selectedRange?.from, nearestBookedCheckIn]);

  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/booking/booking.php", (response) => {
    if (response.success) {
      setToast({
        message: `Reservation submitted successfully!`,
        type: "success",
      });
      setShowForm(null);
      // Save booking summary for modal display
      console.log("RESSSS: ", response);
      setBookingSummary(response);
      setShowSummaryModal(true);
      // Reset form fields etc.
      setSelectedRange({ from: undefined, to: undefined });
      setAddedExtras([]);
      setSelectedExtraId("");
      setExtraQty(1);

      refetchNAD();
    } else {
      setToast({
        message: response.message || "Failed to submit booking",
        type: "error",
      });
    }
  });

  const handleSubmitBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validation
      if (!form.firstname?.trim()) {
        setToast({ message: "Please enter your first name.", type: "error" });
        setIsSubmitting(false);
        return;
      }
      if (!form.lastname?.trim()) {
        setToast({ message: "Please enter your last name.", type: "error" });
        setIsSubmitting(false);
        return;
      }
      if (!form.phone?.trim()) {
        setToast({ message: "Please enter your phone number.", type: "error" });
        setIsSubmitting(false);
        return;
      }
      if (!form.terms) {
        setToast({
          message: "You must accept the terms and conditions.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const nights = getNumberOfNights();

      const extrasTotal = addedExtras.reduce(
        (total, item) => total + item.price * item.quantity * nights,
        0
      );

      // REMEMBER ME
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

      // Payload — send only what backend needs; backend calculates holiday surcharge
      const payload = {
        fullname: `${form.firstname} ${form.lastname}`,
        phone: form.phone,
        facility_id: Number(roomId),
        check_in: selectedRange.from
          ? selectedRange.from.toLocaleDateString("en-CA")
          : null,
        check_out: selectedRange.to
          ? selectedRange.to.toLocaleDateString("en-CA")
          : null,
        nights,
        extras: addedExtras.map((extra) => ({
          id: extra.id,
          name: extra.name,
          quantity: extra.quantity,
          price: extra.price,
        })),
      };

      const response = await submit(payload);

      // Optional: display the response from backend, which now includes holiday info
      if (response.success) {
        setToast({
          message: "Reservation submitted successfully!",
          type: "success",
        });
        console.log("Holiday nights:", response.holiday_nights);
        console.log("Holiday surcharge:", response.holiday_surcharge);
        console.log("Total price:", response.total_price);
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to submit booking",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle adding selected extra to the list
  const handleAddExtra = () => {
    const selectedExtra = extrasData.find(
      (extra) => extra.extra_id === selectedExtraId
    );
    if (!selectedExtra || extraQty <= 0) return;

    const newExtra = {
      id: selectedExtra.extra_id,
      name: selectedExtra.extras,
      price: Number(selectedExtra.price),
      quantity: extraQty,
    };

    setAddedExtras((prev) => {
      const exists = prev.find((item) => item.id === newExtra.id);
      if (exists) {
        return prev.map((item) =>
          item.id === newExtra.id
            ? { ...item, quantity: item.quantity + newExtra.quantity }
            : item
        );
      }
      return [...prev, newExtra];
    });

    setExtraQty(1);
    setSelectedExtraId("");
  };

  const getNumberOfNights = () => {
    if (!selectedRange?.from || !selectedRange?.to) return 0;
    const timeDiff = selectedRange.to.getTime() - selectedRange.from.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  //fetch room details
  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?id=${roomId}`);

  ///fetch room based on category
  const { data: dataCategoryIds } = useGetData(
    `/admin/room.php?categoryId=${roomDetails?.category_id}`
  );

  //handleNextRoom
  const handleNextRoom = () => {
    if (!dataCategoryIds || dataCategoryIds.length === 0) return;

    const currentIndex = dataCategoryIds.findIndex(
      (room) => String(room.room_id) === roomId
    );

    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % dataCategoryIds.length;
    const nextRoomId = dataCategoryIds[nextIndex].room_id;

    navigate(`/reserve/${nextRoomId}`);
  };

  const {
    data: extrasData,
    loading: extrasLoading,
    error: extrasError,
  } = useGetData(`/admin/room-extras.php?room_id_get=${roomId}`);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div>Error fetching room details.</div>;
  if (!roomDetails) return <div>No room found.</div>;

  const { images, room_name, price, capacity, time_in_out, extras } =
    roomDetails;

  const nights = getNumberOfNights();
  const pricePerNight = Number(price);

  // ROOM TOTAL
  const roomTotal = nights * pricePerNight;

  // EXTRAS TOTAL (ALL NIGHTS)
  const extrasTotal = addedExtras.reduce(
    (total, item) => total + item.price * item.quantity * nights,
    0
  );

  // HOLIDAY NIGHTS ONLY
  const holidayNights = countHolidayNights(
    selectedRange?.from,
    selectedRange?.to,
    holidays
  );

  // DAILY TOTAL (ROOM + EXTRAS PER NIGHT)
  const dailyTotal = nights > 0 ? pricePerNight + extrasTotal / nights : 0;

  // 10% SURCHARGE PER HOLIDAY NIGHT (ROOM + EXTRAS)
  // const holidaySurcharge = dailyTotal * 0.1 * holidayNights;

  // Example: dynamic surcharge percentage
  let chargePercent = holiday_charge?.holiday_charge; // can change to 20, 15, etc.
  const holidaySurcharge = dailyTotal * (chargePercent / 100) * holidayNights;

  // GRAND TOTAL
  const grandTotal = roomTotal + extrasTotal + holidaySurcharge;

  const isSubmitDisabled =
    formLoading || !selectedRange.from || !selectedRange.to || nights === 0;

  const removeExtra = (index) => {
    setAddedExtras((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseFormModal = () => {
    setSelectedRange({ from: undefined, to: undefined });
    setAddedExtras([]);
    setShowForm(null);
  };

  const formattedPrice = Number(price).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });
  const currentDate = new Date().toLocaleDateString();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  //helper
  const isRangeInvalid = (from, to, disabledRanges) => {
    if (!from || !to) return false;

    const start = new Date(from);
    const end = new Date(to);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const time = d.setHours(0, 0, 0, 0);

      for (const dis of disabledRanges) {
        // case: exact disabled date
        if (dis instanceof Date && dis.getTime() === time) {
          return true;
        }

        // case: before today rule
        if (dis.before && time < dis.before.getTime()) {
          return true;
        }
      }
    }

    return false;
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
      <div className="w-full dark:bg-black">
        <div className="w-full flex flex-col md:flex-col lg:flex-row">
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}/rooms/${images[0]}`}
            alt="Project image"
            effect="blur"
            wrapperClassName="lg:w-1/2 md:w-full w-full lg:h-screen md:h-[150px] h-[150px]"
            className="w-full h-full object-cover"
          />
          <div className="w-full md:w-full lg:w-1/2  p-6 overflow-y-auto h-screen">
            <div className="w-full flex flex-row justify-between items-center mb-5 pb-1 border-b dark:border-gray-600 border-gray-300 ">
              <h1 className="text-3xl dark:text-white text-gray-800 font-semibold">
                {room_name}
              </h1>
              <div className="flex flex-row items-center lg:gap-10 md:gap-10 gap-4">
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

            <p className="text-base md:text-lg dark:text-white text-gray-800 font-medium tracking-wide">
              Price: {formattedPrice} / per night
            </p>
            <p className="text-base md:text-lg dark:text-white text-gray-800 font-medium tracking-wide">
              Capacity: {capacity} persons
            </p>

            {/*  Extras Dropdown */}
            <div className=" mt-4 border-t pt-4 dark:border-gray-600 border-gray-300 pb-4">
              <div className="w-full flex flex-row justify-between items-center mb-2">
                <h3 className="font-normal mb-2 text-gray-800 dark:text-gray-50 text-sm">
                  Select your prepared date
                </h3>

                <button onClick={() => handleCloseFormModal()}>
                  <icons.TbRefresh
                    title="Refresh"
                    className="dark:text-green-700 lg:text-2xl text-lg"
                  />
                </button>
              </div>

              <div className="flex lg:flex-row md:flex-col flex-col gap-6 items-center">
                <div className="lg:scale-90   md:scale-100 scale-100  w-fit border dark:border-gray-700 border-gray-300 p-2 rounded-lg text-black dark:text-white bg-white dark:bg-gray-900">
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    disabled={disabledRanges}
                    onSelect={(range) => {
                      // reset
                      if (!range?.from) {
                        setSelectedRange({ from: undefined, to: undefined });
                        return;
                      }

                      // check-in only
                      if (range.from && !range.to) {
                        setSelectedRange({ from: range.from, to: undefined });
                        return;
                      }

                      // check-out selected
                      if (range.from && range.to) {
                        const invalid = isRangeInvalid(
                          range.from,
                          range.to,
                          disabledRanges
                        );

                        if (invalid) {
                          setToast({
                            message:
                              "Selected dates include unavailable days. Please choose another range.",
                            type: "error",
                          });

                          setSelectedRange({ from: undefined, to: undefined });
                          return;
                        }

                        //  valid range
                        setSelectedRange(range);
                      }
                    }}
                    modifiersClassNames={{
                      selected:
                        "bg-blue-500 text-white dark:bg-blue-400 dark:text-black",
                      today: "text-blue-600 dark:text-blue-400 font-semibold",
                      disabled:
                        "relative bg-gray-200 text-transparent cursor-not-allowed dark:bg-gray-800",
                    }}
                  />
                </div>

                {selectedRange?.from && (
                  <div
                    className="w-full flex flex-col lg:justify-center md:justify-start justify-start items-center 
               bg-gray-50 dark:bg-gray-900 p-4 rounded-xl 
               shadow-md md:shadow-md lg:shadow-none"
                  >
                    <p className="text-xs text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 py-1 px-3 rounded-full text-center">
                      {nights} night{nights !== 1 ? "s" : ""}
                    </p>

                    {selectedRange?.to ? (
                      <div className="flex lg:flex-col md:flex-row flex-col mt-2 text-sm text-gray-800 dark:text-gray-300 gap-2">
                        <p className="lg:text-lg text-sm font-semibold">
                          <span className="mr-2">Check-in:</span>
                          {formatDate(selectedRange.from)}
                        </p>

                        {selectedRange.from !== selectedRange.to ? (
                          <p className="lg:text-lg text-sm font-semibold">
                            <span className="mr-2">Check-out:</span>
                            {formatDate(selectedRange.to)}
                          </p>
                        ) : (
                          <p
                            className="
            text-xs 
            font-medium 
            bg-yellow-100 
            text-yellow-800 
            dark:bg-yellow-900/40 
            dark:text-yellow-300 
            px-3 py-1.5 
            rounded-md 
            ml-4 
            whitespace-nowrap 
            shadow-sm
          "
                          >
                            ⚠ Select your check-out date
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs dark:text-gray-300 text-gray-700 mt-2">
                        Select Your Date
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {extras && (
              <div className="w-full flex justify-center lg:mt-6 mt-0 lg:px-4">
                <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4">
                  {/* Label */}
                  <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-100 text-sm">
                    Add Extras
                  </h3>

                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Dropdown */}
                    <div className="flex-1">
                      <CustomDropDownn
                        label="."
                        options={extrasData}
                        value={selectedExtraId}
                        onChange={(selectedId) =>
                          setSelectedExtraId(selectedId)
                        }
                        valueKey="extra_id"
                        labelKey="extras"
                      />
                    </div>

                    {/* Quantity + Add button */}
                    <div className="flex gap-2 items-end">
                      <div className="w-[120px]">
                        <Input
                          label="Quantity"
                          type="number"
                          name="qty"
                          min="1"
                          value={extraQty}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (!isNaN(val) && val > 0) setExtraQty(val);
                          }}
                        />
                      </div>

                      <Button
                        disabled={isSubmitDisabled}
                        label="Add"
                        style={`bg-blue-600 text-white px-4 py-2 h-[38px] rounded text-sm transition-colors duration-300 ${
                          isSubmitDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-700"
                        }`}
                        onClick={handleAddExtra}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col mt-10">
              {/*  Booking Summary */}
              <div className="mt-6 space-y-3 text-sm text-gray-800 dark:text-gray-100">
                <div className="flex flex-row">
                  {/* Extras List */}
                  {addedExtras.length > 0 && (
                    <div className="mt-2">
                      <h3 className="text-sm ml-4 font-semibold mb-2 text-gray-800 dark:text-gray-100">
                        Added Extras:
                      </h3>

                      <ul className="text-xs text-gray-800 dark:text-gray-200 space-y-1 list-disc ml-4">
                        {addedExtras.map((extra, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="dark:text-gray-200 text-black font-medium">
                              {extra.name} x {extra.quantity} x {nights} night
                              {nights > 1 ? "s" : ""} = ₱
                              {(
                                extra.price *
                                extra.quantity *
                                nights
                              ).toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                              })}
                            </span>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeExtra(idx)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium ml-4 flex items-center gap-1"
                            >
                              <icons.MdOutlineClose /> Remove
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* Total for Extras */}
                      <div className="mt-2 font-medium text-sm text-black dark:text-gray-200 border-t dark:border-gray-600 border-gray-300 ml-4 pt-2">
                        Total Extras for {nights} night{nights > 1 ? "s" : ""}:
                        ₱
                        {extrasTotal.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row gap-1">
                  {/* Total Price */}
                  <div className="w-full flex flex-col justify-between items-center  p-4 rounded-lg dark:bg-gray-900 bg-white   border dark:border-gray-700 border-gray-300">
                    <div className="w-full flex justify-start mb-2">
                      {/* HOLIDAY SURCHARGE — small only */}
                      {holidayNights > 0 && (
                        <span
                          className="
        inline-block
        text-[11px]
        text-red-600 dark:text-red-400
        bg-red-50 dark:bg-red-900/30
        px-2 py-0.5
        rounded
        leading-tight
      "
                        >
                          Holiday +{chargePercent}% × {holidayNights} day (₱
                          {holidaySurcharge.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                          )
                        </span>
                      )}
                    </div>

                    <div className="w-full flex flex-row items-center justify-between gap-3">
                      <div className="flex flex-col">
                        {/* TOTAL PRICE — BIG & CLEAR */}
                        <span className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100">
                          Total: ₱
                          {grandTotal.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <Button
                        label={formLoading ? "Submitting..." : "Reserve Now"}
                        style={`${
                          isSubmitDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600"
                        } text-white lg:px-4 lg:px-4 px-2 py-1.5 h-[34px] rounded lg:text-sm md:text-sm text-xs font-semibold`}
                        onClick={() => setShowForm("add_user_details")}
                        disabled={isSubmitDisabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <icons.FiArrowLeftCircle
        className="text-2xl text-white cursor-pointer absolute top-8 lg:left-8 left-4 z-20"
        onClick={() => navigate(-1)}
      />
      {/* {showNote && <Note onContinue={handleContinue} />} */}
      {showForm === "add_user_details" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          {/* MODAL BOX */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl w-[95%] max-w-5xl sm:max-h-[98vh] md:max-h-[98vh] lg:max-h-[97vh] overflow-y-auto relative text-gray-900 dark:text-gray-100">
            {/* HEADER */}
            <h2 className="text-lg md:text-2xl font-bold text-center mb-8">
              Reservation Details & Your Information
            </h2>

            <icons.MdOutlineClose
              onClick={handleCloseFormModal}
              className="absolute top-2 right-2 text-2xl cursor-pointer text-gray-900 dark:text-gray-100"
            />

            {/* FLEX CONTAINER: summary (left) + form (right) */}
            <div className="flex flex-col md:flex-row md:gap-12">
              {/* LEFT - SUMMARY */}
              <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-6 border-r-0 sm:border-0 md:border-0 lg:border-r lg:border-gray-300 dark:border-gray-600">
                {/* DATES SUMMARY */}
                <div className="flex gap-4 mb-6 text-gray-700 dark:text-gray-300">
                  {/* CHECK-IN */}
                  <div className="flex-1 flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-2">
                    <span className="text-xs md:text-sm uppercase font-semibold mb-1">
                      Check-In
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {selectedRange.from
                        ? selectedRange.from.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>

                  {/* CHECK-OUT */}
                  <div className="flex-1 flex flex-col items-center border-r border-gray-300 dark:border-gray-600 px-2">
                    <span className="text-xs md:text-sm uppercase font-semibold mb-1">
                      Check-Out
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {selectedRange.to
                        ? selectedRange.to.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>

                  {/* NIGHTS */}
                  <div className="flex-[0.4] flex flex-col items-center">
                    <span className="text-xs md:text-sm uppercase font-semibold mb-1">
                      Nights
                    </span>
                    <span className="text-xs md:text-sm font-medium">
                      {nights}
                    </span>
                  </div>
                </div>

                {/* AMENITIES / EXTRAS */}
                {addedExtras.length > 0 && (
                  <div className="mb-6">
                    <h3 className="lg:text-lg text-sm font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">
                      Amenities / Extras
                    </h3>
                    <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto lg:text-sm text-xs text-gray-700 dark:text-gray-300">
                      {addedExtras.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <span>
                            {item.name} (x{item.quantity})
                          </span>
                          <span className="font-semibold text-blue-600">
                            ₱{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TOTAL PRICE */}
                <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center">
                  {/* HOLIDAY SURCHARGE */}
                  {holidayNights > 0 && (
                    <div
                      className="
      inline-block
      text-[10px] 
      text-red-600 dark:text-red-400 
      bg-red-50 dark:bg-red-900/30 
      px-2 py-1 
      rounded 
      font-semibold 
      mb-2
    "
                    >
                      Holiday Surcharge (+{chargePercent}%) × {holidayNights}{" "}
                      day
                      <div>
                        ₱{" "}
                        {holidaySurcharge.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  )}

                  {/* TOTAL */}
                  <div className=" font-normal text-sm text-gray-800 dark:text-white">
                    Total Price:
                    <div className="font-bold lg:text-xl text-lg">
                      ₱{" "}
                      {grandTotal.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT - FORM */}
              <div className="md:w-1/2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitBooking();
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <Input
                      label="Firstname"
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      className="w-full text-sm"
                    />
                    <Input
                      label="Lastname"
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      className="w-full text-sm"
                    />
                  </div>

                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full mb-3 text-sm"
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

                  {/* SUBMIT BUTTON */}
                  <Button
                    type="submit"
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting}
                    style={`w-full h-12 bg-blue-600 text-white font-semibold rounded-lg transition duration-300 ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                    label={
                      isSubmitting ? "Submitting..." : "Submit Reservation"
                    }
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* BOOKING SUMMARY MODAL */}
      {showSummaryModal && bookingSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4">
          <div
            ref={summaryRef}
            className="relative w-full max-w-[600px] max-h-[98vh] overflow-y-auto rounded-2xl shadow-2xl font-sans"
            style={{
              backgroundImage: `url(${natureLogo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Semi-transparent overlay for readability */}
            <div className="absolute inset-0 bg-white/90 rounded-2xl"></div>

            {/* Content */}
            <div className="relative p-8 space-y-4 text-gray-900">
              {/* Header info */}
              <div className="w-full flex flex-col items-center mb-2 text-center">
                <p className="text-xs">{currentDate}</p>

                <p className="text-xs font-bold">
                  2JKLA NATURE HOT SPRING AND INN RESORT CORP.
                </p>
                <p className="text-xs font-normal">Monbon, Irosin, Sorsgon</p>
              </div>

              <h2 className="text-lg md:text-3xl font-extrabold mb-6 text-center tracking-wide">
                Reservation Details
              </h2>

              {/* Booking info */}
              <div className="space-y-3 text-sm md:text-base leading-relaxed">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-gray-200 pb-4">
                  <p className="text-xs">
                    <span className="font-semibold text-xs">Room:</span>{" "}
                    {room_name}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold text-xs">Booking ID:</span>{" "}
                    {bookingSummary.booking_id}
                  </p>

                  <p className="text-xs">
                    <span className="font-semibold text-xs">Fullname:</span>{" "}
                    {bookingSummary.fullname}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold text-xs">Phone:</span>{" "}
                    {bookingSummary.phone}
                  </p>

                  {bookingSummary.address && (
                    <p className="col-span-2">
                      <span className="font-semibold text-xs">Address:</span>{" "}
                      {bookingSummary.address}
                    </p>
                  )}

                  <p className="text-xs">
                    <span className="font-semibold text-xs">Check-in:</span>{" "}
                    {bookingSummary.start_date}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold text-xs">Check-out:</span>{" "}
                    {bookingSummary.end_date}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold text-xs">Time In/Out:</span>{" "}
                    {time_in_out}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold text-xs">Nights:</span>{" "}
                    {bookingSummary.nights}
                  </p>
                </div>

                {/* Prices */}
                <div className="border-b border-gray-200 pb-4 space-y-1">
                  {/* Base Price */}
                  <p>
                    <span className="font-semibold">Base Price:</span> ₱
                    {Number(bookingSummary.base_price).toLocaleString()}
                  </p>

                  {/* Extras Total */}
                  {bookingSummary.extras_total > 0 && (
                    <p>
                      <span className="font-semibold">Extras Total:</span> ₱
                      {Number(bookingSummary.extras_total).toLocaleString()}
                    </p>
                  )}

                  {/* Holiday Surcharge (if any) */}
                  {bookingSummary.holiday_surcharge > 0 && (
                    <p
                      className="inline-block px-3 py-1 text-[11px] text-amber-700 
             bg-amber-50 
             border border-amber-200 
             rounded"
                    >
                      Holiday +{bookingSummary.holiday_charge_percent}% ×{" "}
                      {bookingSummary.holiday_nights}{" "}
                      {bookingSummary.holiday_nights === 1 ? "night" : "nights"}
                      : ₱
                      {Number(bookingSummary.holiday_surcharge).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </p>
                  )}

                  {/* Grand Total */}
                  <p className="font-extrabold text-lg md:text-xl text-blue-700">
                    Total Price: ₱
                    {Number(bookingSummary.total_price).toLocaleString()}
                  </p>
                </div>

                {/* Extras */}
                {bookingSummary.extras?.length > 0 && (
                  <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                    <h3 className="font-semibold mb-2">Extras</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {bookingSummary.extras.slice(0, 2).map((extra, idx) => (
                        <li key={idx} className="flex justify-between text-xs">
                          <span>
                            {extra.name} (x{extra.quantity})
                          </span>
                          <span className="font-semibold text-blue-600">
                            ₱
                            {Number(
                              (extra.price || 0) * bookingSummary.nights
                            ).toLocaleString()}
                          </span>
                        </li>
                      ))}
                      {bookingSummary.extras.length > 2 && (
                        <li className="flex justify-between font-semibold text-blue-600">
                          <span>
                            and {bookingSummary.extras.length - 2} other
                            {bookingSummary.extras.length - 2 > 1 ? "s" : ""}
                          </span>
                          <span>
                            ₱
                            {Number(
                              bookingSummary.extras
                                .slice(2)
                                .reduce(
                                  (sum, extra) =>
                                    sum +
                                    Number(extra.price || 0) *
                                      bookingSummary.nights,
                                  0
                                )
                            ).toLocaleString()}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Payment Reminder */}
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm text-yellow-800 text-xs md:text-sm font-semibold">
                  Kindly settle the required{" "}
                  <strong>50% advance payment</strong> within the day to secure
                  the reservation. <br />
                  <span className="block mt-1">
                    ⚠️ If the advance payment is not received within the day,
                    the reservation will automatically be removed.
                  </span>
                  <span className="block mt-1">
                    ❌ This booking is <strong>non-refundable</strong> and{" "}
                    <strong>cannot be cancelled</strong>.
                  </span>
                </div>
              </div>

              {/* Close Button */}
              {/* <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition text-3xl font-bold"
                onClick={() => setShowSummaryModal(false)}
              >
                &times;
              </button> */}
            </div>
          </div>

          {/* SCREENSHOT OVERLAY */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
            <div className="bg-black bg-opacity-50 flex items-center justify-center w-full h-full p-4">
              <div className="bg-white rounded-xl p-5 text-center shadow-xl max-w-md w-full space-y-3 border border-gray-200">
                {/* Pending Booking Note with Contact */}
                <p className="text-gray-900 text-sm">
                  Your booking is currently <strong>pending</strong>. To make it
                  approved, kindly contact{" "}
                  <a
                    href="/contacts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-semibold"
                  >
                    Nature Hot Spring
                  </a>{" "}
                  for the <strong>50% advance payment</strong>.
                </p>

                {/* Booking Confirmation Note */}

                {/* Business Hours */}
                <p className="text-gray-500 text-xs mt-1">
                  <span className="font-semibold">Business Hours:</span>{" "}
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-black dark:bg-gray-200 dark:text-black text-[0.7rem]">
                    Open 24 hours • Every day
                  </span>
                </p>

                {/* Screenshot Button */}
                <button
                  onClick={handleScreenshot}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg transition-shadow shadow-md"
                >
                  📸 Save Reservation Details
                </button>

                <p className=" text-gray-800 text-xs">
                  Please save your reservation details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookWithoutSigningIn;
