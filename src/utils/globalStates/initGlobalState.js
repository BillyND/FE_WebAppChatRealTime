import { createSubscription } from "global-state-hook";
import { initInfoUser } from "../constant";
import { styleDark } from "../hooks/useStyleApp";

export const infoUserSubscription = createSubscription(initInfoUser);

export const listPostSubs = createSubscription({ listPost: [], loading: true });

export const detailPostSubs = createSubscription({});

export const styleAppSubscription = createSubscription(styleDark);

export const socketIoSubs = createSubscription({});

export const previewImageFullScreenSubs = createSubscription({ imgSrc: "" });

export const searchInputSubs = createSubscription({
  next: { page: 1, limit: 10 },
  keySearchUser: "",
  results: [],
  resultsPreview: [],
});
