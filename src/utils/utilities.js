import { unionBy } from "lodash";
import { getPost } from "../services/api";
import { listPostSubs } from "./globalStates/initGlobalState";

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
    console.log("===> Error handleGetListPost:", error);
  }
};

export const compareChange = (values) => {
  try {
    return values.some(
      (value) => JSON.stringify(value) !== JSON.stringify(values[0])
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
    const numSteps = 30;

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
