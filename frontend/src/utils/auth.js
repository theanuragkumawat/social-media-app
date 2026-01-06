import axios from "./api.js";

const signupUser = async function ({ email, password, username, fullname }) {
  if (!email || !password || !username || !fullname) {
    throw new Error("Email and password are required");
  }
  try {
    const response = await axios({
      url: "/users/register",
      method: "post",
      data: { email, password, username, fullname },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const loginUser = async function ({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  try {
    const response = await axios({
      url: "/users/login",
      method: "post",
      data: { email, password },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const getCurrentUser = async function () {
  try {
    const response = await axios({
      url: "/users/current-user",
      method: "post",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const dobChangeUser = async function ({ userId, dob }) {
  console.log(userId, dob);
  if (!userId || !dob) {
    throw new Error("userId and dob are required");
  }
  try {
    const response = await axios({
      url: `/users/dob-register/${userId}`,
      method: "post",
      data: { dob: dob },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const otpVerify = async function ({ otp }) {
  console.log(otp);
  if (!otp) {
    throw new Error("otp is required");
  }
  try {
    const response = await axios({
      url: `/users/verify-otp`,
      method: "post",
      data: { otp: otp },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export { signupUser, dobChangeUser, otpVerify, loginUser, getCurrentUser };
