import React, { useEffect, useState } from "react";
import useGetData from "../../hooks/useGetData";

function TermsAndConditions() {
  const { data, loading, error } = useGetData(`/admin/terms_conditions.php`);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setTerms(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Loading Terms & Conditions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500 text-sm">
          {error.message || "Failed to load Terms & Conditions."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-20 mt-[70px]">
      <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Terms and Conditions
        </h1>

        {terms.length > 0 ? (
          terms.map((item) => (
            <div key={item.id} className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-white">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 text-right">
                Last updated: {new Date(item.last_update).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            No terms and conditions available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}

export default TermsAndConditions;
