import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { images } from "../../constant/image"; // import your images

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [message, setMessage] = useState(null); // Message displayed in form
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Show/hide password toggle

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      setMessageType("error");
      return;
    }

    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (!token) {
      setMessage("Invalid or missing token.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", form.password);

    try {
      const res = await fetch(
        "http://localhost/nature-hs-r/backend/auth/reset_password.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await res.text(); // parse as text first
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON response from server.");
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
      className="h-screen w-full bg-cover bg-center flex items-center justify-center dark:bg-gray-800"
      style={{ backgroundImage: `url(${images.hero1})` }} // same bg as ForgotPassword
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-6 text-center dark:text-gray-200">
          Reset Password
        </h2>

        {message && (
          <div
            className={`mb-4 p-2 text-xs rounded text-center ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {messageType !== "success" && (
          <>
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              name="confirm"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label
                htmlFor="showPassword"
                className="text-xs mt-1 text-gray-700 dark:text-gray-300"
              >
                Show Password
              </label>
            </div>

            <Button
              type="submit"
              label={loading ? "Resetting..." : "Reset Password"}
              style="w-full h-[35px] bg-blue-500 text-white rounded-lg mt-2"
              disabled={loading}
            />
          </>
        )}

        {messageType === "success" && (
          <Button
            type="button"
            label="Go to Sign In"
            style="w-full h-[35px] bg-green-500 text-white rounded-lg mt-2"
            onClick={() => navigate("/signin")}
          />
        )}
      </form>
    </main>
  );
}

export default ResetPassword;
