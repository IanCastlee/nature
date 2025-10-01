import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useSetInactive = (url, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setInactive = async (data) => {
    console.log("useSetInactive: called with data:", data);
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(url, data);
      console.log("useSetInactive: response:", response);

      if (response.data.success) {
        onSuccess?.(response.data);
      } else {
        console.log("useSetInactive: failure, throwing error", response.data);
        throw new Error(response.data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("useSetInactive: caught error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { setInactive, loading, error };
};

export default useSetInactive;
