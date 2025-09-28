import React from "react";
import { images } from "../../constant/image";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
function SignIn() {
  const navigate = useNavigate();
  return (
    <main
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center overflow-hidden "
      style={{ backgroundImage: `url(${images.hero1})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[800px] h-full max-h-[500px] bg-white rounded-lg z-10 flex flex-row overflow-hidden"
      >
        <section
          className=" h-full w-1/2 bg-cover bg-center bg-no-repeat flex justify-center items-center p-4"
          style={{ backgroundImage: `url(${images.signupbg})` }}
        >
          <figcaption className="h-full w-full flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold  text-blue-400">
              Welcome to
            </h3>
            <img
              src={images.logo}
              className="h-[230px] w-auto object-contain"
              alt="Nature Hot Spring Logo"
            />
            <p className="text-center text-sm  text-white">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veniam
              obcaecati quo, vero vel quas cumque qui soluta sequi a voluptates?
            </p>
          </figcaption>
        </section>
        <section className="w-1/2 h-full flex flex-col justify-center items-center p-4">
          <h3 className="text-lg font-semibold mb-5">Login to your account</h3>

          <form action="" className="w-full flex flex-col  gap-3">
            <Input />
            <Input />

            <Button
              style="w-full h-[35px] bg-blue-400 text-sm font-medium rounded-lg text-white"
              label="Sign In"
              placeholder="Sign In"
            />
          </form>
          <div className="mt-2">
            <p className="text-xs">
              Don't have an account?
              <span
                onClick={() => navigate("/signup")}
                className="text-xs text-blue-400 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>
        </section>
      </motion.div>

      <icons.FiArrowLeftCircle
        className="text-2xl text-white cursor-pointer absolute top-8 left-8 z-20"
        onClick={() => navigate("/")}
      />
    </main>
  );
}

export default SignIn;
