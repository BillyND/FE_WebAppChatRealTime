import { Flex } from "antd";
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
    <Flex style={{ width: "100%" }} align="start" gap={8}>
      <textarea
        maxLength={8000}
        onFocus={() => setFocus(true)}
        onBlur={onBlur}
        ref={refInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        placeholder="Write your comment..."
        className={`input-comment ${focus || value.trim() ? "full" : "mini"}`}
        style={{
          minWidth: `${modalWidth - 120}px`,
        }}
      />
      <Flex>
        <ButtonSend
          onClick={onUpdate}
          disabled={!value.trim() || loading || posting}
        />

        {subControl}
      </Flex>
    </Flex>
  );
};

export const FooterComment = (props) => {
  const { postId } = props;
  const {
    infoUser: { avaUrl, _id: userId },
  } = useAuthUser();
  const {
    state: { [`post-${postId}`]: post },
    setState,
  } = useSubscription(detailPostSubs, [`post-${postId}`]);
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
        [`post-${postId}`]: {
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
        [`post-${postId}`]: {
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
  );
};
