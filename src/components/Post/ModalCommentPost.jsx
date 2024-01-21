/* eslint-disable react-hooks/rules-of-hooks */
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useState } from "react";
import BaseModal from "../../Modals/BaseModal";
import { SpinnerLoading } from "../../screens/Home/HomeContent";
import { addCommentToPost, getCommentsInPost } from "../../services/api";
import { SOURCE_IMAGE_SEND } from "../../utils/constant";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { scrollToBottomOfElement } from "../../utils/utilities";
import DetailPost from "./DetailPost";

export const ButtonSend = ({ disabled, onClick }) => {
  return (
    <div
      onClick={() => !disabled && onClick()}
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
    infoUser: { avaUrl, username: currentUserName, _id: userId },
  } = useAuthUser();
  const {
    state: {
      [postId]: post,
      [postId]: { comments, loading },
    },
    setState,
  } = useSubscription(detailPostSubs, [postId]);
  const initValueComment = {
    avaUrl: "",
    content: "",
    createdAt: "",
    ownerId: "",
    postId: "",
    updatedAt: "",
    username: "",
  };
  const [valueComment, setValueComment] = useState(initValueComment);

  useEffect(() => {
    postId && !comments.length && fetchCommentsInPost();
  }, []);

  const fetchCommentsInPost = async () => {
    scrollToBottomOfElement(postId);
    setState({
      [postId]: {
        ...post,
        loading: true,
      },
    });

    const resComments = await getCommentsInPost(postId).catch((err) => {
      console.error("===> Error fetchCommentsInPost:", err);
      return [];
    });

    setState({
      [postId]: {
        ...post,
        loading: false,
        comments: resComments || [],
      },
    });
  };

  const handlePostComment = async () => {
    try {
      setState({
        [postId]: {
          ...post,
          loading: true,
        },
      });

      const resAddComment = await addCommentToPost({
        postId,
        ownerId: userId,
        ...valueComment,
      }).catch((error) => {
        console.error("===>Error handlePostComment:", error);
        return [];
      });

      setState({
        [postId]: {
          ...post,
          loading: false,
          comments: [...comments, resAddComment || []],
        },
      });
      setValueComment(initValueComment);
      scrollToBottomOfElement(postId);
    } catch (error) {
      console.error("===>Error handlePostComment", error);
      message.error("Server error!");
    }
  };

  const onChangeComment = (content) => {
    setValueComment({
      content,
      username: currentUserName,
      time: Date.now(),
    });
  };

  return (
    <BaseModal
      width={700}
      open={openComment}
      onCancel={() => setOpenComment(false)}
      title={`Post by ${username}`}
      footer={<></>}
      className="modal-comment-post"
      style={{ top: 20, position: "relative" }}
    >
      <div
        style={{ overflowY: "scroll", maxHeight: "calc(100vh - 150px)" }}
        id={postId}
      >
        <DetailPost
          {...props}
          loop={true}
          openedComment={false}
          hasDelete={false}
        />
        <hr className="gray" />

        {comments?.map((comment, index) => {
          const { content } = comment || {};
          return (
            <div
              key={`${comment}-${index}`}
              style={{
                display: "grid",
                gap: "16px",
              }}
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br/>"),
              }}
            />
          );
        })}

        {loading && <SpinnerLoading className={`mt-4`} />}

        <div className="box-comment-post">
          <Flex gap={12}>
            <div
              className="avatar"
              style={{ backgroundImage: `url(${avaUrl})` }}
            />
            <textarea
              value={valueComment.content}
              onChange={(e) => onChangeComment(e.target.value)}
              rows={4}
              placeholder="Write your comment..."
              className="input-comment"
            ></textarea>
            <ButtonSend
              onClick={handlePostComment}
              disabled={!valueComment.content.trim() || loading}
            />
          </Flex>
        </div>
        <div style={{ minHeight: "110px" }} />
      </div>
    </BaseModal>
  );
}

export default ModalCommentPost;
