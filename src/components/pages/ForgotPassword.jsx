import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { motion } from "framer-motion";
import useFormSubmit from "../../hooks/useFormSubmit";
import Toaster from "../molecules/Toaster";

function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [toast, setToast] = useState(null);

  const {
    submit,
    loading,
    error: formError,
  } = useFormSubmit("/auth/forgot_password.php", (response) => {
    if (response?.success) {
      setToast({
        message: response.message || "Check your email for the reset link!",
        type: "success",
      });

      setTimeout(() => navigate("/signin"), 2000); // redirect to sign in
    } else {
      setToast({
        message: response?.message || "Failed to send reset link.",
        type: "error",
      });
    }
  });

  useEffect(() => {
    if (formError) {
      setToast({
        message:
          typeof formError === "string"
            ? formError
            : formError?.message || "Something went wrong.",
        type: "error",
      });
    }
  }, [formError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  console.log("____", form.email);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.email.trim() === "") {
      // <-- call trim()
      setToast({ message: "Email is required.", type: "error" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setToast({ message: "Invalid email format.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("email", form.email);

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
        className="h-screen w-full bg-cover bg-center flex justify-center items-center overflow-hidden"
        style={{ backgroundImage: `url(${images.hero1})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[800px] h-full max-h-[400px] bg-white rounded-lg flex flex-row overflow-hidden"
        >
          {/* Left side image */}
          <section
            className="h-full w-1/2 bg-cover bg-center hidden lg:flex justify-center items-center p-4"
            style={{ backgroundImage: `url(${images.signupbg})` }}
          >
            <figcaption className="h-full w-full flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold text-blue-400">
                Forgot Password?
              </h3>
              <img
                src={images.logo}
                className="h-[230px] w-auto object-contain"
                alt="Logo"
              />
              <p className="text-center text-sm text-white">
                Enter your email to receive a password reset link.
              </p>
            </figcaption>
          </section>

          {/* Right side form */}
          <section className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center p-4">
            <h3 className="text-lg font-semibold mb-5 text-gray-700">
              Reset your password
            </h3>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-3"
            >
              <Input
                label="Email"
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
              />

              <Button
                type="submit"
                style="w-full h-[35px] bg-blue-400 text-sm font-medium rounded-lg text-white"
                label={loading ? "Sending..." : "Send Reset Link"}
                disabled={loading}
              />
            </form>

            <div className="mt-4 text-xs text-gray-700">
              Remember your password?
              <span
                onClick={() => navigate("/signin")}
                className="text-blue-600 cursor-pointer font-medium ml-1"
              >
                Sign In
              </span>
            </div>
          </section>
        </motion.div>
      </main>
    </>
  );
}

export default ForgotPassword;
