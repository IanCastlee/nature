import React, { useEffect } from "react";
import { images } from "../../constant/image";
import useGetData from "../../hooks/useGetData";
import { icons } from "../../constant/icon";

function Contacts() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const { data, loading, error } = useGetData(`/admin/admin_setting.php`);

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    );

  const { email, globe_no, smart_no, fb, ig } = data || {};

  return (
    <main className="w-full bg-white dark:bg-black pb-20">
      {/* Hero Section */}
      <section className="w-full h-[300px] relative mt-[70px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.contact})` }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <h1 className="text-white text-2xl lg:text-5xl font-bold text-center">
            Contact <span className="text-blue-400">Nature Hot Spring</span>
          </h1>
          <p className="text-white mt-2 text-center lg:text-lg text-sm max-w-md">
            2JKLA Nature Hot Spring Inn and Resort Corp.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="lg:max-w-[80%] max-w-[100%] mx-auto mt-16 px-2 lg:px-8">
        {(email || globe_no || smart_no || fb || ig) && (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              For reservations and inquiries, please contact us via email or
              phone, or connect with us on our social media channels. We're here
              to help you plan your perfect stay.
            </p>

            {(fb || ig) && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Message Us
                </h3>
                <div className="flex gap-4">
                  {fb && (
                    <a
                      href={fb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <icons.FaFacebookMessenger className="mr-1" /> Facebook
                    </a>
                  )}
                  {ig && (
                    <a
                      href={ig}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            {email && (
              <div className="mb-4">
                <h3 className="flex flex-row items-center font-semibold text-gray-700 dark:text-gray-200">
                  <icons.IoMailSharp className="mr-1" /> Email
                </h3>
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline cursor-pointer break-all"
                  title={`Send an email to ${email}`}
                >
                  {email}
                </a>
              </div>
            )}

            {(globe_no || smart_no) && (
              <div className="mb-4">
                <h3 className="flex flex-row items-center font-semibold text-gray-700 dark:text-gray-200">
                  <icons.MdLocalPhone className="mr-1" /> Phone
                </h3>
                {globe_no && (
                  <p className="text-gray-600 dark:text-gray-300">
                    Globe: {globe_no}
                  </p>
                )}
                {smart_no && (
                  <p className="text-gray-600 dark:text-gray-300">
                    Smart: {smart_no}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Contacts;
