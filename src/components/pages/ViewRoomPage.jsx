import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import dummyImage from "../../assets/dummyImages/rooma.jpg";
import { icons } from "../../constant/icon";
import HouseRules from "../organisms/HouseRules";
import { useState } from "react";
function ViewRoomPage() {
  const [showHouseRules, setShowHouseRules] = useState(false);
  return (
    <>
      <main className="min-h-screen w-full dark:bg-black pb-20">
        <section className="w-full flex flex-row gap-1  h-[450px]">
          <div className="w-[60%] h-full">
            <LazyLoadImage
              src={dummyImage}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-[40%] h-full justify-between">
            <LazyLoadImage
              src={dummyImage}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full h-[49%]"
              className="w-full h-full object-cover"
            />
            <LazyLoadImage
              src={dummyImage}
              alt="Project image"
              effect="blur"
              wrapperClassName="w-full  h-[50%]"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="w-full px-[130px] mt-4">
          <div className="w-full flex flex-row  justify-between items-center gap-20">
            <div className="flex flex-row items-center gap-20">
              <div>
                <h3 className="dark:text-white text-3xl ">Room A</h3>
                <p className="text-blue-400 text-lg font-medium flex flex-row items-center">
                  <icons.IoPricetagsOutline className="mr-1 text-lg" /> P
                  2,300.00 / Night
                </p>
              </div>

              <icons.FaStreetView
                title="View Room"
                className="text-[40px] text-blue-400 cursor-pointer transform transition-transform duration-300 hover:scale-125"
              />
            </div>

            <button
              onClick={() => setShowHouseRules(true)}
              className="dark:bg-transparent bg-gray-900 dark:border-blue-400 border border-gray-700 
  text-white dark:text-blue-400 py-1 px-2 rounded-lg text-sm 
  flex flex-row items-center gap-2 transition-all duration-300 
  hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900"
            >
              <icons.GrNotes className="text-sm" />
              View House Rules
            </button>
          </div>

          <div className=" flex flex-flex-row flex-wrap justify-start gap-5">
            <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700 ">
              <icons.LuUsers className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
              2 Person
            </span>

            <span className="inline-flex items-center text-sm dark:text-gray-100 text-gray-700">
              <icons.IoIosTimer className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
              Duration: 22 hrs
            </span>
          </div>
        </section>
        <section className="w-full flex flex-row justify-between px-[130px]">
          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="dark:text-gray-100 text-gray-700 text-lg font-medium mb-2">
              Amenities
            </h3>
            <div className="w-3/4 flex flex-col gap-4 ">
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm ">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Free Wifi
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Air-Conditioning
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Private Bathroom
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Flowing Hot Water
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                TV
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                1 Mini Pool
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                1 Queen Sized Bed
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                4 Pillows
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                2 Blankets
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                2 Towels
              </span>
            </div>
          </div>

          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="dark:text-gray-100 text-gray-700 text-lg font-medium mb-2">
              Room Inclusions
            </h3>
            <div className="w-3/4 flex flex-col gap-4">
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm ">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                2 Complimentary Breakfast
              </span>

              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Liquid Soap
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Shampoo
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Towels
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Toothbrush and Toothpaste
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Toiletries
              </span>
            </div>
          </div>

          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="dark:text-gray-100 text-gray-700 text-lg font-medium mb-2">
              Extras
            </h3>
            <div className="w-3/4 flex flex-col gap-4">
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm ">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Extra Person: 318.00 (2 yrs old above)
              </span>

              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Extra Towel: 106.00
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Extra Bed: 530.00
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Extra Pillow: 106.00
              </span>
              <span className=" dark:text-gray-100 text-gray-700 inline-flex items-center text-sm">
                <icons.FaChevronCircleRight className="mr-1 text-blue-400 dark:text-blue-400" />{" "}
                Extra Blanket: 106.00
              </span>
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col px-[130px] mt-4">
          <div className="w-full border-t dark:border-gray-800 mt-4 pt-4">
            <h3 className="dark:text-gray-100 text-gray-700 text-lg font-medium mb-2">
              Description
            </h3>
            <p className="dark:text-white text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis
              quasi distinctio possimus pariatur dolorem. Iste vero, dicta,
              aperiam quidem dolore distinctio excepturi repellat laboriosam ea,
              voluptates eum ipsum magni incidunt quibusdam numquam? Optio
              aperiam quisquam aspernatur totam commodi vero, suscipit tempora
              id. Minima veritatis, optio veniam beatae pariatur, sapiente eum
              quam quidem eveniet, cupiditate perspiciatis? Corporis laboriosam
              neque cupiditate quam! Adipisci mollitia ullam veritatis dolores
              qui quo id debitis! Dolore consequuntur unde repellat eveniet,
              explicabo inventore alias perspiciatis dolor dolorum, dolorem
              debitis. Aliquid et, illo soluta ullam id dicta voluptate
              excepturi? Deleniti aliquam, laborum quam hic unde quasi
              reiciendis, non temporibus incidunt provident numquam. Eos dicta
              libero nihil accusantium autem. Deleniti veritatis error ad velit,
              dolore eligendi repellat autem impedit natus, et sunt illo itaque
              dolor aperiam debitis quasi qui adipisci facere temporibus.
              Quibusdam ducimus, vel, excepturi neque quaerat nisi assumenda
              nesciunt itaque temporibus praesentium, esse placeat nam hic
              consequatur.
            </p>
          </div>
        </section>
      </main>

      {showHouseRules && <HouseRules close={() => setShowHouseRules(false)} />}
    </>
  );
}

export default ViewRoomPage;
