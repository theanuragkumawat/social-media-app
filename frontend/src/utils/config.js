import axios from "./api";

const createPost = async function (formdata) {
  //   if (!caption || !media ) {
  //     throw new Error("caption and media are required");
  //   }
  try {
    const response = await axios({
      url: "/posts",
      method: "post",
      data: formdata,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const changeAvatar = async function (formdata) {
  try {
    const response = await axios({
      url: "/users/avatar",
      method: "patch",
      data: formdata,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const removeAvatar = async function () {
  try {
    const response = await axios({
      url: "/users/avatar",
      method: "delete",
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

const updateProfile = async function ({website,bio,gender}) {
  try {
    const response = await axios({
      url: "/users/profile",
      method: "patch",
      data: {website,bio,gender},
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

const getUserProfile = async function () {
  try {
    const response = await axios({
      url: "/users/profile",
      method: "get",
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

export { createPost, changeAvatar, removeAvatar,updateProfile,getUserProfile };
