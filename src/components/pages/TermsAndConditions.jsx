import React, { useEffect, useState } from "react";
import useGetData from "../../hooks/useGetData";
import { Link } from "react-router-dom";
import { icons } from "../../constant/icon";
function TermsAndConditions() {
  const { data, loading } = useGetData("/admin/terms.php");
  const [terms, setTerms] = useState([]);
  const [language, setLanguage] = useState("en"); // "en" or "tl"

  const { data: dataSetting } = useGetData(`/admin/admin_setting.php`);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-20 mt-[70px]">
      <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {/* Header + Language Selector */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="lg:text-3xl md:text-2xl text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left flex-1">
            Terms and Conditions
          </h1>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">
              Language:
            </span>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${
                language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("tl")}
              className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${
                language === "tl"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              TL
            </button>
          </div>
        </div>

        {/* Terms content */}
        {terms.length > 0 ? (
          terms.map((item) => (
            <div key={item.id} className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {language === "en" ? item.title_en : item.title_tl}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {language === "en" ? item.content_en : item.content_tl}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 text-right">
                Last updated:{" "}
                {item.updated_at
                  ? new Date(item.updated_at).toLocaleString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300 text-sm text-center">
            No terms and conditions available at the moment.
          </p>
        )}

        <div className="flex flex-row flex-wrap gap-3 p-3 border dark:border-gray-700  rounded-md bg-white/10 dark:bg-gray-800/20">
          <a
            href={dataSetting?.fb || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm flex items-center gap-2 hover:text-blue-400 transition"
          >
            <icons.FaFacebookMessenger className="text-blue-400 text-2xl border border-blue-400 rounded-full p-1" />
            Nature Hot Spring Page
          </a>

          <Link className="dark:text-white text-sm flex items-center gap-2">
            <icons.FaPhoneAlt className="text-blue-400 text-2xl border border-blue-400 rounded-full p-1" />
            Smart: {dataSetting?.smart_no || "0917-XXXXXXX"}
          </Link>

          <Link className="dark:text-white text-sm flex items-center gap-2">
            <icons.FaPhoneAlt className="text-blue-400 text-2xl border border-blue-400 rounded-full p-1" />
            Globe: {dataSetting?.globe_no || "0922-XXXXXXX"}
          </Link>

          <Link className="dark:text-white text-sm flex items-center gap-2">
            <icons.IoIosMail className="text-blue-400 text-2xl border border-blue-400 rounded-full p-1" />
            {dataSetting?.email || "info@example.com"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
