import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";
import { useForm } from "../../store/useRoomStore";
import { uploadUrl } from "../../utils/fileURL";

function ViewRoomDetails({ roomId }) {
  const setShowForm = useForm((state) => state.setShowForm);

  const {
    data: roomDetails,
    loading,
    error,
  } = useGetData(`/admin/room.php?id=${roomId}`);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!roomDetails) return null;

  const {
    image,
    room_name,
    price,
    capacity,
    duration,
    category,
    amenities,
    inclusion,
  } = roomDetails;

  const parsedAmenities = amenities?.split(",") || [];
  const parsedInclusions = inclusion?.split(",") || [];

  console.log(roomDetails);
  return (
    <div className="w-full h-screen bg-black/10 flex justify-center items-start pt-10 fixed inset-0 z-50">
      <div className="w-[70%] max-h-[80%] bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg overflow-y-auto">
        <div className="w-full flex flex-row justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-50">
            Room Details
          </h3>

          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="cursor-pointer text-2xl text-gray-800 dark:text-gray-50 hover:text-red-500"
          />
        </div>

        <div className="w-full flex flex-row gap-4 mb-4">
          <img
            src={`${uploadUrl.uploadurl}/rooms/${image}`}
            alt={room_name}
            className="w-[30%] rounded object-cover border"
          />

          <div className="w-[70%] text-sm text-gray-700 flex flex-col gap-2">
            <p className="dark:text-white">
              <strong>Room Name:</strong> {room_name}
            </p>
            <p className="dark:text-white">
              <strong>Category:</strong> {category}
            </p>
            <p className="dark:text-white">
              <strong>Price:</strong> ₱{parseFloat(price).toLocaleString()}
            </p>
            <p className="dark:text-white">
              <strong>Capacity:</strong> {capacity}{" "}
              {capacity > 1 ? "people" : "person"}
            </p>
            <p className="dark:text-white">
              <strong>Duration:</strong> {duration} hours
            </p>
          </div>
        </div>

        <div className="w-full flex flex-row gap-12 mt-6">
          <ul className="flex-1">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50">
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
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50">
              Room Inclusions
            </h3>
            {parsedInclusions.length ? (
              parsedInclusions.map((amenity, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4"
                >
                  {amenity.trim()}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 italic">
                No inclusions listed.
              </li>
            )}
          </ul>

          <ul className="flex-1">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-50">
              Extras
            </h3>
            <li className="text-sm text-gray-500 italic">Not available</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ViewRoomDetails;
