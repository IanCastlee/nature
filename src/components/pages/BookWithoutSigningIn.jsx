import { LazyLoadImage } from "react-lazy-load-image-component";
import { icons } from "../../constant/icon";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";
import CustomDropDownn from "../atoms/CustomDropDownn";
import Input from "../atoms/Input";
import React, { useEffect, useRef, useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import Toaster from "../molecules/Toaster";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useForm } from "../../store/useRoomStore";
import html2canvas from "html2canvas";
import natureLogo from "../../assets/icons/naturelogo2.png";

function BookWithoutSigningIn() {
  const setShowForm = useForm((state) => state.setShowForm);
  const showForm = useForm((state) => state.showForm);

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [addedExtras, setAddedExtras] = useState([]);
  const [extraQty, setExtraQty] = useState(1);

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

  // fetch not available date
  const {
    data: notAvailableDates,
    loading: loadingNAD,
    refetch: refetchNAD,
    error: errorFh,
  } = useGetData(`/booking/get-notavailable-date.php?facility_id=${roomId}`);

  useEffect(() => {
    if (notAvailableDates && notAvailableDates.booked_dates) {
      const normalizeDate = (d) => {
        const nd = new Date(d);
        nd.setHours(0, 0, 0, 0);
        return nd;
      };

      const today = normalizeDate(new Date());
      let disabledDates = [];

      // 1. Expand all booked ranges into flat disabled days
      notAvailableDates.booked_dates.forEach(({ start, end }) => {
        const from = normalizeDate(start);
        const to = normalizeDate(end);

        for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
          disabledDates.push(normalizeDate(d));
        }
      });

      // 2. Sort and store as Set
      disabledDates.sort((a, b) => a - b);
      let disabledSet = new Set(disabledDates.map((d) => d.getTime()));
      const extendedDisabled = [...disabledDates];

      // 3. Add all 1-day gaps
      for (let i = 1; i < disabledDates.length; i++) {
        const prev = disabledDates[i - 1];
        const curr = disabledDates[i];
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);

        if (diff === 2) {
          const middle = new Date(prev);
          middle.setDate(middle.getDate() + 1);
          const normalizedMiddle = normalizeDate(middle);

          if (!disabledSet.has(normalizedMiddle.getTime())) {
            extendedDisabled.push(normalizedMiddle);
            disabledSet.add(normalizedMiddle.getTime());
          }
        }
      }

      //  4. Always disable today
      // if (!disabledSet.has(today.getTime())) {
      //   extendedDisabled.push(today);
      //   disabledSet.add(today.getTime());
      // }

      // 5. Remove duplicates
      const finalDisabled = Array.from(
        new Set(extendedDisabled.map((d) => d.getTime()))
      ).map((t) => new Date(t));

      // 6. Add dates before today
      const pastDates = { before: today };
      setDisabledRanges([pastDates, ...finalDisabled]);
    }
  }, [notAvailableDates]);

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

  const handleSubmitBooking = () => {
    const nights = getNumberOfNights();

    const extrasTotal = addedExtras.reduce(
      (total, item) => total + item.price * item.quantity * nights,
      0
    );

    //  REMEMBER ME — Save or Remove Local Storage
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

    if (!form.terms) {
      return;
    }

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

      total_price: nights * Number(price) + extrasTotal,
    };

    submit(payload);
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
  //handle PreviousRoom
  const handlePreviousRoom = () => {
    if (!dataCategoryIds || dataCategoryIds.length === 0) return;

    const currentIndex = dataCategoryIds.findIndex(
      (room) => String(room.room_id) === roomId
    );

    if (currentIndex === -1) return;

    const prevIndex =
      (currentIndex - 1 + dataCategoryIds.length) % dataCategoryIds.length;
    const prevRoomId = dataCategoryIds[prevIndex].room_id;

    navigate(`/reserve/${prevRoomId}`);
  };

  const {
    data: extrasData,
    loading: extrasLoading,
    error: extrasError,
  } = useGetData(`/admin/room-extras.php?room_id_get=${roomId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching room details.</div>;
  if (!roomDetails) return <div>No room found.</div>;

  const {
    room_id,
    images,
    room_name,
    price,
    capacity,
    description,
    category,
    amenities,
    inclusion,
    extras,
    withExtras,
  } = roomDetails;

  // const parsedAmenities = amenities?.split(",") || [];
  // const parsedInclusions = inclusion?.split(",") || [];
  // const parsedExtras = extrasData?.data || [];

  const nights = getNumberOfNights();
  const roomTotal = nights * Number(price);
  const extrasTotal = addedExtras.reduce(
    (total, item) => total + item.price * item.quantity * nights,
    0
  );

  const grandTotal = roomTotal + extrasTotal;

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
              <h2 className="font-semibold text-sm dark:text-gray-200 text-gray-800">
                Room Details
              </h2>

              <div className="flex flex-row items-center lg:gap-10 md:gap-10 gap-4">
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
              {room_name}
            </h1>
            <p className="text-lg dark:text-white text-gray-800 font-normal">
              Price: {price} / per night
            </p>
            <p className="text-lg dark:text-white text-gray-800 font-normal">
              Capacity: {capacity} persons
            </p>

            {/*  Extras Dropdown */}
            <div className=" mt-4 border-t pt-4 dark:border-gray-600 border-gray-300 pb-4">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-sm">
                Select your prepared date
              </h3>
              <div className="flex lg:flex-row md:flex-col flex-col gap-6 items-center">
                <div className="scale-90 md:scale-100 w-fit border p-2 rounded-lg text-black dark:text-white bg-white dark:bg-gray-900">
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={(range) => {
                      if (range?.from && !range?.to) {
                        setSelectedRange({ from: range.from, to: undefined });
                      } else if (range?.from && range?.to) {
                        setSelectedRange(range);
                      } else {
                        setSelectedRange({ from: undefined, to: undefined });
                      }
                    }}
                    disabled={disabledRanges}
                    modifiersClassNames={{
                      selected: "bg-blue-500 text-white",
                      today: "text-blue-500",
                      disabled: "text-gray-400 line-through",
                    }}
                  />
                </div>

                <div className=" w-full flex flex-col justify-center items-center">
                  <p className="text-xs text-gray-600 dark:text-gray-300 ml-4 dark:bg-gray-900 py-1 px-3 rounded-full  text-center bg-gray-100">
                    {nights} night{nights !== 1 ? "s" : ""}
                  </p>
                  {selectedRange?.from && selectedRange?.to ? (
                    <div className="flex flex-row mt-2 text-sm text-gray-700 dark:text-gray-300">
                      <p>
                        📅 <strong>Check-in:</strong>{" "}
                        {selectedRange.from.toLocaleDateString()}
                      </p>
                      {"/"}
                      {selectedRange.from !== selectedRange.to ? (
                        <p>
                          📅 <strong>Check-out:</strong>{" "}
                          {selectedRange.to.toLocaleDateString()}
                        </p>
                      ) : (
                        <p className="text-xs dark:text-gray-400 text-gray-600 max-w-[100px] ml-4">
                          Select your check-out date
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs dark:text-gray-300 text-gray-700">
                      Select Your Date
                    </p>
                  )}
                </div>
              </div>
            </div>

            {extras && (
              <div className="w-full flex flex-row justify-start items-center  border-t dark:border-gray-600 border-gray-300 pb-4">
                <div className="lg:w-[60%] md:w-full w-full mt-5 ">
                  {/* Label + Icon */}
                  <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-sm">
                    Add Extras
                  </h3>

                  <div className="flex flex-col  md:flex-row lg:flex-row  gap-2 justify-center items-center">
                    <div className="w-[70%]">
                      <CustomDropDownn
                        label="Extras"
                        options={extrasData}
                        value={selectedExtraId}
                        onChange={(selectedId) =>
                          setSelectedExtraId(selectedId)
                        }
                        valueKey="extra_id"
                        labelKey="extras"
                      />
                    </div>

                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="w-[30%]">
                        <Input
                          label="Quantity"
                          type="number"
                          name="qty"
                          min="1"
                          value={extraQty}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (!isNaN(val) && val > 0) {
                              setExtraQty(val);
                            }
                          }}
                        />
                      </div>

                      <Button
                        disabled={isSubmitDisabled}
                        label="Add"
                        style={`bg-blue-600 text-white px-4 py-1 h-[35px] rounded text-sm mt-6 ${
                          isSubmitDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600"
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
                            <span>
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
                      <div className="mt-2 font-normal text-sm text-gray-800 dark:text-gray-200 border-t dark:border-gray-600 border-gray-300 ml-4 pt-2">
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
                  <div className="w-full flex flex-col justify-between items-center  p-4 rounded-lg dark:bg-gray-900 bg-white   border">
                    <div>
                      <div className=" text-md font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Total Price: ₱
                        {grandTotal.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <Button
                        label={formLoading ? "Submitting..." : "Reserve Now"}
                        style={`${
                          isSubmitDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600"
                        } text-white px-4 py-1 h-[35px] rounded text-sm`}
                        // onClick={handleSubmitBooking}
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
        className="text-2xl text-white cursor-pointer absolute top-8 left-8 z-20"
        onClick={() => navigate(-1)}
      />
      {/* {showNote && <Note onContinue={handleContinue} />} */}
      {showForm === "add_user_details" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          {/* MODAL BOX */}
          <div className="bg-white p-4 rounded-2xl shadow-xl w-[95%] max-w-5xl sm:max-h-[98vh] md:max-h-[98vh] lg:max-h-[97vh] overflow-y-auto relative">
            {/* HEADER */}

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Reservation Details & Your Information
            </h2>
            <icons.MdOutlineClose
              onClick={handleCloseFormModal}
              className="absolute top-2 right-2 text-2xl cursor-pointer"
            />

            {/* FLEX CONTAINER: summary (left) + form (right) */}
            <div className="flex flex-col md:flex-row md:gap-12">
              {/* LEFT - SUMMARY */}
              <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-6 border-r-0 sm:border-0 md:border-0 lg:border-r lg:border-gray-300">
                {/* DATES SUMMARY */}
                <div className="grid grid-cols-3 gap-6 mb-6 text-gray-700">
                  <div className="flex flex-col items-center border-r border-gray-300 pr-4">
                    <span className="text-sm uppercase font-semibold mb-1">
                      Check-In
                    </span>
                    <span className="text-sm font-medium">
                      {selectedRange.from
                        ? selectedRange.from.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-r border-gray-300 px-4">
                    <span className="text-sm uppercase font-semibold mb-1">
                      Check-Out
                    </span>
                    <span className="text-sm font-medium">
                      {selectedRange.to
                        ? selectedRange.to.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className=" flex flex-col items-center ">
                    <span className="text-sm uppercase font-semibold mb-1">
                      Nights
                    </span>
                    <span className="text-sm font-medium">{nights}</span>
                  </div>
                </div>

                {/* AMENITIES / EXTRAS */}
                {addedExtras.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-2">
                      Amenities / Extras
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 max-h-40 overflow-y-auto">
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
                <div className="p-4 rounded-lg border border-gray-300 bg-gray-50 text-center font-bold text-xl text-gray-900">
                  Total Price: ₱
                  {grandTotal.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
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
                      required
                    />
                    <Input
                      label="Lastname"
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      className="w-full text-sm"
                      required
                    />
                  </div>

                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full mb-3 text-sm"
                    required
                  />

                  {/* REMEMBER ME */}
                  <div className="flex items-center mb-3 text-sm">
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
                  <div className="flex items-start mb-4 text-sm">
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
                    style="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 text-sm"
                    label={formLoading ? "Submitting..." : "Submit"}
                    disabled={formLoading}
                    onClick={handleSubmitBooking}
                  />
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] p-8 relative max-h-[98vh] overflow-y-auto font-sans"
            style={{
              backgroundImage: `url(${natureLogo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full flex flex-col items-center justify-center mb-2">
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
                  {room_name}
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
                {bookingSummary.address && (
                  <p className="col-span-2">
                    <span className="font-semibold text-gray-700">
                      Address:
                    </span>{" "}
                    {bookingSummary.address}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-gray-700">Check-in:</span>{" "}
                  {bookingSummary.start_date}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Check-out:
                  </span>{" "}
                  {bookingSummary.end_date}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Nights:</span>{" "}
                  {bookingSummary.nights}
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

                {bookingSummary.extras_total > 0 && (
                  <p>
                    <span className="font-semibold text-gray-700">
                      Extras Total:
                    </span>{" "}
                    ₱{Number(bookingSummary.extras_total).toLocaleString()}
                  </p>
                )}

                <p className="font-extrabold text-lg text-blue-700">
                  Total Price: ₱
                  {Number(bookingSummary.total_price).toLocaleString()}
                </p>
              </div>

              {/* Extras */}
              {bookingSummary.extras?.length > 0 && (
                <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
                  <h3 className="font-semibold mb-2 text-gray-800">Extras</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {/* Show first 2 extras */}
                    {bookingSummary.extras.slice(0, 2).map((extra, idx) => (
                      <li key={idx} className="flex justify-between">
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

                    {/* Show "and X others" if more than 2 */}
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
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded shadow-sm text-yellow-800 text-sm font-semibold">
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

export default BookWithoutSigningIn;
