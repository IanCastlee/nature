import React, { useRef } from "react";
import { images } from "../../constant/image";
import { icons } from "../../constant/icon";
import { useInView, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Blur from "../molecules/Blur";
import ReadMoreButton from "../atoms/ReadMoreButton";
import SubtTitle from "../molecules/SubtTitle";

function About() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="w-full bg-white dark:bg-black relative overflow-hidden"
    >
      {/* ========================= */}
      {/* MOBILE + TABLET VERSION */}
      {/* ========================= */}
      <div className="block lg:hidden px-4 sm:px-8 py-12">
        <div className="flex justify-center sm:justify-start mb-4">
          <SubtTitle title="ABOUT US" hidden="hidden" />
        </div>

        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center sm:text-left">
          Welcome to{" "}
          <span className="text-blue-500 font-medium">
            2JKLA Nature Hot Spring Inn and Resort Corp
          </span>
          , your premier destination for relaxation, adventure, and
          unforgettable stays in the heart of Irosin, Sorsogon. Nestled in
          nature’s embrace, our resort blends comfort, luxury, and authentic
          experiences powered by natural hot springs.
        </p>

        {/* Centered on mobile, left on sm+ */}
        <div className="flex mt-6">
          <div className="mx-auto sm:mx-0">
            <ReadMoreButton
              label={
                <>
                  Read More{" "}
                  <icons.HiArrowSmallRight className="inline text-lg" />
                </>
              }
              onClick={() => navigate("/about")}
            />
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* DESKTOP VERSION (lg+)    */}
      {/* ========================= */}
      <div
        className="
          hidden lg:flex
          items-center justify-between
          gap-14
          px-28 py-20
          relative
        "
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-1/2 h-[320px] relative"
        >
          <LazyLoadImage
            src={images.aboutbg}
            alt="About Nature Hot Spring"
            effect="blur"
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </motion.div>

        {/* Text */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-1/2 flex flex-col gap-5"
        >
          <SubtTitle title="ABOUT US" hidden="hidden" />

          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to{" "}
            <span className="text-blue-400 font-medium">
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
                Read More <icons.HiArrowSmallRight className="inline text-lg" />
              </>
            }
            onClick={() => navigate("/about")}
          />
        </motion.article>

        {/* Ambient Blur Accent */}
        <Blur top="top-0" isReverse={false} blur="h-[160px] w-[160px]" />
      </div>
    </section>
  );
}

export default About;
