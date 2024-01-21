import { useSubscription } from "global-state-hook";
import React, { useState } from "react";
import BaseModal from "../../UI/BaseModal";
import { deleteCommentOfPost } from "../../services/api";
import { detailPostSubs } from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { showPopupError } from "../../utils/utilities";

function ModalDeleteComment(props) {
  const { openDelete, setOpenDelete, commentId, postId } = props;
  const {
    infoUser: { _id: userId },
  } = useAuthUser();
  const {
    state: { [postId]: post },
    setState,
  } = useSubscription(detailPostSubs, [postId]);
  const { comments = [] } = post || {};
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDeleteComment = async () => {
    try {
      setLoadingDelete(true);

      deleteCommentOfPost({
        commentId,
        ownerId: userId,
      }) || [];

      const newListComment = comments.filter(
        (comment) => comment._id !== commentId
      );

      setState({
        [postId]: {
          ...post,
          comments: newListComment,
          countComment: newListComment.length,
        },
      });

      setLoadingDelete(false);
      setOpenDelete(false);
    } catch (error) {
      console.error("===>Error handleDeleteComment:", error);
      showPopupError();
    }
  };

  return (
    <BaseModal
      title="Delete comments?"
      open={openDelete}
      onCancel={() => setOpenDelete(false)}
      onOk={handleDeleteComment}
      loadingFooter={loadingDelete}
    >
      Are you sure you want to delete this comment?
    </BaseModal>
  );
}

export default ModalDeleteComment;
