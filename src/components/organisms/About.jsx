import React, { useRef } from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Blur from "../molecules/Blur";
function About() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="flex flex-col md:flex-row items-start justify-between gap-8 px-2 lg:px-[130px] md:px-2 py-16 dark:bg-black relative">
      <div className="w-full h-[200px] lg:h-[270px] md:h-[250px] md:w-1/2 ">
        <LazyLoadImage
          src={images.aboutbg}
          alt="About us"
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover"
        />
      </div>

      <article className="w-full md:w-1/2">
        <div className="flex flex-row justify-start items-center gap-2">
          <span className="text-blue-400 font-medium text-sm md:text-sm lg:text-lg">
            ABOUT US
          </span>
          <div className="h-[1px] w-[50px] bg-blue-400"></div>
        </div>

        <p className="text-sm text-gray-700 mb-4 leading-relaxed dark:text-white">
          Welcome to{" "}
          <span className="text-blue-400"> 2JKLA Nature Hot Spring</span> Inn
          and Resort Corp., your premier destination for relaxation, adventure,
          and unforgettable stays in the heart of Irosin, Sorsogon. Nestled in
          nature’s embrace, our resort offers a harmonious blend of comfort,
          luxury, and authentic experiences powered by natural hot springs.
        </p>

        <button
          onClick={() => navigate("/about")}
          className="flex flex-row dark:border dark:border-blue-400  bg-black items-center text-white text-sm font-medium rounded-sm h-[30px] px-2 self-end ml-auto hover:bg-gray-800 mt-auto "
        >
          Read More <icons.HiArrowSmallRight className="text-white" />
        </button>
      </article>

      <Blur top="top-0" isReverse={false} blur="h-[150px] w-[150px]" />
    </section>
  );
}

export default About;
