import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

function useFormSubmit(url, onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.post(url, formData);

      if (res.data.success) {
        onSuccess?.(res.data);
      } else {
        throw new Error(res.data.message || "Submission failed.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}

export default useFormSubmit;
