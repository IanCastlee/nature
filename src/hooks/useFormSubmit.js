import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function useFormSubmit(url, onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (formData, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.post(url, formData, options);

      // ❗ Backend-controlled failure (even if HTTP 200)
      if (res.data?.success === false) {
        throw new Error(res.data.message);
      }

      onSuccess?.(res.data);
      return res.data;
    } catch (err) {
      // ✅ ALWAYS prefer backend message
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Something went wrong during submissioggn.";

      setError(message);

      // ⛔ throw ONLY a clean Error
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}

export default useFormSubmit;
