import { KEY_INFO_USER, initInfoUser } from "@utils/constant";
import { infoUserSubscription } from "@utils/globalStates/initGlobalState";
import { passLocalStorage } from "@utils/passLocalStorage";
import { firstCharToLowerCase, limitFetchPost } from "../utils/utilities";
import axios, { getInfoUserLocal } from "./customAxios";
import { history } from "../utils/HandlersComponent/NavigationHandler";
import { isEmpty } from "lodash";

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

// <=====Auth=====> //
export const postRegister = ({ email, username, password }) => {
  return axios.post("auth/register", {
    email: firstCharToLowerCase(email),
    username,
    password,
  });
};

export const postLogin = ({ email, password }) => {
  return axios.post("auth/login", {
    email: firstCharToLowerCase(email),
    password,
  });
};

export const getDataInfoUser = () => {
  return axios.get("auth/user", tokenHeaders());
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

// <===Api Post===>
export const createPost = (dataPost) => {
  return axios.post("post", dataPost, tokenHeaders());
};

export const updatePost = (dataPost) => {
  const { postId, userId } = dataPost;
  return axios.put(`post/${postId}/${userId}`, dataPost, tokenHeaders());
};

export const getPost = (page = 1, limit = limitFetchPost, email) => {
  if (["undefined", "null"].includes(email)) {
    history.navigate("/");
    return;
  }

  return axios.get(
    `post?page=${page}&limit=${limit}&email=${email}`,
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

// <===Api User===>
export const getUser = (page = 1, limit = limitFetchPost) => {
  return axios.get(`users?page=${page}&limit=${limit}`, tokenHeaders());
};

export const searchUserByName = (payload) => {
  return axios.post(`users/search`, payload, tokenHeaders());
};

export const followersUser = (payload) => {
  const currentUserId = infoUserSubscription.state?.infoUser?._id;
  return axios.put(`users/${currentUserId}/follow`, payload, tokenHeaders());
};

export const saveProfileUser = (payload) => {
  const currentUserId = infoUserSubscription.state?.infoUser?._id;
  return axios.post(`users/${currentUserId}/profile`, payload, tokenHeaders());
};

export const reportProblem = (payload) => {
  return axios.post(`users/report-problem`, payload, tokenHeaders());
};

// <===Api Message===>
export const createMessage = (payload) => {
  const { sender, ...rest } = payload || {};
  return axios.post(`message`, rest, tokenHeaders());
};

export const getMessages = (conversationId) => {
  return axios.get(`message/${conversationId}`, tokenHeaders());
};

// <===Api Conversation===>
export const createConversation = (receiverId) => {
  const senderId = infoUserSubscription.state?.infoUser?._id;
  return axios.post(`conversation`, { senderId, receiverId }, tokenHeaders());
};

export const getConversations = () => {
  const currentUserId = infoUserSubscription.state?.infoUser?._id;
  return axios.get(`conversation/${currentUserId}`, tokenHeaders());
};

export const getConversationByReceiver = (receiverId, page, limit) => {
  return axios.get(
    `conversation/receiver/${receiverId}?page=${page}&limit=${limit}`,
    tokenHeaders()
  );
};

export const updateUsersReadConversation = (conversationId, messageId) => {
  return axios.put(`conversation/users-read`, { conversationId, messageId });
};

export const updateStyleConversation = (conversationId, style) => {
  return axios.put(`conversation/style`, { conversationId, style });
};
