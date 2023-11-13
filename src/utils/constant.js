export const windowWidth = window.innerWidth;

export const initInfoUser = {
  infoUser: {
    _id: "",
    email: "",
    password: "",
    isAdmin: false,
    name: "",
    age: 0,
    gender: "",
    createdAt: "",
    updatedAt: "",
  },
  accessToken: "",
  refreshToken: "",
};

export const KEY_INFO_USER = "infoUser";

export const TIME_DEBOUNCE_INPUT_LOGIN_REGISTER = 300;

export const regexValidateEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
