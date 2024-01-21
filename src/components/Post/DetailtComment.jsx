import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import React, { useState } from "react";
import { UserThumbnail } from "../../UI/UserThumbnail";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { formatTimeAgo } from "../../utils/utilities";
import ModalDeleteComment from "./ModalDeleteComment";

export const DetailComment = (props) => {
  const { comment, posting, postId } = props;
  const {
    infoUser: { avaUrl, _id: userId, username: currentUserName },
  } = useAuthUser();
  const {
    _id: commentId,
    content,
    ownerId = userId,
    createdAt,
    username = currentUserName,
  } = comment;
  const [openDelete, setOpenDelete] = useState(false);
  const isOwnerOfComment = userId === ownerId;

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
            {isOwnerOfComment && (
              <div className="control-comment  none-copy">
                <DeleteOutlined
                  className="control-delete cursor-pointer"
                  onClick={() => commentId && setOpenDelete(true)}
                />
                <EditOutlined className="control-edit cursor-pointer" />
              </div>
            )}
            <div>
              <div className="detail-comment">
                <span className="owner-name">{username}</span>
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: content.replace(/\n/g, "<br/>"),
                  }}
                />
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
