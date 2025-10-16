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

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const {
    submit,
    loading,
    error: formError,
  } = useFormSubmit("/auth/signup.php", () => {
    setToast({ message: "Account created successfully!", type: "success" });
    setTimeout(() => navigate("/signin"), 2000);
  });

  // Show error toast if formError changes
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

  //handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          <section
            className="h-full w-1/2 bg-cover bg-center bg-no-repeat flex justify-center items-center p-4"
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

          <section className="w-1/2 h-full flex flex-col justify-center items-center p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-5">Create your account</h3>

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
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <Input
                    label="Confirm Password"
                    name="cpassword"
                    type="password"
                    value={form.cpassword}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    style="w-full h-[35px] bg-blue-400 text-white rounded"
                    label={loading ? "Signing up..." : "Sign Up"}
                    disabled={loading}
                  />
                </>
              )}
            </form>

            <div className="mt-2 text-xs">
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
          onClick={() => navigate("/")}
        />
      </main>
    </>
  );
}

export default SignUp;
