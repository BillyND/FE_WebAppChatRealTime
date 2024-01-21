import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect } from "react";
import BaseModal from "../../UI/BaseModal";
import { SpinnerLoading } from "../../screens/Home/HomeContent";
import { getCommentsInPost } from "../../services/api";
import { SOURCE_IMAGE_SEND } from "../../utils/constant";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { showPopupError } from "../../utils/utilities";
import DetailPost from "./DetailPost";
import { DetailComment } from "./DetailtComment";
import { FooterComment } from "./FooterComment";

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
    state: { [postId]: post },
    setState,
  } = useSubscription(detailPostSubs, [postId]);
  const { comments, loading, posting, tempComment = "" } = post;

  useEffect(() => {
    postId && fetchCommentsInPost();
    detailPostSubs.state.commentEdit = null;
  }, []);

  const fetchCommentsInPost = async () => {
    setState({
      [postId]: {
        ...post,
        loading: true,
      },
    });

    try {
      const resComments = (await getCommentsInPost(postId)) || [];

      setState({
        [postId]: {
          ...post,
          loading: false,
          comments: resComments,
        },
      });
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
      className="modal-comment-post"
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
          return (
            <Fragment key={`${comment?._id}-${index}`}>
              <DetailComment comment={comment} postId={postId} />
            </Fragment>
          );
        })}

        {posting && (
          <DetailComment
            comment={{
              content: tempComment,
            }}
            posting={posting}
          />
        )}
      </div>

      {loading && <SpinnerLoading className={`mt-4`} />}
    </BaseModal>
  );
}

export default ModalCommentPost;
