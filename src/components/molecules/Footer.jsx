import React from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { Link } from "react-router-dom";
import useGetData from "../../hooks/useGetData";

function Footer() {
  const currentYear = new Date().getFullYear();
  // fetch data
  const { data } = useGetData(`/admin/admin_setting.php`);

  return (
    <footer className="w-full bg-slate-50 dark:bg-gray-950 border-t dark:border-gray-900">
      <div className="flex flex-col lg:flex-row justify-between px-4 md:px-6 lg:px-20 py-8 gap-8">
        {/* Logo */}
        <div className="flex-shrink-0 w-full lg:w-[220px] flex justify-center lg:justify-start">
          <img
            src={images.logo}
            alt="Nature Hot Spring Logo"
            className="w-[150px] lg:w-[220px] object-contain"
          />
        </div>

        {/* Contacts */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm dark:text-white font-semibold">CONTACTS</h3>
          <a
            href={data?.fb || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 
  text-blue-600 hover:text-blue-800 
  dark:text-blue-400 dark:hover:text-blue-300
  text-sm font-medium transition-all"
          >
            <span
              className="p-1.5 rounded-full border border-blue-400 
    dark:border-blue-500 text-blue-600 dark:text-blue-300
    bg-white dark:bg-gray-800 
    shadow-sm hover:shadow-md transition"
            >
              <icons.FaFacebookMessenger className="text-lg" />
            </span>

            <span className="underline underline-offset-2 hover:underline-offset-4 transition-all">
              Nature Hot Spring Page
            </span>
          </a>

          <Link className="dark:text-white text-sm flex items-center gap-3">
            <icons.FaPhoneAlt className="text-blue-400 text-2xl border rounded-full border-blue-400 p-1" />
            Smart: {data?.smart_no || "0917-XXXXXXX"}
          </Link>
          <Link className="dark:text-white text-sm flex items-center gap-3">
            <icons.FaPhoneAlt className="text-blue-400 text-2xl border rounded-full border-blue-400 p-1" />
            Globe: {data?.globe_no || "0922-XXXXXXX"}
          </Link>
          <div className="dark:text-white text-sm flex items-center gap-3 cursor-pointer">
            <icons.IoIosMail className="text-blue-400 text-2xl border rounded-full border-blue-400 p-1" />

            <a
              href={`mailto:${data?.email}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline break-all"
              title={`Send an email to ${data?.email}`}
            >
              {data?.email || "info@example.com"}
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm dark:text-white font-semibold">QUICK LINKS</h3>
          <Link
            to="/"
            className="dark:text-white text-sm hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="dark:text-white text-sm hover:text-blue-400 transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="dark:text-white text-sm hover:text-blue-400 transition"
          >
            Contact
          </Link>
          <Link
            to="/faq"
            className="dark:text-white text-sm hover:text-blue-400 transition"
          >
            FAQs
          </Link>
          <Link
            to="/terms"
            className="dark:text-white text-sm hover:text-blue-400 transition"
          >
            Terms & Conditions
          </Link>
        </div>

        {/* What We Offer */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm dark:text-white font-semibold">
            WE ALSO HAVE
          </h3>
          {[
            "Water Biking",
            "Biking Around the Lagoon",
            "Fish Feeding at the Lagoon",
            "Personalized Service",
          ].map((item, index) => (
            <span key={index} className="dark:text-white text-sm">
              {item}
            </span>
          ))}
        </div>

        {/* Address & Map */}
        <div className="flex flex-col gap-3 w-full lg:w-[300px]">
          <h3 className="text-sm dark:text-white font-semibold">ADDRESS</h3>
          <div className="flex items-center gap-3 dark:text-white text-sm">
            <icons.MdLocationPin className="text-blue-400 text-2xl border rounded-full border-blue-400 p-1" />
            Purok 1, Monbon, Irosin, Sorsogon, Philippines
          </div>
          <div className="w-full h-[200px] lg:h-[170px] mt-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d26179.83965467092!2d123.99829559379175!3d12.73582097005117!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a0c5a07d35032d%3A0x7b7a9ba5a4dbc734!2sNature%20Spring%20Resort%20%26%20Inn!5e0!3m2!1sen!2sph!4v1765699378697!5m2!1sen!2sph"
              width="100%"
              height="170"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col lg:flex-row justify-center items-center py-4 mt-6 bg-white dark:bg-black text-center">
        <span className="dark:text-white text-sm">
          © {currentYear}{" "}
          <span className="text-blue-400">Nature Hot Spring</span>. All rights
          reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
