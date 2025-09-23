import React, { useRef } from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { motion, useInView } from "framer-motion";
import { useNavigate, useRoutes } from "react-router-dom";
import Animation from "../molecules/Animation";
import Blur from "../molecules/Blur";
function About() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="flex flex-col md:flex-row items-start justify-between gap-8 px-2 lg:px-[100px] md:px-2 py-16 dark:bg-black relative">
      <div className="w-full h-[200px] lg:h-[270px] md:h-[250px] md:w-1/2 ">
        <img
          src={images.aboutbg}
          alt="About us"
          className="w-full h-full  lg:rounded-lg md:rounded-none shadow-md object-cover "
        />
      </div>

      <article className="w-full md:w-1/2">
        <Animation
          image={images.animationImg}
          title="About Us"
          isReverse={false}
        />

        <p className="text-sm text-gray-700 mb-4 leading-relaxed dark:text-white">
          Welcome to
          <span className="text-blue-400">2JKLA Nature Hot Spring</span> Inn and
          Resort Corp., your premier destination for relaxation, adventure, and
          unforgettable stays in the heart of Irosin, Sorsogon. Nestled in
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
