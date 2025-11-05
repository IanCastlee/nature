// import { useState } from "react";
// import axiosInstance from "../utils/axiosInstance";

// const useSetInactive = (url, onSuccess) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const setInactive = async (data) => {
//     // console.log("useSetInactive: called with data:", data);
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance.post(url, data);
//       // console.log("useSetInactive: response:", response);

//       if (response.data.success) {
//         onSuccess?.(response.data);
//       } else {
//         console.log("useSetInactive: failure, throwing error", response.data);
//         throw new Error(response.data.message || "Failed to update status.");
//       }
//     } catch (err) {
//       console.error("useSetInactive: caught error:", err);
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { setInactive, loading, error };
// };

// export default useSetInactive;

import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useSetInactive = (url, onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setInactive = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Get token from sessionStorage
      const authStorage = sessionStorage.getItem("auth-storage");
      const token =
        authStorage && JSON.parse(authStorage).state?.token
          ? JSON.parse(authStorage).state.token
          : null;

      if (!token) throw new Error("No token found. Please login.");

      const response = await axiosInstance.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        onSuccess?.(response.data);
      } else {
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
