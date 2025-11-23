import React from "react";
import { useNavigate } from "react-router-dom";

function Note({ onContinue }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Important Notice
        </h2>
        <p className="text-gray-600 mb-6">
          You are not signed in. If you continue without signing in, your
          booking will be processed, but you will not have a copy of it in your
          account and you will not receive any notifications about it.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            I Understand, Continue
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
