import React, { useEffect, useState } from "react";
import { images } from "../../constant/image";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { icons } from "../../constant/icon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useFormSubmit from "../../hooks/useFormSubmit";
import Toaster from "../molecules/Toaster";

function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Show/Hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState("");

  const [verified, setVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);

  // Form state
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    cpassword: "",
  });

  // Poll for email verification status when on step 3 and token is set
  useEffect(() => {
    if (step === 3 && verificationToken) {
      const interval = setInterval(() => {
        fetch(`/auth/verify.php?token=${verificationToken}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setVerified(true);
              setToast({ message: "Successfully verified!", type: "success" });
              clearInterval(interval);
            }
          })
          .catch(console.error);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [step, verificationToken]);

  const {
    submit,
    loading,
    error: formError,
  } = useFormSubmit("/auth/signup.php", (response) => {
    if (response.success) {
      setVerificationToken(response.verification_token); // <-- Save the token here
      setToast({
        message: `Please verify your email: ${response.email}`,
        type: "success",
      });
      setStep(3); // Move to verification step
    }
  });

  useEffect(() => {
    if (formError) {
      setToast({
        message:
          typeof formError === "string"
            ? formError
            : formError?.message || "Something went wrong",
        type: "error",
      });
    }
  }, [formError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 1) setPasswordStrength("Weak");
    else if (strength === 2 || strength === 3) setPasswordStrength("Medium");
    else if (strength === 4) setPasswordStrength("Strong");
    else setPasswordStrength("");
  };

  const handleNext = () => {
    if (!form.firstname || !form.lastname || !form.phone || !form.address) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(form.phone)) {
      setToast({ message: "Invalid phone number", type: "error" });
      return;
    }

    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!termsAgreed) {
      setToast({
        message: "You must agree to the Terms and Conditions",
        type: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setToast({ message: "Invalid email address", type: "error" });
      return;
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setToast({ message: "Password too weak", type: "error" });
      return;
    }

    if (form.password !== form.cpassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("firstname", form.firstname);
    formData.append("lastname", form.lastname);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("action", "signup");

    submit(formData);
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "bg-red-500";
    if (passwordStrength === "Medium") return "bg-yellow-500";
    if (passwordStrength === "Strong") return "bg-green-500";
    return "bg-gray-300";
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
          {/* Left side */}
          <section
            className="h-full w-1/2 bg-cover bg-center bg-no-repeat justify-center items-center p-4 hidden md:hidden lg:flex"
            style={{ backgroundImage: `url(${images.signupbg})` }}
          >
            <figcaption className="h-full w-full flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold text-blue-400">
                Welcome to
              </h3>
              <img
                src={images.logo}
                className="h-[230px] w-auto object-contain"
                alt="Logo"
              />
              <p className="text-center text-sm text-white">
                Start your journey with us. Please sign up to continue.
              </p>
            </figcaption>
          </section>

          {/* Right side */}
          <section className="lg:w-1/2 w-full h-full flex flex-col justify-center items-center p-4 dark:bg-gray-800">
            {step !== 3 && (
              <h3 className="text-lg font-semibold mb-5 dark:text-gray-200 text-gray-700">
                Create your account
              </h3>
            )}

            <form
              onSubmit={(e) =>
                step === 1
                  ? (e.preventDefault(), handleNext())
                  : handleSubmit(e)
              }
              className="w-full flex flex-col gap-3"
            >
              {step === 1 && (
                <>
                  <div className="flex flex-row gap-1">
                    <Input
                      label="Firstname"
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                    />
                    <Input
                      label="Lastname"
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    style="w-full h-[35px] bg-blue-400 text-white rounded"
                    label="Next"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <Input
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />

                  {/* Password */}
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

                  {/* Password strength bar */}
                  {form.password && (
                    <div className="h-1 w-full bg-gray-200 rounded mt-1">
                      <div
                        className={`h-1 rounded ${getStrengthColor()}`}
                        style={{
                          width:
                            passwordStrength === "Weak"
                              ? "33%"
                              : passwordStrength === "Medium"
                              ? "66%"
                              : "100%",
                        }}
                      ></div>
                    </div>
                  )}
                  {form.password && (
                    <span className="text-xs text-gray-600 mt-1">
                      Strength: {passwordStrength}
                    </span>
                  )}

                  {/* Confirm password */}
                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      name="cpassword"
                      type={showCPassword ? "text" : "password"}
                      value={form.cpassword}
                      onChange={handleChange}
                    />
                    <span
                      className="absolute right-2 top-[40px] cursor-pointer text-gray-500"
                      onClick={() => setShowCPassword((prev) => !prev)}
                    >
                      {showCPassword ? (
                        <icons.IoEyeOffOutline />
                      ) : (
                        <icons.IoEyeOutline />
                      )}
                    </span>
                  </div>

                  {/* Terms */}
                  <div className="flex items-center gap-2 text-xs mt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                    />
                    <label htmlFor="terms">
                      <span className="dark:text-gray-200 text-gray-700">
                        I agree to the{" "}
                      </span>
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => navigate("/terms")}
                      >
                        Terms and Conditions
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    style="w-full h-[35px] bg-blue-400 text-white rounded mt-2"
                    label={loading ? "Signing up..." : "Sign Up"}
                    disabled={loading}
                  />
                </>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center justify-center gap-3 text-center p-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Email Verification
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We have sent a verification link to{" "}
                    <strong>{form.email}</strong>.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Please check your inbox and click the link to verify your
                    email.
                  </p>

                  {verified && (
                    <p className="text-green-600 font-semibold mt-2">
                      ✅ Successfully verified!
                    </p>
                  )}

                  <Button
                    label="Back to Sign In"
                    style="mt-4 w-full bg-blue-400 text-white rounded"
                    onClick={() => navigate("/signin")}
                  />
                </div>
              )}
            </form>

            <div className="mt-2 text-xs dark:text-gray-200 text-gray-700">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/signin")}
                className="text-blue-600 cursor-pointer font-medium ml-1"
              >
                Sign In
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

export default SignUp;
