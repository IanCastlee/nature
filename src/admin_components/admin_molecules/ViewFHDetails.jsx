import { icons } from "../../constant/icon";
import useGetData from "../../hooks/useGetData";
import { useForm } from "../../store/useRoomStore";
import { uploadUrl } from "../../utils/fileURL";
import { motion } from "framer-motion";

function ViewFHDetails({ fhId }) {
  const setShowForm = useForm((state) => state.setShowForm);

  const {
    data: functionHallDetails,
    loading,
    error,
  } = useGetData(`/admin/functionhall.php?id=${fhId}`);

  console.log(
    "functionHallDetails : ",
    functionHallDetails ? functionHallDetails : {}
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading room details.</p>
    );
  if (!functionHallDetails) return null;

  const { image, name, price, capacity, duration, description, category } =
    functionHallDetails;

  return (
    <div className="w-full h-screen bg-black/10 flex justify-center items-center  fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-[70%] max-h-[90%] bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg overflow-y-auto"
      >
        <div className="w-full flex flex-row justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-50">
            Funtion Hall Details
          </h3>

          <icons.MdOutlineClose
            onClick={() => setShowForm(null)}
            className="cursor-pointer text-2xl text-gray-800 dark:text-gray-50 hover:text-red-500"
          />
        </div>

        <div className="w-full flex flex-row gap-4 mb-4">
          <img
            src={`${uploadUrl.uploadurl}/function_hall/${image}`}
            alt={name}
            className="w-[30%] rounded object-cover border"
          />

          <div className="w-[70%] text-sm text-gray-700 flex flex-col gap-2">
            <p className="dark:text-white">
              <strong>Funtion Hall:</strong> {name}
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

        <div className="w-full border-t dark:border-gray-700 border-gray-200 mt-10 pt-4">
          <h3 className="dark:text-white text-gray-700 text-sm font-semibold">
            * Description
          </h3>
          <p className="dark:text-white text-gray-800 text-sm mt-2">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ViewFHDetails;
