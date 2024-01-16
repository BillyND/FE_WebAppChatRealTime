import { DeleteOutlined } from "@ant-design/icons";
import { createSubscription, useSubscription } from "global-state-hook";
import React, { useEffect } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useModal } from "../../hooks/useModal";
import { deletePost, getPost } from "../../services/api";
import ConfirmModal from "../Modals/ConfirmModal";
import "./ListPost.scss";
import DetailPost from "./DetailPost";

export const listPostSubs = createSubscription({ listPost: [] });

export const handleGetListPost = async ({ page, limit }) => {
  const resListPost = await getPost(page, limit);

  listPostSubs.updateState({
    ...resListPost,
    listPost: resListPost?.["results"],
  });
};

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
    await deletePost(listPostSubs.state["postIdDelete"])
      .then(() => {
        setState({
          ...state,
          listPost: listPost.filter((item) => item._id !== postIdDelete),
        });
      })
      .finally(() => {
        setState({
          loading: false,
        });
        closeModal("CONFIRM_DELETE_POST");
        handleGetListPost(1, 5);
      });
  };

  return (
    <>
      <div className="list-post-container pt-5 pb-5 mb-5">
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
