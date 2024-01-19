import { unionBy } from "lodash";
import { listPostSubs } from "../components/Post/ListPost";
import { getPost } from "../services/api";

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
