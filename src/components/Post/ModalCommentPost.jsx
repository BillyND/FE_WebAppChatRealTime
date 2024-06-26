import BaseModal from "@UI/BaseModal";
import { SpinnerLoading } from "@UI/SpinnerLoading";
import { getCommentsInPost } from "@services/api";
import { SOURCE_IMAGE_SEND } from "@utils/constant";
import { detailPostSubs } from "@utils/globalStates/initGlobalState";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { showPopupError, updateCurrentPost } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect } from "react";
import DetailPost from "./DetailPost";
import { DetailComment } from "./DetailtComment";
import { FooterComment } from "./FooterComment";
import { IconSend } from "@assets/icons/icon";

export const ButtonSend = ({ disabled, onClick }) => {
  const handleOnclick = (e) => {
    !disabled && onClick(e);
  };

  return (
    <div
      onPointerDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onPointerUp={handleOnclick}
      onTouchEnd={handleOnclick}
      className={`button-send cursor-pointer ${disabled ? "disabled" : ""}`}
    >
      <div className={`icon-send `}>
        <IconSend />
      </div>
    </div>
  );
};

function ModalCommentPost(props) {
  const {
    openComment,
    setOpenComment,
    post: { username },
    postId,
    currentAvaUrl,
  } = props;
  const {
    state: { [`post-${postId}`]: post },
  } = useSubscription(detailPostSubs, [`post-${postId}`]);
  const { comments, loading, posting, tempComment = "", countComment } = post;
  const {
    styleApp: { type },
  } = useStyleApp();

  useEffect(() => {
    openComment && fetchCommentsInPost();
    detailPostSubs.state.commentEdit = null;
  }, [openComment]);

  const fetchCommentsInPost = async () => {
    updateCurrentPost({
      ...post,
      loading: true,
    });

    try {
      const resComments = (await getCommentsInPost(postId)) || [];

      const dataPostUpdate = {
        ...post,
        loading: false,
        comments: resComments,
      };

      updateCurrentPost(dataPostUpdate);
    } catch (err) {
      console.error("===> Error fetchCommentsInPost:", err);
      showPopupError();
    }
  };

  return (
    <>
      {openComment && (
        <BaseModal
          width={700}
          open={openComment}
          onCancel={() => setOpenComment(false)}
          title={`Post by ${username}`}
          footer={<FooterComment postId={postId} openComment={openComment} />}
          className={`modal-comment-post ${type}`}
          style={{ top: 20, position: "relative" }}
          scrollId={postId}
        >
          <DetailPost
            {...props}
            loop={true}
            openedComment={false}
            hasDelete={false}
          />
          <hr className="gray mt-3 mb-3" />

          <div className="list-comment mb-2">
            {comments?.map((comment, index) => {
              const { _id, avaUrl: avaUrlOfComment } = comment || {};

              detailPostSubs.state = {
                ...detailPostSubs.state,
                [`comment-${_id}`]: {
                  ...comment,
                },
              };

              return (
                <Fragment key={`${_id}-${index}`}>
                  <DetailComment
                    avaUrlOfComment={avaUrlOfComment}
                    commentId={_id}
                    postId={postId}
                  />
                </Fragment>
              );
            })}

            {!comments.length && !posting && !loading && (
              <Flex
                align="center"
                justify="center"
                className="box-no-comment pt-5 pb-5"
              >
                No comments yet.
              </Flex>
            )}

            {posting && (
              <DetailComment
                avaUrlOfComment={currentAvaUrl}
                tempComment={tempComment}
                posting={posting}
              />
            )}
          </div>

          {loading && <SpinnerLoading className={`pb-3`} />}
        </BaseModal>
      )}
    </>
  );
}

export default ModalCommentPost;
