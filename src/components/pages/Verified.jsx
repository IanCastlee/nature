import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { images } from "../../constant/image";
import Button from "../atoms/Button";

export default function Verified() {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL query params (status, msg)
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const msg = params.get("msg");

  const isSuccess = status === "success";

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${images.hero1})` }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2
          className={`text-2xl font-semibold mb-4 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess
            ? "✅ Email Verified Successfully!"
            : "❌ Verification Failed"}
        </h2>

        <p className="text-gray-700 mb-6">
          {msg
            ? decodeURIComponent(msg)
            : isSuccess
            ? "Thank you for verifying your email. You can now sign in to your account."
            : "The verification link is invalid or expired."}
        </p>

        {isSuccess ? (
          <Button
            label="Go to Sign In"
            style="w-full bg-blue-400 text-white rounded py-2"
            onClick={() => navigate("/signin")}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <Button
              label="Resend Verification Email"
              style="w-full bg-yellow-500 text-white rounded py-2"
              onClick={() => navigate("/resend-verification")}
            />
            <Button
              label="Back to Sign Up"
              style="w-full bg-red-500 text-white rounded py-2"
              onClick={() => navigate("/signup")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
