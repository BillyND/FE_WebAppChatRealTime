import React, { useState } from "react";
import BaseModal from "../../Modals/BaseModal";
import { SpinnerLoading } from "../../screens/Home/HomeContent";
import DetailPost from "./DetailPost";

function ModalCommentPost(props) {
  const {
    openComment,
    setOpenComment,
    post: { username, postId },
  } = props;
  const [loadingComment, setLoadingComment] = useState(false);

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
      <DetailPost
        {...props}
        loop={true}
        openedComment={false}
        hasDelete={false}
      />
      <hr className="gray" />
      <SpinnerLoading className={`mt-4 ${loadingComment ? "show" : "hide"}`} />
      <textarea style={{ position: "absolute", bottom: 0 }}></textarea>
    </BaseModal>
  );
}

export default ModalCommentPost;
