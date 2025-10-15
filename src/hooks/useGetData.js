// useGetData.js
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

function useGetData(url, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(url);
      if (res.data.success) {
        setData(res.data.data);
        setError(null);
      } else {
        setError(new Error(res.data || "API responded with an error."));
        console.log("first", res.data);
      }
    } catch (err) {
      // Extract better error message if possible
      const message =
        err.response?.data?.message || err.message || "Network or server error";
      console.error("Fetch error:", err);
      setError(new Error(message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

export default useGetData;
