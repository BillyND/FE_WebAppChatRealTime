import axios, { getAccessToken } from "./customAxios";

// <=====Trigger header token=====> //
export const getTriggerToken = async () => {
  return await axios.get("trigger");
};

const tokenHeaders = () => {
  const token = getAccessToken();
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
  return axios.post("auth/login", { email, password }, tokenHeaders());
};

export const getAllAccount = () => {
  return axios.get("auth/account", tokenHeaders());
};

export const postLogout = () => {
  return axios.post("auth/logout", tokenHeaders());
};
