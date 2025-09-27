import React, { useEffect, useRef } from "react";
import { images } from "../../constant/image";
import { motion, useInView } from "framer-motion";
import Animation from "../molecules/Animation";
import Blur from "../molecules/Blur";
function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <main className="w-full bg-white dark:bg-black pb-20">
      <section className="w-full h-[270px] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.aboutbg})` }}
        ></div>

        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/50 blur-3xl opacity-40"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <div className="relative">
            <h1 className="text-white text-3xl font-semibold text-center">
              About{" "}
              <span className="text-blue-400 text-3xl font-semibold">
                Nature Hot Spring
              </span>
              <img
                src={images.line}
                className="absolute right-0 -bottom-[2px] w-[150px]"
                alt="decorative line"
              />
            </h1>
          </div>
          <p className="text-sm font-normal text-white mt-2">
            2JKLA Nature Hot Spring Inn and Resort Corp.
          </p>
        </div>
      </section>

      <section className="w-full sm:px-[10px] md:px-[10px] lg:px-[100px] flex flex-col py-[50px] space-y-6 gap-10">
        <article className="flex flex-col  md:flex-row lg:flex-row gap-4">
          <img
            src={images.aboutbg}
            alt="Resort entrance"
            className="h-[250px] object-cover w-[100%] rounded-lg"
          />
          <div className="w-[100%]  items-start relative">
            <Animation
              image={images.animationImg}
              title="About Us"
              isReverse={false}
            />
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

            <Blur top="top-0" isReverse={false} blur="h-[100px] w-[100px]" />
          </div>
        </article>

        <article className="flex flex-col md:flex-row-reverse lg:flex-row-reverse gap-4">
          <img
            src={images.aboutbg}
            alt="Hot spring pools"
            className="h-[250px] object-cover w-[100%] rounded-lg"
          />
          <div className="w-[100%] relative">
            <Animation
              image={images.animationImg}
              title="Our Mission"
              isReverse={true}
            />
            <p className="dark:text-white text-black leading-relaxed">
              At{" "}
              <span className="text-blue-400">
                2JKLA Nature Hot Spring Inn and Resort Corp
              </span>
              , every detail is designed to give you peace of mind. From our
              inviting hot spring pools to our well-appointed accommodations,
              you’ll experience a retreat where wellness, recreation, and
              relaxation meet.
            </p>
            <Blur top="top-0" isReverse={true} blur="h-[100px] w-[100px]" />
          </div>
        </article>

        <article className="flex flex-col md:flex-row lg:flex-row gap-4">
          <img
            src={images.aboutbg}
            alt="Resort entrance"
            className="h-[250px] object-cover w-[100%] rounded-lg"
          />
          <div className="w-[100%]  items-start relative">
            <Animation
              image={images.animationImg}
              title="Our Promise"
              isReverse={false}
            />
            <p className="dark:text-white text-black leading-relaxed">
              Whether you're seeking a romantic retreat, a family adventure, or
              solo serenity, we promise a rejuvenating experience for your body,
              mind, and soul. At 2JKLA, you're not just a guest — you're family.
            </p>
            <Blur top="top-0" isReverse={false} blur="h-[100px] w-[100px]" />
          </div>
        </article>
      </section>
    </main>
  );
}

export default AboutPage;
