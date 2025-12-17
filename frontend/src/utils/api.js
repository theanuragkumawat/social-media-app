import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Your backend server URL
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
// -----------------------------------------

// axiosInstance.interceptors.request.use(
//   function (req) {
//     console.log("Requset Interceptor ran");
//     // console.log(req);
//     return req;
//   },
//   function (error) {
//     // request error
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error) {
    const originalRequest = error.config;

    // if (error.response?.status === 401 && originalRequest.url.includes("refresh-token")) {
    //     console.log("Refresh token failed (expired or invalid). Logging out...");
    //     // window.location.href = "/login";
    //     return Promise.reject(error);
    // }

    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance({
          url: "/users/refresh-token",
          method: "post",
          withCredentials: true,
        });
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    // request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
