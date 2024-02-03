import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect } from "react";
import BaseModal from "../../UI/BaseModal";
import { getCommentsInPost } from "../../services/api";
import { SOURCE_IMAGE_SEND } from "../../utils/constant";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { mergeDataPostToListPost, showPopupError } from "../../utils/utilities";
import DetailPost from "./DetailPost";
import { DetailComment } from "./DetailtComment";
import { FooterComment } from "./FooterComment";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { SpinnerLoading } from "../../UI/SpinnerLoading";

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
      <div
        className={`icon-send `}
        style={{
          backgroundImage: `url(${SOURCE_IMAGE_SEND})`,
        }}
      ></div>
    </div>
  );
};

function ModalCommentPost(props) {
  const {
    openComment,
    setOpenComment,
    post: { username },
    postId,
  } = props;
  const {
    state: { [`post-${postId}`]: post },
    setState,
  } = useSubscription(detailPostSubs, [`post-${postId}`]);
  const { comments, loading, posting, tempComment = "", countComment } = post;
  const {
    styleApp: { type },
  } = useStyleApp();

  useEffect(() => {
    postId && countComment && fetchCommentsInPost();
    detailPostSubs.state.commentEdit = null;
  }, []);

  const fetchCommentsInPost = async () => {
    setState({
      [`post-${postId}`]: {
        ...post,
        loading: true,
      },
    });

    try {
      const resComments = (await getCommentsInPost(postId)) || [];

      const dataPostUpdate = {
        ...post,
        loading: false,
        comments: resComments,
      };

      setState({
        [`post-${postId}`]: dataPostUpdate,
      });

      mergeDataPostToListPost(dataPostUpdate);
    } catch (err) {
      console.error("===> Error fetchCommentsInPost:", err);
      showPopupError();
    }
  };

  return (
    <BaseModal
      width={700}
      open={openComment}
      onCancel={() => setOpenComment(false)}
      title={`Post by ${username}`}
      footer={<FooterComment postId={postId} />}
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
      <hr className="gray mb-2" />

      <div className="list-comment mb-2">
        {comments?.map((comment, index) => {
          const { _id } = comment || {};

          detailPostSubs.state = {
            ...detailPostSubs.state,
            [`comment-${_id}`]: {
              ...comment,
            },
          };

          return (
            <Fragment key={`${_id}-${index}`}>
              <DetailComment
                comment={comment}
                commentId={_id}
                postId={postId}
              />
            </Fragment>
          );
        })}

        {posting && (
          <DetailComment tempComment={tempComment} posting={posting} />
        )}
      </div>

      {loading && <SpinnerLoading className={`mt-4`} />}
    </BaseModal>
  );
}

export default ModalCommentPost;
