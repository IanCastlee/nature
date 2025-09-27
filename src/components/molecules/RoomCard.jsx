import React, { memo } from "react";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { icons } from "../../constant/icon";
import { useNavigate } from "react-router-dom";
function RoomCard() {
  const navigate = useNavigate();
  return (
    <>
      <article className="w-full  md:basis-[calc(50%-0.3rem)] lg:basis-[calc(33.333%-0.5rem)] mb-2  bg-white dark:bg-gray-950 dark:border border-gray-900 rounded-lg shadow-md overflow-hidden">
        <LazyLoadImage
          src={dummyImage}
          alt="Project image"
          effect="blur"
          wrapperClassName="w-full h-48"
          className="w-full h-full object-cover"
        />

        <div className="p-4">
          <div className="w-full flex flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                Room A
              </h2>
              <p className="text-blue-400 text-sm font-medium">
                P 2,300.00 / Night
              </p>
            </div>

            <icons.FaStreetView
              title="View Room"
              className="text-2xl text-blue-600 cursor-pointer transform transition-transform duration-300 hover:scale-125"
            />
          </div>

          <div className="border-t dark:border-gray-800 mt-4 flex flex-flex-row flex-wrap justify-center pt-4 gap-5">
            <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 ">
              <icons.LuUsers className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
              2 Person
            </span>

            <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700">
              <icons.IoIosTimer className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
              Duration: 22 hrs
            </span>
          </div>

          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="dark:text-gray-100 text-gray-700 text-sm font-medium mb-2">
              Extras
            </h3>
            <div className="w-full flex flex-row  flex-wrap gap-5">
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-[13px] ">
                <icons.AiOutlineUserAdd className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                Extra Person: 318.00 (2 yrs old above)
              </span>

              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-[13px]">
                <icons.PiTowel className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                Extra Towel: 106.00
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-[13px]">
                <icons.IoBedOutline className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                Extra Bed: 530.00
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-[13px]">
                <icons.HiOutlineRectangleStack className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                Extra Pillow: 106.00
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-[13px]">
                <icons.BiBlanket className="mr-1 text-blue-600 dark:text-blue-400" />{" "}
                Extra Blanket: 106.00
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-end  mt-8">
            <button
              onClick={() => navigate("/room-deatails/1")}
              className="group relative flex flex-row items-center text-blue-500 text-sm font-medium rounded-sm h-[30px] self-end ml-auto transition-colors duration-300 hover:text-blue-400"
            >
              <span
                className="relative before:content-[''] before:absolute before:bottom-0 before:left-1/2 
    before:translate-x-[-50%] before:h-[2px] before:w-0 
    before:bg-blue-400 before:transition-all before:duration-300 
    group-hover:before:w-full"
              >
                More Details
              </span>
              <icons.FiArrowUpRight className="ml-1 text-blue-600 text-lg font-bold" />
            </button>
          </div>
        </div>
      </article>
    </>
  );
}

export default memo(RoomCard);
