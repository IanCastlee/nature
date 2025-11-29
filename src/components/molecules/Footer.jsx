import React from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { Link } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
function Footer() {
  const currentYear = new Date().getFullYear();

  // fetch fh data
  const { data, loading, refetch, error } = useGetData(
    `/admin/admin_setting.php`
  );

  console.log("DATA : ", data);

  return (
    <footer className="w-full bg-slate-50 dark:bg-gray-950 border-t-[1px] dark:border-gray-900">
      <div className="flex flex-row lg:flex-row justify-between  px-2 md:px-4 lg:px-[100px] py-6 flex-wrap">
        <div className="h-[200px] lg:h-auto max-w-[60%] lg:max-w-[100%]">
          <img
            src={images.logo}
            alt="Nature Hot Spring Logo"
            className=" w-[100%] lg:w-[220px] h-[100%] lg:h-[220px] object-contain mb-0 lg:-mb-14"
          />
        </div>

        <div className="flex flex-col gap-2 max-w-[100%] mb-6 lg:mb-0">
          <h3 className="text-sm dark:text-white font-semibold mb-2">
            CONTACTS
          </h3>

          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            <icons.IoIosMail className="text-blue-400 text-2xl border rounded-full border-blue-400 p-[2px]" />
            {data?.email}
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            <icons.FaPhoneAlt className="text-blue-400 text-2xl border rounded-full border-blue-400 p-[2px]" />
            Smart : {data?.smart_no}
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            <icons.FaPhoneAlt className="text-blue-400 text-2xl border rounded-full border-blue-400 p-[2px]" />
            Globe : {data?.globe_no}
          </Link>
        </div>

        <div className="flex flex-col gap-2 max-w-[100%] mb-6 lg:mb-0">
          <h3 className="text-sm dark:text-white font-semibold mb-2">
            QUICK LINKS
          </h3>

          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Home
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            About
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Contact
          </Link>
        </div>

        <div className="flex flex-col gap-2 max-w-[100%] mb-6 lg:mb-0">
          <h3 className="text-sm dark:text-white font-semibold mb-2">
            WHAT WE OFFER
          </h3>

          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Comfortable Accommodations
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Natural Hot Springs
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Water Biking
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Biking Around the Lagoon
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Fish Feeding at the Lagoon
          </Link>
          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            Personalized Service
          </Link>
        </div>

        <div className="flex flex-col gap-2 max-w-[100%] mb-6 lg:mb-0">
          <h3 className="text-sm dark:text-white font-semibold mb-2">
            ADDRESS
          </h3>

          <Link className="dark:text-white text-sm flex flex-row items-center gap-3">
            <icons.MdLocationPin className="text-blue-400 text-2xl border rounded-full border-blue-400 p-[2px]" />
            Purok 1 ,Monbon, Irosin, Sorsogon, Philippines
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center py-4 mt-10 bg-white dark:bg-black">
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
