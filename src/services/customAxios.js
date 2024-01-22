import axios from "axios";
import asyncWait from "../utils/asysnWait";
import { KEY_INFO_USER } from "../utils/constant";
import { infoUserSubscription } from "../utils/globalStates/initGlobalState";
import { passLocalStorage } from "../utils/passLocalStorage";

export const baseURL = import.meta.env.VITE_BACKEND_URL;
const NO_RETRY_HEADER = "x-no-retry";

const isLocalApi =
  baseURL?.includes("127.0.0.1") || baseURL?.includes("localhost");

const handleDelayApiLocal = async () => {
  if (isLocalApi) {
    await asyncWait(400);
  }
};

let instance = axios.create({
  baseURL: baseURL + "v1/api/",
});

// Function to get the access token from passLocalStorage
export const getInfoUserLocal = () => {
  const infoUser = passLocalStorage.getItem(KEY_INFO_USER) || {};
  infoUserSubscription.state = infoUser;
  return infoUser;
};

// Handle refresh Token
const handleRefreshToken = async () => {
  const refreshLocal = passLocalStorage?.getItem(KEY_INFO_USER)?.refreshToken;
  const res = await instance.post("/auth/refresh", { refreshLocal });
  if (res && res.data) {
    return res.data;
  } else return;
};

// Function to set the access token in the header
const setAccessToken = () => {
  const accessToken = getInfoUserLocal()?.accessToken;
  if (accessToken) {
    instance.defaults.headers.common = {
      Authorization: `Bearer ${accessToken}`,
    };
  }
};

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    setAccessToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  async function (response) {
    setAccessToken();

    await handleDelayApiLocal();

    return response && response.data ? response.data : response;
  },

  async function (error) {
    setAccessToken();
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const data = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";

      if (data && data.accessToken && data.refreshToken) {
        error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;

        let infoUser = passLocalStorage.getItem(KEY_INFO_USER);

        infoUser = {
          ...infoUser,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        passLocalStorage.setItem(KEY_INFO_USER, infoUser);
        return instance.request(error.config);
      } else return;
    }
    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/auth/refresh"
    ) {
      passLocalStorage.removeItem(KEY_INFO_USER);
      // window.location.href = "/login";
    }

    await handleDelayApiLocal();

    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
