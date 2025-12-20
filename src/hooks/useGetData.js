// useGetData.js
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

function useGetData(url, options = {}, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  console.log("Fetching URL:", url);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(url, options);
      if (res.data.success) {
        setData(res.data.data);
        setError(null);
      } else {
        setError(new Error(res.data || "API responded with an error."));
        // console.log("Error Log", res.data);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Network or server error";
      console.error("Fetch error:", err.message);
      setError(new Error(message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url) {
      console.warn("Skipping fetch — invalid URL:", url);
      return;
    }
    if (autoFetch) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

export default useGetData;
