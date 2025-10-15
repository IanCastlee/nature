import { LazyLoadImage } from "react-lazy-load-image-component";
import { icons } from "../../constant/icon";
import { useNavigate, useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { uploadUrl } from "../../utils/fileURL";
import Button from "../atoms/Button";
import CustomDropDownn from "../atoms/CustomDropDownn";
import Input from "../atoms/Input";
import React, { useState } from "react";
import useFormSubmit from "../../hooks/useFormSubmit";
import useAuthStore from "../../store/authStore";

function BookingPage() {
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const { roomId } = useParams();
  const [addedExtras, setAddedExtras] = useState([]);
  const [extraQty, setExtraQty] = useState(1);

  //  Add local state to track selected extra
  const [selectedExtraId, setSelectedExtraId] = useState("");
  const {
    submit,
    loading: formLoading,
    error: formError,
  } = useFormSubmit("/booking/booking.php", () => {
    // Optional: do something on success
    alert("Booking submitted successfully!");
    // navigate("/booking-success"); // or go back
  });

  const handleSubmitBooking = () => {
    const extrasTotal = addedExtras.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const totalPrice = Number(price) + extrasTotal;

    const payload = {
      userId: user.id, // 👈 FIXED: was user_id
      facility_type: "room",
      facility_id: Number(roomId),
      extras: addedExtras.map((extra) => ({
        id: extra.id,
        name: extra.name,
        quantity: extra.quantity,
        price: extra.price,
      })),
    };

    console.log("✅ Submitting payload:", payload);
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

  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?id=${roomId}`);

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
    image,
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
  const parsedExtras = extras?.split(",") || [];

  return (
    <>
      <div className="w-full dark:bg-black">
        <div className="w-full flex flex-row">
          <LazyLoadImage
            src={`${uploadUrl.uploadurl}/rooms/${image}`}
            alt="Project image"
            effect="blur"
            wrapperClassName="w-1/2 h-screen"
            className="w-full h-full object-cover"
          />
          <div className="w-1/2  p-6 overflow-y-auto h-screen">
            <div className="w-full flex flex-row justify-between items-center mb-5 pb-1 border-b dark:border-gray-600 border-gray-300 ">
              <h2 className="font-semibold text-sm dark:text-gray-200 text-gray-800">
                Room Details
              </h2>
              <Button
                label={
                  <>
                    Next Room
                    <icons.FiArrowUpRight />
                  </>
                }
                style="flex flex-row items-center gap-1 text-sm text-blue-500 font-medium rounded-sm px-2 transition-all duration-300 transform hover:scale-105 mb-4"
              />
            </div>

            <h1 className="text-3xl dark:text-white text-gray-800 font-semibold">
              {room_name}
            </h1>
            <p className="text-lg dark:text-white text-gray-800 font-normal">
              Price: {price}
            </p>
            <p className="text-lg dark:text-white text-gray-800 font-normal">
              Capacity: {capacity} persons
            </p>

            <div className="w-full flex flex-row gap-x-8 mt-6 border-b dark:border-gray-600 border-gray-300 pb-4">
              <ul className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                  Amenities
                </h3>
                {parsedAmenities.length ? (
                  parsedAmenities.map((amenity, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                    >
                      {amenity.trim()}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    No amenities listed.
                  </li>
                )}
              </ul>

              <ul className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                  Room Inclusions
                </h3>
                {parsedInclusions.length ? (
                  parsedInclusions.map((inclusion, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                    >
                      {inclusion.trim()}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    No inclusions listed.
                  </li>
                )}
              </ul>

              <ul className="flex-1">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50 text-lg">
                  Room Extras
                </h3>
                {extrasData?.length ? (
                  extrasData.map((extra, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                    >
                      {extra.extras} = ₱{" "}
                      {Number(extra.price).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    No extras listed.
                  </li>
                )}
              </ul>
            </div>

            {/*  Extras Dropdown */}
            <div className="w-full flex flex-row justify-start items-center  border-b dark:border-gray-600 border-gray-300 pb-4">
              <div className="w-[60%] mt-5 ">
                <h3>Add Extras</h3>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <div className="w-[70%]">
                    <CustomDropDownn
                      label="Extras"
                      options={extrasData}
                      value={selectedExtraId}
                      onChange={(selectedId) => setSelectedExtraId(selectedId)}
                      valueKey="extra_id"
                      labelKey="extras"
                    />
                  </div>
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
                    label="Add"
                    style="bg-blue-600 text-white px-4 py-1 rounded text-sm mt-6"
                    onClick={handleAddExtra}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-10">
              {/*  Booking Summary */}
              <div className="mt-6 space-y-3 text-sm text-gray-800 dark:text-gray-100">
                {/* Room Price */}

                {/* Extras List */}
                {addedExtras.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm ml-4 font-semibold mb-2 text-gray-800 dark:text-gray-100">
                      Added Extras:
                    </h3>

                    <ul className="text-xs text-gray-800 dark:text-gray-200 space-y-1 list-disc ml-4">
                      {addedExtras.map((extra, idx) => (
                        <li key={idx}>
                          {extra.name} x {extra.quantity} = ₱
                          {(extra.price * extra.quantity).toLocaleString(
                            "en-PH",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Total for Extras */}
                    <div className="mt-2 font-normal text-sm text-gray-800 dark:text-gray-200  border-t dark:border-gray-600 border-gray-300  ml-4">
                      Total Extras: ₱
                      {addedExtras
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                    </div>
                  </div>
                )}
                <div className="pl-4">
                  <span className="font-medium">Room Price:</span> ₱
                  {Number(price).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                {/* Total Price */}
                <div className="w-full flex flex-row justify-between items-center  p-4 rounded-lg dark:bg-gray-900 bg-gray-100   ">
                  <div className=" text-md font-bold text-gray-800 dark:text-gray-100 ">
                    Total Price: ₱
                    {(
                      Number(price) +
                      addedExtras.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                    ).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </div>

                  <Button
                    label="Proceed"
                    style="bg-green-600 text-white px-4 py-1 rounded text-sm"
                    onClick={handleSubmitBooking}
                    disabled={formLoading}
                  />
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
