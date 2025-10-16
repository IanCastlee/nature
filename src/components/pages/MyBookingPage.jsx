import { icons } from "../../constant/icon";
import { useParams } from "react-router-dom";

function MyBookingPage() {
  const { userId } = useParams();
  return (
    <>
      <div className="px-[200px] min-h-screen py-10 bg-white dark:bg-black mt-[70px]">
        <div className="flex flex-row justify-between items-center ">
          <h3 className="flex flex-row items-center gap-1 text-lg font-medium dark:text-white text-gray-800">
            <icons.GoChecklist /> My Booking
          </h3>

          <icons.GrHistory />
        </div>
      </div>
    </>
  );
}

export default MyBookingPage;
