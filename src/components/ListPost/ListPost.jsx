import React, { useEffect, useState } from "react";
import "./ListPost.scss";
import { deletePost, getPost } from "../../services/api";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuthUser } from "../../hooks/useAuthUser";
import { createSubscription, useSubscription } from "global-state-hook";
import ConfirmModal from "../Modals/ConfirmModal";
import { useModal } from "../../hooks/useModal";

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
  const { state: modalState, openModal, closeModal } = useModal();

  useEffect(() => {
    handleGetListPost({ page: 1, limit: 5 });
  }, []);

  const handleConfirmDeletePost = async () => {
    closeModal("CONFIRM_DELETE_POST");

    setState({
      ...state,
      listPost: listPost.filter((item) => item._id !== postIdDelete),
    });

    deletePost(listPostSubs.state["postIdDelete"]);
  };

  return (
    <>
      <div className="list-post-container pt-5 pb-5 mb-5">
        <h4>Feeds</h4>
        {listPost?.map((post) => {
          const isAuthorOfPost = post?.userId === infoUser?._id;
          return (
            <div key={post?._id} className="card-detail-post">
              <div className="header">
                <div className="info-user">
                  <div
                    className="avatar"
                    style={{ backgroundImage: `url(${post?.avaUrl})` }}
                  ></div>
                  <div className="name">{post?.username}</div>
                </div>
                {isAuthorOfPost && (
                  <DeleteOutlined
                    onClick={() => {
                      openModal("CONFIRM_DELETE_POST");
                      listPostSubs.state = {
                        ...listPostSubs.state,
                        postIdDelete: post?._id,
                      };
                    }}
                    className="icon-delete"
                  />
                )}
              </div>

              <div
                className="description"
                dangerouslySetInnerHTML={{
                  __html: post?.description?.replace(/\n/g, "<br/>"),
                }}
              />

              {post?.imageUrl && (
                <div className="image">
                  <img src={post?.imageUrl} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <ConfirmModal
        open={modalState["CONFIRM_DELETE_POST"]}
        onCancel={() => closeModal("CONFIRM_DELETE_POST")}
        onOk={handleConfirmDeletePost}
        title="Delete post?"
      />
    </>
  );
}

export default ListPost;
