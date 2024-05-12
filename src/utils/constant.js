export const windowWidth = window.innerWidth;

export const initInfoUser = {
  infoUser: {
    _id: "",
    email: "",
    password: "",
    avaUrl: "",
    displayName: "",
    isAdmin: false,
    name: "",
    age: 0,
    gender: "",
    createdAt: "",
    updatedAt: "",
    username: "",
    followers: [],
    followings: [],
  },
  accessToken: "",
  refreshToken: "",
};

export const KEY_INFO_USER = "infoUser";

export const TIME_DEBOUNCE_INPUT_LOGIN_REGISTER = 300;

export const TIME_DELAY_SEARCH_INPUT = 100;

export const TIME_DELAY_FETCH_API = 300;

export const regexValidateEmail =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const KEY_NEW_POST = "NEW_POST";

export const SOURCE_IMAGE_LIKED = `data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E`;

export const SOURCE_IMAGE_SEND = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAxOSAxOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjA3NyA5LjU0MzMzTDIuMDg5MjMgMTAuMTk3OUMxLjgyNzYyIDEwLjE5NzkgMS42OTY4MSAxMC4zMjg4IDEuNjk2ODEgMTAuNDU5N0wwLjEyNzEyMSAxNS44MjcyQy0wLjEzNDQ5MyAxNi40ODE4IC0wLjAwNzUzODcgMTcuMzg5NiAwLjY1MDM1MSAxNy45MTQ2QzEuMTc1NzkgMTguMzA2MyAyLjA4OTIzIDE4LjM5NzkgMi42MTI0NiAxOC4xODM3TDE3LjI2MjkgMTAuODUyNUMxOC4wNDc3IDEwLjQ1OTcgMTguNDQwMSA5LjY3NDI1IDE4LjMwOTMgOC44ODg3NkMxOC4xNzg1IDguMzY1MSAxNy43ODYxIDcuODQxNDQgMTcuMjYyOSA3LjU3OTYyTDIuNjEyNDYgMC4xMTc0OTFDMS45NTg0MiAtMC4xMDIwNjEgMS4xNzM1OCAtMC4wMTM0MjM3IDAuNjUwMzUxIDAuMzc5MzJDLTAuMDAzNjg2MSAwLjkwMjk3OCAtMC4xMzQ0OTMgMS42ODg0NiAwLjEyNzEyMSAyLjQ3Mzk1TDEuNjk2ODEgNy44NDE0NEMxLjY5NjgxIDcuOTcyMzYgMS45NTg0MiA4LjEwMzI3IDIuMDg5MjMgOC4xMDMyN0wxMy4wNzcgOC43NTc4NUMxMy4wNzcgOC43NTc4NSAxMy40Njk1IDguNzU3ODUgMTMuNDY5NSA5LjE1MDU5QzEzLjQ2OTUgOS41NDMzMyAxMy4wNzcgOS41NDMzMyAxMy4wNzcgOS41NDMzM1oiIGZpbGw9IiMwMDg0RkYiLz4KPC9zdmc+Cg==`;

export const TYPE_STYLE_APP = {
  DARK: "dark",
  LIGHT: "light",
};

export const BACKGROUND_STYLE_APP = {
  DARK: "#fff",
  LIGHT: "#101010d9",
};

export const KEY_STYLE_APP = "KEY_STYLE_APP";

export const STROKE_COLOR_ICON = {
  ACTIVE: "#fff",
  DE_ACTIVE: "#595959",
};

export const FILL_COLOR_ICON = {
  ACTIVE: "#fff",
  DE_ACTIVE: "#00000000",
};

export const TITLE_OF_CURRENT_SITE = "Social Media";

export const boxMessageId = "box-list-message";

export const styleDark = {
  backgroundModalColor: "#181818",
  backgroundColor: "#101010",
  color: "#f3f5f7",
  subColor: "#99999A",
  type: TYPE_STYLE_APP.DARK,
  STROKE_COLOR_ICON: {
    ACTIVE: "#fff",
    DE_ACTIVE: "gray",
  },
  FILL_COLOR_ICON: {
    ACTIVE: "#fff",
    DE_ACTIVE: "#00000000",
  },
  navMenuStyle: {
    backgroundColor: "#101010d9",
    color: "#f3f5f7",
  },
  popoverSettings: {
    backgroundColor: "#181818",
    color: "#f3f5f7",
  },
  inputSearch: {
    backgroundColor: "#0A0A0A",
    color: "#EBEEF0",
  },
};

export const styleLight = {
  backgroundModalColor: "#fff",
  backgroundColor: "#FFFFFF",
  color: "#000000",
  subColor: "#99999A",
  type: TYPE_STYLE_APP.LIGHT,
  STROKE_COLOR_ICON: {
    ACTIVE: "black",
    DE_ACTIVE: "#B8B8B8",
  },
  FILL_COLOR_ICON: {
    ACTIVE: "black",
    DE_ACTIVE: "#00000000",
  },
  navMenuStyle: {
    backgroundColor: "#fff",
    color: "#000000",
  },
  popoverSettings: {
    backgroundColor: "#fff",
    color: "black",
  },
  inputSearch: {
    backgroundColor: "#FAFAFA",
    color: "#000000",
  },
};
