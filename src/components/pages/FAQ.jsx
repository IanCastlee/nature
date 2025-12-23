import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import useGetData from "../../hooks/useGetData";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [language, setLanguage] = useState("en");

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  // FETCH FAQs
  const { data, loading, error } = useGetData("/admin/faqs.php");

  const faqs =
    data?.map((item) => ({
      question: {
        en: item.question_en,
        tl: item.question_tl,
      },
      answer: {
        en: item.answer_en,
        tl: item.answer_tl,
      },
    })) || [];

  return (
    <section className="w-full bg-gray-50 dark:bg-black mt-[70px] py-20 px-4 lg:px-[120px]">
      {/* ================= HEADER ================= */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {language === "en"
            ? "Frequently Asked Questions"
            : "Mga Madalas Itanong"}
        </h2>

        <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          {language === "en"
            ? "Find answers to common questions about reservations and policies."
            : "Hanapin ang mga sagot sa karaniwang tanong tungkol sa reservation."}
        </p>

        {/* Language Switch */}
        <div className="flex justify-center mt-6">
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
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-4xl mx-auto space-y-4">
        {loading && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Loading FAQs...
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-500">
            Error loading FAQs.
          </p>
        )}

        {!loading &&
          !error &&
          faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border border-gray-200 dark:border-gray-700 
                          bg-white dark:bg-neutral-900 overflow-hidden transition
                          ${openIndex === index ? "shadow-md" : "shadow-sm"}`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left
                           hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {faq.question[language]}
                </span>
                <span
                  className={`text-lg transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {openIndex === index ? (
                    <FiMinus className="dark:text-white text-gray-800" />
                  ) : (
                    <FiPlus className="dark:text-white text-gray-800" />
                  )}
                </span>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line border-t border-gray-200 dark:border-gray-700">
                  {faq.answer[language]}
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}

export default FAQ;
