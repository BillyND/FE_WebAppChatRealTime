/* eslint-disable react-hooks/rules-of-hooks */
import { Flex, message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import BaseModal from "../../UI/BaseModal";
import { SpinnerLoading } from "../../screens/Home/HomeContent";
import { SOURCE_IMAGE_SEND } from "../../utils/constant";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import DetailPost from "./DetailPost";
import { useSubscription } from "global-state-hook";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { addCommentToPost, getCommentsInPost } from "../../services/api";
import { scrollToBottomOfElement } from "../../utils/utilities";
import { UserThumbnail } from "../../UI/UserThumbnail";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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

const DetailComment = (props) => {
  const { comment, infoUser, posting } = props;
  const { avaUrl, username, _id: userId } = infoUser || {};
  const { content, ownerId } = comment;
  const isOwnerOfComment = userId === ownerId;

  return (
    <Flex gap={12}>
      <UserThumbnail avaUrl={avaUrl} size={32} />
      <div className="wrap-detail-comment">
        <Flex gap={6}>
          {isOwnerOfComment && (
            <div className="control-comment  none-copy">
              <DeleteOutlined className="control-delete cursor-pointer" />
              <EditOutlined className="control-edit cursor-pointer" />
            </div>
          )}
          <div>
            <div className="detail-comment">
              <span className="owner-name">{username}</span>
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                }}
                dangerouslySetInnerHTML={{
                  __html: content.replace(/\n/g, "<br/>"),
                }}
              />{" "}
            </div>
            <span className="sub-content-comment px-2">
              {posting ? "Writing ..." : "1 minutes"}
            </span>
          </div>
        </Flex>
      </div>
    </Flex>
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
    infoUser,
    infoUser: { avaUrl, _id: userId },
  } = useAuthUser();
  const {
    state: { [postId]: post },
    setState,
  } = useSubscription(detailPostSubs, [postId]);
  const { comments, loading, posting, tempComment } = post;
  const [valueComment, setValueComment] = useState("");

  useEffect(() => {
    postId && fetchCommentsInPost();
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
      message.error("Server error!");
    }
  };

  const handlePostComment = async () => {
    try {
      const tempComment = valueComment;
      setState({
        [postId]: {
          ...post,
          posting: true,
          tempComment,
        },
      });
      setValueComment("");
      scrollToBottomOfElement(postId);

      const resAddComment =
        (await addCommentToPost({
          postId,
          ownerId: userId,
          content: tempComment,
        })) || [];

      setState({
        [postId]: {
          ...post,
          posting: false,
          comments: [...comments, resAddComment],
        },
      });

      setValueComment("");
      scrollToBottomOfElement(postId);
    } catch (error) {
      console.error("===>Error handlePostComment", error);
      message.error("Server error!");
    }
  };

  return (
    <BaseModal
      width={700}
      open={openComment}
      onCancel={() => setOpenComment(false)}
      title={`Post by ${username}`}
      footer={
        <>
          <div className="box-comment-post">
            <Flex gap={12}>
              <UserThumbnail avaUrl={avaUrl} size={32} />
              <textarea
                value={valueComment}
                onChange={(e) => setValueComment(e.target.value)}
                rows={4}
                placeholder="Write your comment..."
                className="input-comment"
              ></textarea>
              <ButtonSend
                onClick={handlePostComment}
                disabled={!valueComment.trim() || loading || posting}
              />
            </Flex>
          </div>
          <div style={{ minHeight: "110px" }} />
        </>
      }
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
              <DetailComment comment={comment} infoUser={infoUser} />
            </Fragment>
          );
        })}

        {posting && (
          <DetailComment
            comment={{
              content: tempComment,
              ownerId: infoUser._id,
            }}
            infoUser={infoUser}
            posting={posting}
          />
        )}
      </div>

      {loading && <SpinnerLoading className={`mt-4`} />}
    </BaseModal>
  );
}

export default ModalCommentPost;
