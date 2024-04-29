import { createSubscription } from "global-state-hook";
import { initInfoUser } from "../constant";
import { styleDark } from "../hooks/useStyleApp";

export const infoUserSubscription = createSubscription(initInfoUser);

export const listPostSubs = createSubscription({
  listPost: [],
  next: { page: 1, limit: 5 },
  listPostByUser: [],
  nextByUser: { page: 1, limit: 5 },
  loading: true,
});

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

export const initConversationSubs = {
  conversationId: null,
  fetchingConversation: false,
  fetchingMessage: false,
  isSending: false,
  listConversation: [],
  listMessage: [],
  receiver: null,
};
export const conversationSubs = createSubscription(initConversationSubs);
