import { useSubscription } from "global-state-hook";
import React, { useEffect } from "react";
import { deletePost } from "../../services/api";
import {
  detailPostSubs,
  listPostSubs,
} from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useModal } from "../../utils/hooks/useModal";
import { handleGetListPost } from "../../utils/utilities";
import DetailPost from "./DetailPost";
import "./Post.scss";
import BaseModal from "../../UI/BaseModal";

function ListPost() {
  const { infoUser } = useAuthUser();
  const {
    state,
    state: { listPost, postIdDelete },
    setState,
  } = useSubscription(listPostSubs, ["listPost"]);
  const { state: modalState, closeModal } = useModal(["CONFIRM_DELETE_POST"]);

  useEffect(() => {
    handleGetListPost({ page: 1, limit: 5 });
  }, []);

  const handleConfirmDeletePost = async () => {
    setState({
      loading: true,
    });

    const filterDeleted =
      listPost.filter((item) => item._id !== postIdDelete) || [];

    await deletePost(listPostSubs.state["postIdDelete"])
      .then(() => {
        setState({
          ...state,
          listPost: filterDeleted,
        });
      })
      .finally(() => {
        setState({
          loading: false,
        });
        closeModal("CONFIRM_DELETE_POST");
        filterDeleted.length < 5 && handleGetListPost({ page: 1, limit: 5 });
      });
  };

  return (
    <>
      <div className="list-post-container pt-5 mb-5">
        <h4>Feeds</h4>
        {listPost?.map((post = {}) => {
          const { _id: postId, comments: countComment } = post;
          const isAuthorOfPost = post.userId === infoUser._id;

          detailPostSubs.state = {
            ...detailPostSubs.state,
            listPost,
            [`post-${postId}`]: {
              ...post,
              comments: [],
              loading: false,
              countComment,
            },
          };

          return (
            <DetailPost
              key={postId}
              postId={postId}
              isAuthorOfPost={isAuthorOfPost}
            />
          );
        })}
      </div>
      <BaseModal
        open={modalState["CONFIRM_DELETE_POST"]}
        onCancel={() => closeModal("CONFIRM_DELETE_POST")}
        onOk={handleConfirmDeletePost}
        title="Delete post?"
        loading={state?.loading}
      >
        Post will be permanently deleted. Do you agree?
      </BaseModal>
    </>
  );
}

export default ListPost;
