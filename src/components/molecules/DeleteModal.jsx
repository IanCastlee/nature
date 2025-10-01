import { icons } from "../../constant/icon";
import Button from "../../admin_components/admin_atoms/Button";

function DeleteModal({ item, loading, onCancel, onConfirm }) {
  return (
    <div className="w-full h-screen bg-black/10 flex justify-center items-start pt-10 fixed inset-0 z-50">
      <div className="w-[300px] rounded-md dark:bg-gray-800 bg-white relative p-2 shadow-lg">
        <div className="mt-8">
          <p className="text-center text-sm font-medium dark:text-white text-gray-800">
            You are about to Set "<strong>{item.category}</strong>" as Inactive
          </p>
          <p className="text-center text-xs dark:text-gray-200 font-medium text-gray-600 mt-5">
            This will make the category unavailable, but not delete it
            permanently.
          </p>
        </div>

        <div className="flex flex-row justify-end items-center gap-2 mt-5">
          <Button
            className="h-[28px] border dark:border-gray-700 border-gray-200 px-2 dark:bg-gray-800 text-xs text-gray-800 dark:text-white font-medium rounded-md w-auto hover:bg-gray-300 dark:hover:bg-gray-700"
            label="Cancel"
            handleClick={onCancel}
          />
          <Button
            disabled={loading}
            handleClick={() => {
              console.log("DeleteModal: onConfirm clicked for", item);
              onConfirm();
            }}
            className="h-[28px] px-2 bg-red-500 text-xs text-white font-medium rounded-md w-auto hover:bg-gray-600"
            label={loading ? "Updating..." : "Set Inactive"}
          />
        </div>

        <div className="dark:bg-gray-700 bg-gray-100 h-[50px] w-[50px] rounded-full flex justify-center items-center absolute p-1 -top-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full dark:bg-gray-800 bg-white h-full w-full flex justify-center items-center">
            <icons.MdDeleteForever className="text-[40px] text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
