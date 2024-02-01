import { message } from "antd";
import { unionBy } from "lodash";
import { getPost } from "../services/api";
import { detailPostSubs, listPostSubs } from "./globalStates/initGlobalState";

/**
 * Fetches and handles the list of posts.
 *
 * @param {object} params - The parameters for the post fetching (page and limit).
 */
export const handleGetListPost = async ({ page, limit }) => {
  try {
    listPostSubs.updateState({
      loading: true,
    });

    // Fetch posts from the API
    const resListPost = await getPost(page, limit);

    const { results = [] } = resListPost;

    // Combine the existing list of posts with the newly fetched posts, removing duplicates, and sort by createdAt
    const newListPost = unionBy(
      [...listPostSubs.state.listPost, ...results],
      "_id"
    ).sort((item1, item2) => {
      const createdAt1 = new Date(item1.createdAt).getTime();
      const createdAt2 = new Date(item2.createdAt).getTime();
      return createdAt2 - createdAt1;
    });

    // Update the application state with the new list of posts
    listPostSubs.updateState({
      ...resListPost,
      next: resListPost.next,
      listPost: newListPost,
      loading: false,
    });
  } catch (error) {
    listPostSubs.updateState({
      loading: false,
    });
    console.error("===> Error handleGetListPost:", error);
  }
};

export const compareChange = (values) => {
  try {
    return values.some(
      (value) =>
        JSON.stringify(value)?.trim() !== JSON.stringify(values[0])?.trim()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Smoothly scrolls to the bottom of the specified element from the current scroll position.
 * If an error occurs during smooth scrolling, it falls back to a regular scroll.
 *
 * @param {string} elementId - The ID of the element to scroll to the bottom.
 */
export const scrollToBottomOfElement = (elementId) => {
  /*** Get the element with the provided ID ***/
  const elementHasScrollBottom = document?.getElementById(elementId);

  /*** Get the total height of the content at the bottom of the scrollable area ***/
  const scrollHeight = elementHasScrollBottom?.scrollHeight;
  try {
    /*** Get the current scroll position ***/
    const currentScrollTop = elementHasScrollBottom.scrollTop;

    /*** Number of steps for smooth scrolling, adjust as needed for desired smoothness ***/
    const numSteps = 20;

    /*** Calculate the distance to move in each step ***/
    const scrollStep = (scrollHeight - currentScrollTop) / numSteps;

    /*** Initiate the smooth scroll process using requestAnimationFrame ***/
    const smoothScroll = (currentStep) => {
      if (currentStep <= numSteps) {
        /*** Calculate the new scroll position based on the current position ***/
        const newScrollTop = currentScrollTop + currentStep * scrollStep;

        /*** Set the new scroll position ***/
        elementHasScrollBottom.scrollTop = newScrollTop;

        /*** Recall the smoothScroll function with the next step ***/
        requestAnimationFrame(() => smoothScroll(currentStep + 1));
      } else {
        /*** Ensure scrolling to the very bottom after completing all steps ***/
        elementHasScrollBottom.scrollTop = scrollHeight;
      }
    };

    /*** Start the smooth scroll from step 0 ***/
    smoothScroll(0);
  } catch (error) {
    /*** If an error occurs, fall back to a basic scroll to the bottom ***/
    console.error("===> Error scrollToBottomOfElement:", error);
    elementHasScrollBottom.scrollTop = scrollHeight;
  }
};

export const formatTimeAgo = (timeInMilliseconds) => {
  const now = Date.now();
  let formattedTime = timeInMilliseconds;

  try {
    formattedTime = Number(new Date(timeInMilliseconds));
  } catch (error) {
    console.error("===> Error formatTimeAgo:", error);
  }

  const timeDiff = now - formattedTime;
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));

  if (minutes < 60) {
    return `${minutes || 1} minute${minutes > 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else {
    return `${weeks} week${weeks > 1 ? "s" : ""}`;
  }
};

export const showPopupError = (error) => {
  message.error(error || "Server error!");
};

export const mergeDataPostToListPost = (postValue = {}) => {
  const { postId } = postValue;
  const { listPost } = listPostSubs.state || {};

  listPostSubs.state = {
    ...listPostSubs.state,
    listPost: [
      ...listPost.map((post) => {
        if (post?._id === postId) {
          return {
            ...postValue,
          };
        }
        return post;
      }),
    ],
  };
};

/**
 * Handles updating data of a post through WebSocket
 * @param {Object} postSocket - Object containing new data from WebSocket
 * @param {string} postId - ID of the post
 * @param {Array} keys - Array containing keys to update values
 */
export const handleUpdatePostSocket = (postSocket, postId, keys) => {
  const {
    _id: postIdSocket,
    targetSocketId,
    currentSocketId,
  } = postSocket || {};

  const isIdChanged =
    !compareChange([postIdSocket, postId]) &&
    compareChange([targetSocketId, currentSocketId]);

  const isPostChanged = compareChange([
    postSocket,
    detailPostSubs.state[`post-${postSocket}`],
  ]);

  const isPostChangedWithKeys = keys?.some((key) =>
    compareChange([
      postSocket[key],
      detailPostSubs.state[`post-${postId}`][key],
    ])
  );

  if (isIdChanged && (keys ? isPostChangedWithKeys : isPostChanged)) {
    // Create a new object containing updates for each key in the keys array
    const updatedState = keys?.reduce((acc, key) => {
      acc[key] = postSocket[key];
      return acc;
    }, {});

    // Update the state of the post in the state object
    detailPostSubs.updateState({
      [`post-${postId}`]: keys
        ? { ...detailPostSubs.state[`post-${postId}`], ...updatedState }
        : { ...detailPostSubs.state[`post-${postId}`], ...postSocket },
    });
  }
};

/**
 * Handles updating specific data of a comment through WebSocket based on keys
 * @param {Object} commentSocket - Object containing new data from WebSocket
 * @param {string} commentId - ID of the comment
 * @param {Array} keys - Array containing keys to update values.
 */
export const handleUpdateCommentSocket = (commentSocket, commentId, keys) => {
  const {
    _id: commentIdSocket,
    targetSocketId,
    currentSocketId,
  } = commentSocket || {};

  const isIdChanged =
    !compareChange([commentIdSocket, commentId]) &&
    compareChange([targetSocketId, currentSocketId]);
  const isCommentChanged = compareChange([
    commentSocket,
    detailPostSubs.state[`comment-${commentId}`],
  ]);
  const isCommentChangedWithKeys = keys?.some((key) =>
    compareChange([
      commentSocket[key],
      detailPostSubs.state[`comment-${commentId}`][key],
    ])
  );

  if (isIdChanged && (keys ? isCommentChangedWithKeys : isCommentChanged)) {
    // Create a new object containing updates for each key in the keys array
    const updatedState = keys?.reduce(
      (acc, key) => ({ ...acc, [key]: commentSocket[key] }),
      {}
    );

    // Update the state of the comment in the state object
    detailPostSubs.updateState({
      [`comment-${commentId}`]: keys
        ? { ...detailPostSubs.state[`comment-${commentId}`], ...updatedState }
        : { ...detailPostSubs.state[`comment-${commentId}`], ...commentSocket },
    });
  }
};

export const handleHiddenPost = (postId) => {
  const { listPost, next } = listPostSubs.state || {};
  const newListPost = listPost.filter((post) => post?._id !== postId);

  listPostSubs.updateState({
    listPost: newListPost,
  });

  if (newListPost.length < 5 && next) {
    handleGetListPost(next);
  }
};
