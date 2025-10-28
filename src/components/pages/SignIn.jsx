import React, { useState, useEffect } from "react";
import { images } from "../../constant/image";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useFormSubmit from "../../hooks/useFormSubmit";
import Toaster from "../molecules/Toaster";
import useAuthStore from "../../store/authStore";

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    submit,
    loading,
    error: formError,
  } = useFormSubmit("/auth/signin.php", (response) => {
    const { setToken, setUser } = useAuthStore.getState();

    if (response?.success) {
      setToast({
        message: response.message || "Login successful!",
        type: "success",
      });

      // Save token and user in store
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
      }

      // Use backend redirect (safe)
      const redirectTo = response.redirect || "/";

      setTimeout(() => {
        navigate(redirectTo);
      }, 1500);
    } else {
      setToast({
        message: response?.message || "Login failed.",
        type: "error",
      });
      console.warn("⚠️ Login error:", response);
    }
  });

  useEffect(() => {
    if (formError) {
      setToast({
        message:
          typeof formError === "string"
            ? formError
            : formError?.message || "Login failed.",
        type: "error",
      });
    }
  }, [formError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setToast({ message: "Email and password are required.", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setToast({ message: "Invalid email format.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("action", "signin");

    submit(formData);
  };

  return (
    <>
      {toast && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main
        className="h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center overflow-hidden"
        style={{ backgroundImage: `url(${images.hero1})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[800px] h-full max-h-[500px] bg-white rounded-lg z-10 flex flex-row overflow-hidden"
        >
          {/* Left: Image and Info */}
          <section
            className="h-full w-1/2 bg-cover bg-center bg-no-repeat  justify-center items-center p-4  hidden md:hidden lg:flex"
            style={{ backgroundImage: `url(${images.signupbg})` }}
          >
            <figcaption className="h-full w-full flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold text-blue-400">
                Welcome back!
              </h3>
              <img
                src={images.logo}
                className="h-[230px] w-auto object-contain"
                alt="Logo"
              />
              <p className="text-center text-sm text-white">
                Sign in to access your account and manage your bookings.
              </p>
            </figcaption>
          </section>

          {/* Right: Form */}
          <section className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center p-4 dark: bg-gray-800">
            <h3 className="text-lg font-semibold mb-5 dark:text-gray-200 text-gray-700">
              Login to your account
            </h3>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-3"
            >
              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute right-2 top-[40px] cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <icons.IoEyeOffOutline />
                  ) : (
                    <icons.IoEyeOutline />
                  )}
                </span>
              </div>
              <Button
                type="submit"
                style="w-full h-[35px] bg-blue-400 text-sm font-medium rounded-lg text-white"
                label={loading ? "Signing in..." : "Sign In"}
                disabled={loading}
              />
            </form>

            <div className="mt-2 text-xs dark:text-gray-200 text-gray-700">
              Don’t have an account?
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-600 cursor-pointer font-medium ml-1 "
              >
                Sign Up
              </span>
            </div>
          </section>
        </motion.div>

        <icons.FiArrowLeftCircle
          className="text-2xl text-white cursor-pointer absolute top-8 left-8 z-20"
          onClick={() => navigate(-1)}
        />
      </main>
    </>
  );
}

export default SignIn;
