import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { UserThumbnail } from "../../UI/UserThumbnail";
import { updateCommentOfPost } from "../../services/api";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useDebounce } from "../../utils/hooks/useDebounce";
import {
  formatTimeAgo,
  handleUpdateCommentSocket,
  showPopupError,
} from "../../utils/utilities";
import { InputComment } from "./FooterComment";
import ModalDeleteComment from "./ModalDeleteComment";

let timerQueryWithModal;

export const DetailComment = (props) => {
  const { posting, postId, commentId, tempComment } = props;
  const {
    infoUser: { avaUrl, _id: userId, username: currentUserName },
  } = useAuthUser();
  const {
    state: { [`comment-${commentId}`]: comment = {}, commentEdit },
    setState,
  } = useSubscription(detailPostSubs, [`comment-${commentId}`, "commentEdit"]);
  const {
    content = tempComment,
    ownerId = userId,
    createdAt,
    username = currentUserName,
  } = comment;
  const [openDelete, setOpenDelete] = useState(false);
  const isOwnerOfComment = userId === ownerId;
  const [localValueComment, setLocalValue] = useState("");
  const isEdit = commentEdit === commentId;
  const refInputComment = useRef(null);
  const debounceContent = useDebounce(content, TIME_DELAY_SEARCH_INPUT / 2);
  const [widthModal, setWithModal] = useState(0);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("getComment", (comment) => {
      handleUpdateCommentSocket(comment, commentId);
    });
  }, []);

  useEffect(() => {
    clearTimeout(timerQueryWithModal);

    timerQueryWithModal = setTimeout(() => {
      const modalCommentPost = document.querySelector(".modal-comment-post");
      setWithModal(modalCommentPost?.getBoundingClientRect()?.width);
    }, TIME_DELAY_SEARCH_INPUT);
  });

  useEffect(() => {
    setLocalValue(debounceContent.trim());
  }, [debounceContent]);

  const handleUpdateComment = async () => {
    try {
      detailPostSubs.state.commentEdit = null;

      const updateComment = {
        ...comment,
        content: localValueComment,
      };

      setState({
        [`comment-${commentId}`]: updateComment,
      });

      const resUpdateComment = await updateCommentOfPost({
        commentId,
        ownerId: userId,
        content: localValueComment.trim(),
      });

      socketRef.current.emit("updateComment", resUpdateComment.data);
    } catch (error) {
      showPopupError();
    }
  };

  const handleCancelEdit = () => {
    setState({
      commentEdit: null,
    });
  };

  return (
    <>
      <ModalDeleteComment
        postId={postId}
        commentId={commentId}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <Flex gap={12}>
        <UserThumbnail avaUrl={avaUrl} size={32} />
        <div className="wrap-detail-comment">
          <Flex gap={6}>
            {isOwnerOfComment && !isEdit && (
              <div className="control-comment  none-copy">
                <DeleteOutlined
                  className={`control-delete ${
                    commentId ? "cursor-pointer" : "cursor-no-drop"
                  }`}
                  onClick={() => commentId && setOpenDelete(true)}
                />
                <EditOutlined
                  onClick={() => {
                    commentId &&
                      setState({
                        commentEdit: commentId,
                      });
                  }}
                  className={`control-edit ${
                    commentId ? "cursor-pointer" : "cursor-no-drop"
                  }`}
                />
              </div>
            )}
            <div>
              <div
                className="detail-comment"
                style={{
                  maxWidth: `${widthModal - (isOwnerOfComment ? 102 : 80)}px`,
                }}
              >
                {isEdit ? (
                  <InputComment
                    refInput={refInputComment}
                    value={localValueComment}
                    setValue={setLocalValue}
                    onUpdate={handleUpdateComment}
                    focus={true}
                    subControl={
                      localValueComment.trim() && (
                        <a
                          className="cancel-edit-comment"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </a>
                      )
                    }
                  />
                ) : (
                  <>
                    <span className="owner-name">{username}</span>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content.replace(/\n/g, "<br/>"),
                      }}
                    />
                  </>
                )}
              </div>
              <span className="sub-content-comment px-2">
                {posting ? "Writing ..." : formatTimeAgo(createdAt)}
              </span>
            </div>
          </Flex>
        </div>
      </Flex>
    </>
  );
};
