import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../../constant/image";
import Button from "../atoms/Button";
import useFormSubmit from "../../hooks/useFormSubmit";

export default function ResendVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // for errors
  const [successMessage, setSuccessMessage] = useState(""); // for success

  const {
    submit,
    loading,
    error: formError,
  } = useFormSubmit("/auth/resend_verification.php", (response) => {
    if (response.success) {
      setVerificationToken(response.verification_token); // save token
      setErrorMessage(""); // clear previous error
      setSuccessMessage(
        "✅ Verification email resent! Please check your inbox."
      ); // show success
    } else {
      setErrorMessage(response.message); // show error above form
      setSuccessMessage(""); // clear previous success
    }
  });

  const handleResend = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorMessage("Email is required.");
      setSuccessMessage("");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage(""); // clear error
    setSuccessMessage(""); // clear success
    submit({ email });
  };

  useEffect(() => {
    if (formError) setErrorMessage(formError.message);
  }, [formError]);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${images.hero1})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Resend Verification Email
        </h2>

        {/* Success message */}
        {successMessage && (
          <p className="text-green-600 mb-4 font-medium">{successMessage}</p>
        )}

        {/* Error message */}
        {errorMessage && (
          <p className="text-red-500 mb-4 font-medium">{errorMessage}</p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <Button
          label={loading ? "Sending..." : "Resend Email"}
          style="w-full bg-yellow-500 text-white rounded py-2 mb-2"
          onClick={handleResend}
          disabled={loading}
        />

        <Button
          label="Back to Sign In"
          style="w-full bg-blue-400 text-white rounded py-2 mt-4"
          onClick={() => navigate("/signin")}
        />
      </div>
    </div>
  );
}
