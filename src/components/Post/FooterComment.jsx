import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { UserThumbnail } from "../../UI/UserThumbnail";
import { addCommentToPost } from "../../services/api";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { scrollToBottomOfElement, showPopupError } from "../../utils/utilities";
import { ButtonSend } from "./ModalCommentPost";

export const InputComment = (props) => {
  const {
    refInput,
    value,
    setValue,
    setFocus = () => {},
    onUpdate,
    loading,
    posting,
    focus,
    onBlur,
    subControl,
  } = props;
  const modalElement = document.querySelector(".ant-modal-content");
  const modalWidth = modalElement?.getBoundingClientRect()?.width;

  useEffect(() => {
    focus && refInput?.current?.focus();
  }, [focus]);

  return (
    <>
      <textarea
        onFocus={() => setFocus(true)}
        onBlur={onBlur}
        ref={refInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        placeholder="Write your comment..."
        className={`input-comment ${focus ? "full" : "mini"}`}
        style={{
          minWidth: `${modalWidth - 120}px`,
        }}
      />
      <Flex justify="end" align="center" gap={8}>
        <ButtonSend
          onClick={onUpdate}
          disabled={!value.trim() || loading || posting}
        />
        {subControl}
      </Flex>
    </>
  );
};

export const FooterComment = (props) => {
  const { postId } = props;
  const {
    infoUser: { avaUrl, _id: userId },
  } = useAuthUser();
  const {
    state: { [postId]: post },
    setState,
  } = useSubscription(detailPostSubs, [postId]);
  const { comments, loading, posting, tempComment = "" } = post;
  const [localValueComment, setLocalValue] = useState(tempComment);
  const refInputComment = useRef(null);
  const [focusInput, setFocusInput] = useState(false);

  useEffect(() => {
    if (focusInput) {
      refInputComment.current?.focus();
    }
  }, [focusInput]);

  const handlePostComment = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setState({
        [postId]: {
          ...post,
          posting: true,
          tempComment: localValueComment,
        },
      });
      setLocalValue("");
      scrollToBottomOfElement(postId);
      focusInput && setFocusInput(true);

      const resAddComment =
        (await addCommentToPost({
          postId,
          ownerId: userId,
          content: localValueComment,
        })) || [];

      setState({
        [postId]: {
          ...post,
          posting: false,
          comments: [...comments, resAddComment],
          countComment: [...comments, resAddComment].length,
        },
      });
    } catch (error) {
      console.error("===>Error handlePostComment", error);
      showPopupError();
    }
  };

  return (
    <>
      <div className={`box-comment-post real ${focusInput ? "full" : "mini"}`}>
        <Flex gap={12}>
          <UserThumbnail avaUrl={avaUrl} size={32} />
          <InputComment
            refInput={refInputComment}
            value={localValueComment}
            setFocus={setFocusInput}
            setValue={setLocalValue}
            loading={loading}
            posting={posting}
            onUpdate={handlePostComment}
            focus={focusInput}
            onBlur={() => setFocusInput(false)}
          />
        </Flex>
      </div>
      <div
        className={`box-comment-post ${focusInput ? "full" : "mini"}`}
        style={{ position: "static" }}
      />
    </>
  );
};
