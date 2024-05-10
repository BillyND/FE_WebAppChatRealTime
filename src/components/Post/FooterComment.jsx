import { UserThumbnail } from "@UI/UserThumbnail";
import { addCommentToPost } from "@services/api";
import { detailPostSubs } from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import {
  scrollToBottomOfElement,
  showPopupError,
  updateCurrentPost,
} from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { ButtonSend } from "./ModalCommentPost";

export const InputComment = (props) => {
  const {
    refInput,
    value,
    setValue,
    onFocus,
    onUpdate,
    loading,
    posting,
    focus,
    onBlur,
    subControl,
  } = props;

  const isDisableButtonSend = !value.trim() || loading || posting;

  useEffect(() => {
    focus && refInput?.current?.focus();
  }, [focus]);

  return (
    <Flex style={{ width: "100%" }} align="center" gap={8}>
      <textarea
        autoComplete="off"
        maxLength={8000}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={refInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        placeholder="Type a comment..."
        className={`input-comment ${focus || value.trim() ? "full" : "mini"}`}
        style={{
          minWidth: `calc(100% - 55px)`,
        }}
      />

      <div
        style={{ minWidth: "80px" }}
        className={`${isDisableButtonSend ? "" : "press-active"}`}
      >
        <ButtonSend onClick={onUpdate} disabled={isDisableButtonSend} />

        {subControl}
      </div>
    </Flex>
  );
};

export const FooterComment = (props) => {
  const { postId, openComment } = props;
  const {
    infoUser: { avaUrl, _id: userId },
  } = useAuthUser();
  const {
    state: { [`post-${postId}`]: post },
  } = useSubscription(detailPostSubs, [`post-${postId}`]);
  const { comments, loading, posting, tempComment = "" } = post;
  const [localValueComment, setLocalValue] = useState(tempComment);
  const refInputComment = useRef(null);
  const [focusInput, setFocusInput] = useState(true);

  const handlePostComment = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      updateCurrentPost({
        ...post,
        posting: true,
        tempComment: localValueComment,
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

      updateCurrentPost({
        ...post,
        posting: false,
        comments: [...comments, resAddComment],
        countComment: [...comments, resAddComment].length,
      });
    } catch (error) {
      console.error("===>Error handlePostComment", error);
      showPopupError();
    }
  };

  return (
    <Flex gap={12} align="center">
      <UserThumbnail avaUrl={avaUrl} size={38} />
      <InputComment
        refInput={refInputComment}
        value={localValueComment}
        setValue={setLocalValue}
        loading={loading}
        posting={posting}
        onUpdate={handlePostComment}
        focus={focusInput}
        onFocus={() => setFocusInput(true)}
        onBlur={() => setFocusInput(false)}
      />
    </Flex>
  );
};
