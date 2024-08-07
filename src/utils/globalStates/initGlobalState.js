import { createSubscription } from "global-state-hook";
import { initInfoUser, styleDark } from "../constant";

export const infoUserSubscription = createSubscription(initInfoUser);

export const listPostSubs = createSubscription({
  listPost: [],
  next: { page: 1, limit: 5 },
  listPostByUser: [],
  nextByUser: { page: 1, limit: 5 },
  loading: true,
  listHidden: [],
});

export const detailPostSubs = createSubscription({});

export const styleAppSubscription = createSubscription(styleDark);

export const socketIoSubs = createSubscription({ socketIo: null });

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
  listConversations: [],
  listMessages: [],
  receiver: null,
  usersOnline: {},
};
export const conversationSubs = createSubscription(initConversationSubs);

export const dataImageMessage = createSubscription({
  fileList: [],
  imgList: [],
});
