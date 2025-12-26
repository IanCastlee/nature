import React from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { Link } from "react-router-dom";
import useGetData from "../../hooks/useGetData";

function Footer() {
  const currentYear = new Date().getFullYear();
  // fetch data
  const { data } = useGetData(`/admin/admin_setting.php`);

  if (!data) return null;

  function formatPhone(num) {
    if (!num) return "";
    return num.startsWith("0") ? `+63${num.slice(1)}` : num;
  }
  const iconWrapper =
    "w-7 h-7 flex items-center  justify-center rounded-full border border-blue-400 text-blue-400";

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
        <div className="flex flex-col gap-2">
          <h3 className="text-sm dark:text-white font-semibold">CONTACTS</h3>

          {/* FB Messenger */}
          <a
            href={data?.fb}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
          >
            <span className={iconWrapper}>
              <icons.FaFacebookMessenger className="text-sm" />
            </span>
            <span className="text-blue-400 text-sm group-hover:translate-x-0.5 transition">
              Messenger
            </span>
          </a>

          {/* Smart */}
          <a
            href={`tel:${formatPhone(data?.smart_no)}`}
            className="group flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
          >
            <span className={iconWrapper}>
              <icons.FaPhoneAlt className="text-[11px]" />
            </span>
            <span className="dark:text-white text-sm group-hover:translate-x-0.5 transition">
              Smart: {data?.smart_no}
            </span>
          </a>

          {/* Globe */}
          <a
            href={`tel:${formatPhone(data?.globe_no)}`}
            className="group flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
          >
            <span className={iconWrapper}>
              <icons.FaPhoneAlt className="text-[11px]" />
            </span>
            <span className="dark:text-white text-sm group-hover:translate-x-0.5 transition">
              Globe: {data?.globe_no}
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${data?.email}`}
            className="group flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-800 transition"
          >
            <span className={iconWrapper}>
              <icons.IoIosMail className="text-[11px]" />
            </span>
            <span className="text-blue-400 text-sm break-all group-hover:translate-x-0.5 transition">
              {data?.email}
            </span>
          </a>
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
            About Us
          </Link>
          <Link
            to="/contact"
            className="dark:text-white text-sm hover:text-blue-400 transition"
          >
            Contacts
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
