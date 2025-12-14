import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import useGetData from "../../hooks/useGetData";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [language, setLanguage] = useState("en");

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);
  const toggleLanguage = () => setLanguage(language === "en" ? "tl" : "en");

  // FETCH FAQs
  const { data, loading, error } = useGetData("/admin/faqs.php");

  // Transform backend data to match the previous structure
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
    <section className="py-16 bg-white dark:bg-black mt-[70px] w-full lg:px-[120px] px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          {language === "en"
            ? "Frequently Asked Questions"
            : "Mga Madalas Itanong"}
        </h2>

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

      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Loading FAQs...</p>
      )}
      {error && (
        <p className="text-red-500">Error loading FAQs: {error.message}</p>
      )}

      <div className="space-y-4 w-full">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 w-full"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-6 py-4 bg-white dark:bg-neutral-900 flex justify-between items-center focus:outline-none transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
            >
              <span className="font-semibold text-gray-800 dark:text-white text-base sm:text-sm lg:text-lg">
                {faq.question[language]}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xl">
                {openIndex === index ? <FiMinus /> : <FiPlus />}
              </span>
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 whitespace-pre-line border-t border-gray-200 dark:border-gray-700 transition-all duration-300 text-sm sm:text-base lg:text-lg">
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

const faqs = [
  {
    question: {
      en: "How to book a room?",
      tl: "Paano magpareserba ng kwarto?",
    },
    answer: {
      en: `1. Select a room and choose from the available dates.
2. If the room has extras, you can select them during the booking process.
3. Fill in your details (full name and phone number) and submit the reservation.
4. After submission, you will see a summary of your reservation. Make sure to save it.
5. Contact the admin to pay 50% of the total price to approve your reservation.`,
      tl: `1. Pumili ng kwarto at piliin ang mga available na petsa.
2. Kung ang kwarto ay may extras, maaari mo itong piliin habang nagbo-book.
3. Ilagay ang iyong detalye (buong pangalan at numero ng telepono) at isumite ang reservation.
4. Pagkatapos isumite, makikita mo ang summary ng iyong reservation. Siguraduhing i-save ito.
5. Kontakin ang admin upang bayaran ang 50% ng kabuuang presyo upang maaprubahan ang reservation.`,
    },
  },
  {
    question: { en: "Payment and approval", tl: "Pagbabayad at Pag-apruba" },
    answer: {
      en: `- To confirm your booking, you must pay 50% of the total price.
- Payment must be made within the same day of booking submission.
- If the payment is not made on time, the reservation will be removed by the admin.`,
      tl: `- Upang makumpirma ang iyong booking, kailangan mong bayaran ang 50% ng kabuuang presyo.
- Dapat bayaran ang reservation sa parehong araw ng pagsumite.
- Kung hindi mabayaran sa oras, ang reservation ay tatanggalin ng admin.`,
    },
  },
  {
    question: {
      en: "Cancellation and rescheduling",
      tl: "Kanselasyon at Paglipat ng Petsa",
    },
    answer: {
      en: `- Reservation cannot be canceled / non-refundable once booked.
- However, you can reschedule your reservation by contacting the admin.
- Rescheduling is allowed without extra penalty, but payment rules still apply.`,
      tl: `- Hindi maaaring kanselahin ang reservation / hindi refundable kapag na-book na.
- Maaari kang mag-reschedule sa pamamagitan ng pakikipag-ugnayan sa admin.
- Pinapayagan ang pag-reschedule nang walang karagdagang penalty, ngunit ang mga patakaran sa pagbabayad ay nananatili.`,
    },
  },
  {
    question: { en: "Extras", tl: "Extras" },
    answer: {
      en: `- Only rooms that have available extras will allow you to add them.
- Extras include items like additional beds, meals, or other amenities.
- The total price for extras will be added to your reservation summary.`,
      tl: `- Tanging ang mga kwarto na may available extras lamang ang maaari mong idagdag.
- Ang extras ay kinabibilangan ng karagdagang kama, pagkain, o iba pang amenities.
- Ang kabuuang presyo para sa extras ay idaragdag sa iyong reservation summary.`,
    },
  },
];
