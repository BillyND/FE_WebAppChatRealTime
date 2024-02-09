import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect } from "react";
import BaseModal from "../../UI/BaseModal";
import { deletePost } from "../../services/api";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useModal } from "../../utils/hooks/useModal";
import { handleGetListPost, updateCurrentPost } from "../../utils/utilities";
import DetailPost from "./DetailPost";
import "./Post.scss";
import { WrapListPost } from "./StyledPost";

function ListPost() {
  const { infoUser } = useAuthUser();
  const {
    state,
    state: { listPost, postIdDelete, loading },
    setState,
  } = useSubscription(listPostSubs, ["listPost", "loading"]);
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
    <WrapListPost>
      <div className="list-post-container">
        {listPost?.map((post = {}) => {
          const { _id: postId, comments, countComment } = post;
          const isAuthorOfPost = post.userId === infoUser._id;

          updateCurrentPost(
            {
              ...post,
              comments: [],
              loading: false,
              countComment:
                Number(comments) || Number(countComment) || comments.length,
            },
            true
          );

          return (
            <Fragment key={postId}>
              <hr className="gray" />
              <DetailPost postId={postId} isAuthorOfPost={isAuthorOfPost} />
            </Fragment>
          );
        })}
      </div>

      <BaseModal
        className="modal-delete-post"
        open={modalState["CONFIRM_DELETE_POST"]}
        onCancel={() => closeModal("CONFIRM_DELETE_POST")}
        onOk={handleConfirmDeletePost}
        title="Delete post?"
        loadingFooter={state?.loading}
      >
        Post will be permanently deleted. Do you agree?
      </BaseModal>
    </WrapListPost>
  );
}

export default ListPost;
