import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useState } from "react";
import { UserThumbnail } from "../../UI/UserThumbnail";
import { addCommentToPost } from "../../services/api";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { scrollToBottomOfElement, showPopupError } from "../../utils/utilities";
import { ButtonSend } from "./ModalCommentPost";

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

  const handlePostComment = async (value) => {
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

      setLocalValue("");
    } catch (error) {
      console.error("===>Error handlePostComment", error);
      showPopupError();
    }
  };

  return (
    <>
      <div className="box-comment-post">
        <Flex gap={12}>
          <UserThumbnail avaUrl={avaUrl} size={32} />
          <textarea
            value={localValueComment}
            onChange={(e) => setLocalValue(e.target.value)}
            rows={4}
            placeholder="Write your comment..."
            className="input-comment"
          ></textarea>
          <ButtonSend
            onClick={handlePostComment}
            disabled={!localValueComment.trim() || loading || posting}
          />
        </Flex>
      </div>
      <div style={{ minHeight: "110px" }} />
    </>
  );
};
