import { icons } from "../../constant/icon";
import { useParams } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import BookingCard from "../molecules/BookingCard";

function MyBookingPage() {
  const { userId } = useParams();

  // useGetData already returns an array (based on your console log)
  const {
    data: bookings,
    loading,
    error,
  } = useGetData(`/booking/get-booking.php?user_id=${userId}`);

  console.log("Booking data:", bookings);

  if (loading)
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        Loading bookings...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-20">
        Failed to load bookings.
      </div>
    );

  //  Check if bookings array is empty
  if (!bookings || bookings.length === 0)
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        No bookings found.
      </div>
    );

  return (
    <div className="px-[200px] min-h-screen py-10 bg-white dark:bg-black mt-[70px]">
      <div className="flex flex-row justify-between items-center mb-6">
        <h3 className="flex flex-row items-center gap-1 text-2xl font-semibold dark:text-white text-gray-800">
          <icons.GoChecklist /> My Booking
        </h3>

        <icons.GrHistory className="text-gray-500 dark:text-gray-400" />
      </div>

      {/*  Now loop through your array */}
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <BookingCard key={booking.booking_id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

export default MyBookingPage;
