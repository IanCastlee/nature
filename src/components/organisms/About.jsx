import React, { useRef } from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { motion } from "framer-motion";
import Blur from "../molecules/Blur";
import ReadMoreButton from "../atoms/ReadMoreButton";
import SubtTitle from "../molecules/SubtTitle";

function About() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="w-full dark:bg-black relative">
      {/* ----------------------------- */}
      {/* MOBILE + TABLET VERSION ONLY  */}
      {/* ----------------------------- */}
      <div className="block lg:hidden px-4 py-10 md:px-10">
        <div className="flex justify-center md:justify-start mb-4">
          <SubtTitle title="ABOUT US" hidden="hidden" />
        </div>

        <p className="dark:text-white text-black leading-relaxed text-center md:text-left">
          Welcome to{" "}
          <span className="text-blue-700">
            2JKLA Nature Hot Spring Inn and Resort Corp
          </span>
          , your premier destination for relaxation, adventure, and
          unforgettable stays in the heart of Irosin, Sorsogon. Nestled in
          nature’s embrace, our resort blends comfort, luxury, and authentic
          experiences powered by natural hot springs.
        </p>

        <div className="flex justify-center md:justify-start mt-4">
          <ReadMoreButton
            label={
              <>
                Read More <icons.HiArrowSmallRight className="inline" />
              </>
            }
            onClick={() => navigate("/about")}
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* DESKTOP VERSION (lg+)         */}
      {/* ----------------------------- */}
      <div
        className="
          hidden lg:flex
          flex-row items-start justify-between 
          gap-10 
          px-28 py-16 
          relative
        "
      >
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/2 h-[300px]"
        >
          <LazyLoadImage
            src={images.aboutbg}
            alt="About us"
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover rounded-md"
          />
        </motion.div>

        {/* Text Section */}
        <motion.article
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/2 flex flex-col gap-4"
        >
          <div className="flex justify-start">
            <SubtTitle title="ABOUT US" hidden="hidden" />
          </div>

          <p className="dark:text-white text-black leading-relaxed">
            Welcome to{" "}
            <span className="text-blue-400">
              2JKLA Nature Hot Spring Inn and Resort Corp
            </span>
            , your premier destination for relaxation, adventure, and
            unforgettable stays in the heart of Irosin, Sorsogon. Nestled in
            nature’s embrace, our resort blends comfort, luxury, and authentic
            experiences powered by natural hot springs.
          </p>

          <ReadMoreButton
            label={
              <>
                Read More{" "}
                <icons.HiArrowSmallRight className="text-white inline" />
              </>
            }
            onClick={() => navigate("/about")}
          />
        </motion.article>

        <Blur top="top-0" isReverse={false} blur="h-[150px] w-[150px]" />
      </div>
    </section>
  );
}

export default About;
