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
        setError(res.data);

        console.log("⚠️ Form submission returned error state:", res.data);
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
