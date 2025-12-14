import Button from "../admin_atoms/Button";
import { IoClose } from "react-icons/io5";

const ViewDetailsModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">FAQ Details</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Question (EN)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {item.question_en}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Question (TL)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {item.question_tl}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Answer (EN)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-line">
                {item.answer_en}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Answer (TL)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-line">
                {item.answer_tl}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            label="Close"
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          />
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
