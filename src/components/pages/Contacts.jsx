import React, { useEffect } from "react";
import { images } from "../../constant/image";
import useGetData from "../../hooks/useGetData";
import { icons } from "../../constant/icon";

/* Helper: clean phone number for tel: */
const formatPhone = (num = "") => num.replace(/\D/g, "");

function Contacts() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const { data, loading, error } = useGetData(`/admin/admin_setting.php`);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    );

  const { email, globe_no, smart_no, fb, ig } = data || {};

  return (
    <main className="w-full bg-white dark:bg-black pb-20">
      {/* HERO */}
      <section className="w-full lg:h-[300px] h-[180px] relative mt-[70px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.contact})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-4">
          <h1 className="text-white text-2xl lg:text-5xl font-bold text-center">
            Contact <span className="text-blue-400">Nature Hot Spring</span>
          </h1>
          <p className="text-white mt-2 text-center lg:text-lg text-sm max-w-md">
            2JKLA Nature Hot Spring Inn and Resort Corp.
          </p>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="lg:max-w-[80%] max-w-full mx-auto mt-16 px-4 lg:px-8">
        {(email || globe_no || smart_no || fb || ig) && (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Get in Touch
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For reservations and inquiries, contact us via phone, email, or
              message us on social media. We’re happy to assist you.
            </p>

            {/* MESSAGE US */}
            {(fb || ig) && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Message Us
                </h3>

                <div className="flex flex-wrap gap-3">
                  {fb && (
                    <a
                      href={fb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 
                        bg-blue-600 hover:bg-blue-700 
                        text-white px-4 py-2 rounded-lg 
                        text-sm font-medium shadow-md 
                        transition-all hover:scale-105 active:scale-95"
                    >
                      <icons.FaFacebookMessenger className="text-base" />
                      Messenger
                    </a>
                  )}

                  {ig && (
                    <a
                      href={ig}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 
                        bg-pink-500 hover:bg-pink-600 
                        text-white px-4 py-2 rounded-lg 
                        text-sm font-medium shadow-md 
                        transition-all hover:scale-105 active:scale-95"
                    >
                      <icons.FaInstagram className="text-base" />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* EMAIL */}
            {email && (
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <icons.IoMailSharp />
                  Email
                </h3>

                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 
                    text-blue-600 dark:text-blue-400 
                    hover:text-blue-800 dark:hover:text-blue-300 
                    transition cursor-pointer break-all"
                >
                  {email}
                </a>
              </div>
            )}

            {/* PHONE */}
            {(globe_no || smart_no) && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  <icons.MdLocalPhone />
                  Phone
                </h3>

                <div className="flex flex-col gap-2">
                  {smart_no && (
                    <a
                      href={`tel:${formatPhone(smart_no)}`}
                      className="flex items-center gap-2 
                        text-gray-600 dark:text-gray-300 
                        hover:text-blue-400 transition cursor-pointer"
                    >
                      <icons.FaPhoneAlt className="text-sm" />
                      Smart: {smart_no}
                    </a>
                  )}

                  {globe_no && (
                    <a
                      href={`tel:${formatPhone(globe_no)}`}
                      className="flex items-center gap-2 
                        text-gray-600 dark:text-gray-300 
                        hover:text-blue-400 transition cursor-pointer"
                    >
                      <icons.FaPhoneAlt className="text-sm" />
                      Globe: {globe_no}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Contacts;
