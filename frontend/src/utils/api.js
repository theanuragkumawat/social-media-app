import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Your backend server URL
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
// -----------------------------------------


// 2. (Optional) Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from wherever you store it (e.g., localStorage, cookies)
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// 3. (Optional) Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, queue the original request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Set the retry flag to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh token endpoint
        const response = await axiosInstance.post("/users/refresh-token");
        const newAccessToken = response.data.accessToken;

        // Store the new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update the header for the current axios instance
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;

        // Update the header for the original request
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        // Process the queue with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh token is invalid, clear storage and redirect to login
        processQueue(refreshError, null);
        console.error("Refresh token is invalid. Logging out.", refreshError);
        localStorage.removeItem("accessToken");
        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

// 4. Export the configured instance
export default axiosInstance;
