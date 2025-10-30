import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import useFormSubmit from "../../hooks/useFormSubmit";
import Toaster from "../molecules/Toaster";

function ResetPassword() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [toast, setToast] = useState(null);

  const { submit, loading } = useFormSubmit(
    "/auth/reset_password.php",
    (response) => {
      if (response.success) {
        setToast({ message: response.message, type: "success" });
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setToast({
          message: response.message || "Reset failed.",
          type: "error",
        });
      }
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      setToast({ message: "Both fields are required.", type: "error" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", form.password);

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

      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <form
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>

          <Input
            label="New Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <Button
            type="submit"
            label={loading ? "Resetting..." : "Reset Password"}
            style="w-full mt-4 bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
