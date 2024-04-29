import BaseModal from "@UI/BaseModal";
import { deletePost } from "@services/api";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useModal } from "@utils/hooks/useModal";
import { updateCurrentPost } from "@utils/utilities";
import { useSubscription } from "global-state-hook";
import React, { Fragment } from "react";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import DetailPost from "./DetailPost";
import { WrapListPost } from "./StyledPost";

const ModalDeletePost = (props) => {
  const {
    email,
    loading,
    listPost,
    setStateListPost,
    handleGetListPost,
    keyListPost,
  } = props;
  const { state: modalState, closeModal } = useModal(["CONFIRM_DELETE_POST"]);
  const {
    state: { postIdDelete },
  } = useSubscription(listPostSubs, ["postIdDelete"]);

  const handleConfirmDeletePost = async () => {
    setStateListPost({
      loading: true,
    });

    const filterDeleted =
      listPost.filter((item) => item._id !== postIdDelete) || [];

    await deletePost(postIdDelete)
      .then(() => {
        setStateListPost({
          [keyListPost]: filterDeleted,
        });
      })
      .finally(() => {
        setStateListPost({
          loading: false,
        });
        closeModal("CONFIRM_DELETE_POST");
        filterDeleted.length < 5 &&
          typeof handleGetListPost === "function" &&
          handleGetListPost({ page: 1, limit: 5, email });
      });
  };
  return (
    <BaseModal
      className="modal-delete-post"
      open={modalState["CONFIRM_DELETE_POST"]}
      onCancel={() => closeModal("CONFIRM_DELETE_POST")}
      onOk={handleConfirmDeletePost}
      title="Delete post?"
      loadingFooter={loading}
    >
      Post will be permanently deleted. Do you agree?
    </BaseModal>
  );
};

function ListPost(props) {
  const { listPost } = props;
  const { infoUser } = useAuthUser();

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

      <ModalDeletePost {...props} />
    </WrapListPost>
  );
}

export default ListPost;
