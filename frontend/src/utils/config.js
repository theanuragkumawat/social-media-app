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

export {
    createPost
}