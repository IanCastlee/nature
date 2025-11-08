import { LazyLoadImage } from "react-lazy-load-image-component";
import { icons } from "../../constant/icon";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";
import CustomDropDownn from "../atoms/CustomDropDownn";
import Input from "../atoms/Input";
import React, { useEffect, useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import useAuthStore from "../../store/authStore";
import Toaster from "../molecules/Toaster";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function BookingPage() {
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [addedExtras, setAddedExtras] = useState([]);
  const [extraQty, setExtraQty] = useState(1);

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
      if (!disabledSet.has(today.getTime())) {
        extendedDisabled.push(today);
        disabledSet.add(today.getTime());
      }

      // 5. Remove duplicates
      const finalDisabled = Array.from(
        new Set(extendedDisabled.map((d) => d.getTime()))
      ).map((t) => new Date(t));

      // 6. Add dates before today
      const pastDates = { before: today }; // disables all dates before today
      setDisabledRanges([pastDates, ...finalDisabled]);
    }
  }, [notAvailableDates]);

  //submit booking form
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/booking/booking.php", () => {
    setToast({
      message: "Booking submitted successfully!!",
      type: "success",
    });

    //  Reset all fields
    setSelectedRange({ from: undefined, to: undefined });
    setAddedExtras([]);
    setSelectedExtraId("");
    setExtraQty(1);
    refetchNAD();
  });

  const handleSubmitBooking = () => {
    const nights = getNumberOfNights();

    const extrasTotal = addedExtras.reduce(
      (total, item) => total + item.price * item.quantity * nights,
      0
    );

    const payload = {
      userId: user.user_id,
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

    navigate(`/booking/${nextRoomId}`);
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

    navigate(`/booking/${prevRoomId}`);
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

  const parsedAmenities = amenities?.split(",") || [];
  const parsedInclusions = inclusion?.split(",") || [];
  const parsedExtras = extrasData?.data || [];

  const nights = getNumberOfNights();
  const roomTotal = nights * Number(price);
  const extrasTotal = addedExtras.reduce(
    (total, item) => total + item.price * item.quantity * nights,
    0
  );

  const grandTotal = roomTotal + extrasTotal;

  const isSubmitDisabled =
    formLoading || !selectedRange.from || !selectedRange.to || nights === 0;

  console.log("EXTRAS: ", extrasData);

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
                {/* <div className="scale-90  md:scale-100 w-fit border p-2 rounded-lg">
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
                </div> */}
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
                          <li key={idx}>
                            {extra.name} x {extra.quantity} x {nights} night
                            {nights > 1 ? "s" : ""} = ₱
                            {(
                              extra.price *
                              extra.quantity *
                              nights
                            ).toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
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
                        label={formLoading ? "Submitting..." : "Submit Booking"}
                        style={`${
                          isSubmitDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600"
                        } text-white px-4 py-1 h-[35px] rounded text-sm`}
                        onClick={handleSubmitBooking}
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
    </>
  );
}

export default BookingPage;
