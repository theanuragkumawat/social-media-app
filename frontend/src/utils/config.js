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

const updateProfile = async function ({ website, bio, gender }) {
  try {
    const response = await axios({
      url: "/users/profile",
      method: "patch",
      data: { website, bio, gender },
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

const getUserProfile = async function (username) {
  try {
    const response = await axios({
      url: `/users/profile/${username}`,
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

const createStory = async function (formData) {
  try {
    const response = await axios({
      url: "/stories",
      method: "post",
      withCredentials: true,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const toggleFollowUser = async function (userId) {
  try {
    const response = await axios({
      url: `/users/${userId}/follow`,
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


const getAllFeedStories = async function () {
  try {
    const response = await axios({
      url: "/stories",
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

const getUserStories = async function (userId) {
  try {
    const response = await axios({
      url: `/users/${userId}/stories`,
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

const getPostById = async function (postId) {
  try {
    const response = await axios({
      url: `/posts/${postId}`,
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

const likePost = async function (postId) {
  try {
    const response = await axios({
      url: `/posts/${postId}/like`,
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

const unlikePost = async function (postId) {
  try {
    const response = await axios({
      url: `/posts/${postId}/like`,
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


export {
  createPost,
  changeAvatar,
  removeAvatar,
  updateProfile,
  getUserProfile,
  createStory,
  toggleFollowUser,
  getAllFeedStories,
  getUserStories,
  getPostById,
  likePost,
  unlikePost
};
