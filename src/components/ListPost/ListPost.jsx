import { createSubscription, useSubscription } from "global-state-hook";
import React, { useEffect } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useModal } from "../../hooks/useModal";
import { deletePost } from "../../services/api";
import { handleGetListPost } from "../../utils/utilities";
import ConfirmModal from "../Modals/ConfirmModal";
import DetailPost from "./DetailPost";
import "./ListPost.scss";

export const listPostSubs = createSubscription({ listPost: [] });

function ListPost(props) {
  const { infoUser } = useAuthUser();
  const {
    state,
    state: { listPost, postIdDelete },
    setState,
  } = useSubscription(listPostSubs, ["listPost"]);
  const { state: modalState, closeModal } = useModal();

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
        {listPost?.map((post) => {
          const isAuthorOfPost = post?.userId === infoUser?._id;
          return (
            <DetailPost
              key={post._id}
              post={post}
              isAuthorOfPost={isAuthorOfPost}
            />
          );
        })}
      </div>
      <ConfirmModal
        open={modalState["CONFIRM_DELETE_POST"]}
        onCancel={() => closeModal("CONFIRM_DELETE_POST")}
        onOk={handleConfirmDeletePost}
        title="Delete post?"
        loading={state?.loading}
      >
        Post will be permanently deleted. Do you agree?
      </ConfirmModal>
    </>
  );
}

export default ListPost;
