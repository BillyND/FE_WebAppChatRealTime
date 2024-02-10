import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { addCommentToPost } from "../../services/api";
import { detailPostSubs } from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import {
  scrollToBottomOfElement,
  showPopupError,
  updateCurrentPost,
} from "@utils/utilities";
import { ButtonSend } from "./ModalCommentPost";
import { UserThumbnail } from "@UI//UserThumbnail";

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

  useEffect(() => {
    focus && refInput?.current?.focus();
  }, [focus]);

  return (
    <Flex style={{ width: "100%" }} align="start" gap={8}>
      <textarea
        maxLength={8000}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={refInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={1}
        placeholder="Write your comment..."
        className={`input-comment ${focus || value.trim() ? "full" : "mini"}`}
        style={{
          minWidth: `calc(100% - 50px)`,
        }}
      />

      <div style={{ minWidth: "80px" }}>
        <ButtonSend
          onClick={onUpdate}
          disabled={!value.trim() || loading || posting}
        />

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
    <Flex gap={12}>
      <UserThumbnail avaUrl={avaUrl} size={32} />
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
