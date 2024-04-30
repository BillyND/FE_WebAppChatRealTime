import axios from "axios";
import asyncWait from "@utils/asyncWait";
import { KEY_INFO_USER } from "@utils/constant";
import { infoUserSubscription } from "@utils/globalStates/initGlobalState";
import { passLocalStorage } from "@utils/passLocalStorage";

// Base URL for API requests
const baseURL = "https://socialbe.billynd.site/";
// const baseURL = import.meta.env.VITE_BACKEND_URL;
// Header to indicate no retry for failed requests
const NO_RETRY_HEADER = "x-no-retry";
// Check if the API is local
const isLocalApi =
  baseURL?.includes("127.0.0.1") || baseURL?.includes("localhost");
// Create an instance of Axios with baseURL
const instance = axios.create({ baseURL: baseURL + "v1/api/" });

const handleDelayApiLocal = async () => {
  if (isLocalApi) {
    await asyncWait(1000);
  }
};

// Function to get user info from local storage
export const getInfoUserLocal = () => {
  const infoUser = passLocalStorage.getItem(KEY_INFO_USER) || {};
  infoUserSubscription.state = infoUser;
  return infoUser;
};

// Function to handle refreshing access token
const handleRefreshToken = async () => {
  const refreshLocal = passLocalStorage?.getItem(KEY_INFO_USER)?.refreshToken;
  const res = await instance.post("/auth/refresh", { refreshLocal });
  return res?.data;
};

// Function to set access token in request headers
const setAccessToken = () => {
  const accessToken = getInfoUserLocal()?.accessToken;
  if (accessToken)
    instance.defaults.headers.common = {
      Authorization: `Bearer ${accessToken}`,
    };
};

// Interceptor to add access token to request headers
instance.interceptors.request.use(
  async function (config) {
    setAccessToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Interceptor to handle response
instance.interceptors.response.use(
  async function (response) {
    await handleDelayApiLocal();

    return response?.data;
  },
  async function (error) {
    // Handle token refresh for unauthorized errors
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const data = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true"; // Mark request to avoid retry
      if (data && data.accessToken && data.refreshToken) {
        // Update access token and refresh token in local storage
        error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        let infoUser = passLocalStorage.getItem(KEY_INFO_USER);
        infoUser = {
          ...infoUser,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        passLocalStorage.setItem(KEY_INFO_USER, infoUser);
        return instance.request(error.config);
      }
    }

    // Handle removal of user info from local storage for certain errors
    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/auth/refresh"
    ) {
      // Remove user info from local storage
      passLocalStorage.removeItem(KEY_INFO_USER);
      // window.location.href = "/login";
    }

    await handleDelayApiLocal();

    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance; // Export the Axios instance
