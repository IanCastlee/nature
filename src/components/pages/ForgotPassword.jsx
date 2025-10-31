import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { motion } from "framer-motion";
import useFormSubmit from "../../hooks/useFormSubmit";

function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });
  const [message, setMessage] = useState(null); // message shown in form
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!form.email.trim()) {
      setMessage("Email is required.");
      setMessageType("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage("Invalid email format.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    const body = JSON.stringify({ email: form.email });

    try {
      const res = await fetch(
        "http://localhost/nature-hs-r/backend/auth/forgot_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server.");
      }

      setMessage(data.message);
      setMessageType(data.success ? "success" : "error");
    } catch (err) {
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <section className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center p-4 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-5 text-gray-700 dark:text-gray-200">
            Reset your password
          </h3>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {message && (
              <div
                className={`mb-2 p-2 text-xs rounded text-center dark:bg-gray-800 ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

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

          <div className="mt-4 text-xs text-gray-700 dark:text-gray-200">
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
  );
}

export default ForgotPassword;
