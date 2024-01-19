import { Modal } from "antd";
import React, { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
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
    <Modal
      style={{ top: 40 }}
      title={`Post by ${username}`}
      open={openComment}
      onCancel={() => setOpenComment(false)}
      footer={<></>}
      className="modal-comment-post"
      width={700}
    >
      <PerfectScrollbar style={{ overflowY: "scroll", maxHeight: "70vh" }}>
        <DetailPost
          {...props}
          loop={true}
          openedComment={false}
          hasDelete={false}
        />
        <hr className="gray" />

        <SpinnerLoading
          className={`pt-4 ${loadingComment ? "show" : "hide"}`}
        />
      </PerfectScrollbar>
    </Modal>
  );
}

export default ModalCommentPost;
