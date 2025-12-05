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
import Title from "../molecules/Title";
function About() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="flex flex-col md:flex-row items-start justify-between gap-8 px-2 lg:px-[130px] md:px-2 lg:py-16 dark:bg-black relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block w-full h-[200px] lg:h-[270px] md:h-[250px] md:w-1/2"
      >
        <LazyLoadImage
          src={images.aboutbg}
          alt="About us"
          effect="blur"
          wrapperClassName="w-full h-full"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.article
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2"
      >
        <div className="flex flex-col lg:justify-start md:justify-start justify-center items-center ">
          <SubtTitle title="ABOUT US" hidden="hidden" />
        </div>
        <p className="dark:text-white text-black leading-relaxed">
          Welcome to{" "}
          <span className="text-blue-400">
            2JKLA Nature Hot Spring Inn and Resort Corp
          </span>
          , your premier destination for relaxation, adventure, and
          unforgettable stays in the heart of Irosin, Sorsogon. Nestled in
          nature’s embrace, our resort offers a harmonious blend of comfort,
          luxury, and authentic experiences powered by natural hot springs.
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
    </section>
  );
}

export default About;
