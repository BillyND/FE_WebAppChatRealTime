import { KEY_INFO_USER, initInfoUser } from "../utils/constant";
import { infoUserSubscription } from "../utils/globalStates/initGlobalState";
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

  localStorage.removeItem(KEY_INFO_USER);
  infoUserSubscription.updateState(initInfoUser);

  return resLogout;
};

// <===API POST===>
export const createPost = (dataPost) => {
  return axios.post("post", dataPost, tokenHeaders());
};

export const getPost = (page = 1, limit = 5) => {
  return axios.get(`post?page=${page}&limit=${limit}`, tokenHeaders());
};

export const deletePost = (id) => {
  return axios.post(
    `post/${id}`,
    { userId: infoUserSubscription.state?.infoUser?._id },
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
