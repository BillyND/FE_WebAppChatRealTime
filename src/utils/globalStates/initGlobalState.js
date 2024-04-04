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

const fakeDataListConversation = [
  {
    id: 1,
    avaUrl:
      "https://res.cloudinary.com/doykkq8t7/image/upload/v1712242278/zbhhavs9gas3qxexo4yx.jpg",
    username: "Billy 2",
    lastMessage:
      "Oke bạn hiềnOke bạn hiềnOke bạn hiềnOke bạn hiềnOke bạn hiềnOke bạn hiềnOke bạn hiền",
    timeSendLast: Date.now(),
  },
  {
    id: 2,
    avaUrl:
      "https://res.cloudinary.com/doykkq8t7/image/upload/v1712242278/zbhhavs9gas3qxexo4yx.jpg",
    username: "Billy 2",
    lastMessage: "Oke bạn hiền",
    timeSendLast: Date.now(),
  },
  {
    id: 3,
    avaUrl:
      "https://res.cloudinary.com/doykkq8t7/image/upload/v1712242278/zbhhavs9gas3qxexo4yx.jpg",
    username: "Billy 2",
    lastMessage: "Oke bạn hiền",
    timeSendLast: Date.now(),
  },
  {
    id: 4,
    avaUrl:
      "https://res.cloudinary.com/doykkq8t7/image/upload/v1712242278/zbhhavs9gas3qxexo4yx.jpg",
    username: "Billy 2",
    lastMessage: "Oke bạn hiền",
    timeSendLast: Date.now(),
  },
  {
    id: 5,
    avaUrl:
      "https://res.cloudinary.com/doykkq8t7/image/upload/v1712242278/zbhhavs9gas3qxexo4yx.jpg",
    username: "Billy 2",
    lastMessage: "Oke bạn hiền",
    timeSendLast: Date.now(),
  },
];

export const conversationSubs = createSubscription({
  listConversation: fakeDataListConversation || [],
  conversationSelected: null,
});
