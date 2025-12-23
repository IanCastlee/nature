import React, { useEffect, useState } from "react";
import useGetData from "../../hooks/useGetData";
import { Link } from "react-router-dom";
import { icons } from "../../constant/icon";

function TermsAndConditions() {
  const { data, loading } = useGetData("/admin/terms.php");
  const { data: dataSetting } = useGetData("/admin/admin_setting.php");

  const [terms, setTerms] = useState([]);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (Array.isArray(data)) setTerms(data);
  }, [data]);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-black">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          Loading Terms & Conditions...
        </p>
      </div>
    );
  }

  return (
    <section className="w-full bg-gray-50 dark:bg-black lg:mt-[70px] mt-[50px] py-20 px-4 lg:px-[120px]">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-md p-6 sm:p-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Terms & Conditions
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Please read these terms carefully before making a reservation.
            </p>
          </div>

          {/* Language Switch */}
          <div className="inline-flex rounded-full bg-gray-200 dark:bg-neutral-800 p-1">
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
                language === "en"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("tl")}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
                language === "tl"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              TL
            </button>
          </div>
        </div>

        {/* ================= TERMS CONTENT ================= */}
        {terms.length > 0 ? (
          <div className="space-y-10">
            {terms.map((item) => (
              <div key={item.id}>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {language === "en" ? item.title_en : item.title_tl}
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {language === "en" ? item.content_en : item.content_tl}
                </p>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                  Last updated:{" "}
                  {item.updated_at
                    ? new Date(item.updated_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            No terms and conditions available at the moment.
          </p>
        )}

        {/* ================= CONTACT INFO ================= */}
        <div className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 bg-gray-50 dark:bg-neutral-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Need help? Contact us
          </h3>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm">
            <a
              href={dataSetting?.fb || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-500 transition"
            >
              <icons.FaFacebookMessenger className="text-xl" />
              Nature Hot Spring Page
            </a>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <icons.FaPhoneAlt className="text-blue-500" />
              Smart: {dataSetting?.smart_no || "0917-XXXXXXX"}
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <icons.FaPhoneAlt className="text-blue-500" />
              Globe: {dataSetting?.globe_no || "0922-XXXXXXX"}
            </div>

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <icons.IoIosMail className="text-blue-500" />
              {dataSetting?.email || "info@example.com"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TermsAndConditions;
