import Button from "../admin_atoms/Button";

const ViewTermsModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">
            Terms & Conditions
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Title (EN)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {item.title_en}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Title (TL)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {item.title_tl}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Content (EN)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-line">
                {item.content_en}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Content (TL)
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-line">
                {item.content_tl}
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

export default ViewTermsModal;
