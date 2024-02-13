import { KEY_INFO_USER, initInfoUser } from "@utils/constant";
import { infoUserSubscription } from "@utils/globalStates/initGlobalState";
import { passLocalStorage } from "@utils/passLocalStorage";
import axios, { getInfoUserLocal } from "./customAxios";

// <=====Trigger header token=====> //
export const getTriggerToken = async () => {
  return await axios.get("trigger");
};

const tokenHeaders = () => {
  const token = getInfoUserLocal()?.accessToken;
  return {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};

// <=====AUTH=====> //
export const postRegister = ({ email, username, password }) => {
  return axios.post("auth/register", {
    email,
    username,
    password,
  });
};

export const postLogin = ({ email, password }) => {
  return axios.post("auth/login", { email, password });
};

export const getAllAccount = () => {
  return axios.get("auth/account", tokenHeaders());
};

export const postLogout = async () => {
  await getTriggerToken();
  const resLogout = await axios.post("auth/logout", tokenHeaders());

  passLocalStorage.removeItem(KEY_INFO_USER);
  infoUserSubscription.updateState(initInfoUser);

  return resLogout;
};

// <===API POST===>
export const createPost = (dataPost) => {
  return axios.post("post", dataPost, tokenHeaders());
};

export const updatePost = (dataPost) => {
  const { postId, userId } = dataPost;
  return axios.put(`post/${postId}/${userId}`, dataPost, tokenHeaders());
};

export const getPost = (page = 1, limit = 5, userId) => {
  return axios.get(
    `post?page=${page}&limit=${limit}&userId=${userId}`,
    tokenHeaders()
  );
};

export const deletePost = (id) => {
  return axios.delete(
    `post/${id}/${infoUserSubscription.state?.infoUser?._id}`,
    tokenHeaders()
  );
};

export const updateLikeOfPost = (id) => {
  return axios.post(
    `/post/likes/${id}`,
    { userId: infoUserSubscription.state?.infoUser?._id },
    tokenHeaders()
  );
};

export const getCommentsInPost = (postId) => {
  return axios.get(`post/comment/${postId}`, tokenHeaders());
};

export const addCommentToPost = (payload) => {
  const { postId } = payload;
  return axios.post(`post/comment/${postId}`, payload, tokenHeaders());
};

export const deleteCommentOfPost = (payload) => {
  const { commentId, ownerId } = payload;
  return axios.delete(`post/comment/${commentId}/${ownerId}`, tokenHeaders());
};

export const updateCommentOfPost = (payload) => {
  const { commentId, ownerId } = payload;
  return axios.put(
    `post/comment/${commentId}/${ownerId}`,
    payload,
    tokenHeaders()
  );
};

// <===API USER===>
export const getUser = (page = 1, limit = 10) => {
  return axios.get(`users?page=${page}&limit=${limit}`, tokenHeaders());
};

export const searchUserByName = (payload) => {
  return axios.post(`users/search`, payload, tokenHeaders());
};

export const followersUser = (payload) => {
  const currentUserId = infoUserSubscription.state?.infoUser?._id;
  return axios.put(`users/${currentUserId}/follow`, payload, tokenHeaders());
};
