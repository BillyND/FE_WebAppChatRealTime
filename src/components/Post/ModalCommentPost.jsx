import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import DetailPost from "./DetailPost";
import { SpinnerLoading } from "../../screens/Home/HomeContent";

function ModalCommentPost(props) {
  const {
    openComment,
    setOpenComment,
    post: { username, postId },
  } = props;
  const [loadingComment, setLoadingComment] = useState(false);

  return (
    <Modal
      title={`Post by ${username}`}
      open={openComment}
      onCancel={() => setOpenComment(false)}
      footer={<></>}
      className="modal-comment-post"
    >
      <DetailPost
        {...props}
        loop={true}
        openedComment={false}
        hasDelete={false}
      />
      <hr className="gray" />

      <SpinnerLoading className={`pt-4 ${loadingComment ? "show" : "hide"}`} />
    </Modal>
  );
}

export default ModalCommentPost;
