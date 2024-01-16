import {
  CommentOutlined,
  DeleteOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { listPostSubs } from "./ListPost";
import { useAuthUser } from "../../hooks/useAuthUser";

function DetailPost(props) {
  const { post, isAuthorOfPost } = props;
  const { openModal } = useModal();
  const { infoUser } = useAuthUser();
  const {
    upvotes: usersLiked = [],
    _id: postId = "",
    avaUrl = "",
    imageUrl = "",
    username = "",
    description = "",
  } = post || {};

  const { _id: userId = "" } = infoUser || {};

  const handleLike = () => {};

  const handleComment = () => {};

  console.log("===>post:", post);

  return (
    <div className="card-detail-post">
      <div className="header">
        <div className="info-user">
          <div
            className="avatar"
            style={{ backgroundImage: `url(${avaUrl})` }}
          />
          <div className="name">{username}</div>
        </div>
        {isAuthorOfPost && (
          <DeleteOutlined
            onClick={() => {
              openModal("CONFIRM_DELETE_POST");
              listPostSubs.state = {
                ...listPostSubs.state,
                postIdDelete: postId,
              };
            }}
            className="icon-delete"
          />
        )}
      </div>
      <div
        className="description"
        dangerouslySetInnerHTML={{
          __html: description.replace(/\n/g, "<br/>"),
        }}
      />
      {imageUrl && (
        <div className="image">
          <img src={imageUrl} />
        </div>
      )}
      <hr />

      <Flex gap={"8px"} className="none-copy">
        <Flex
          border
          gap={"8px"}
          className={`btn-like-comment ${
            usersLiked.includes(userId) ? "liked" : ""
          }`}
          justify="center"
          onClick={handleLike}
        >
          <LikeOutlined style={{ height: "20px" }} />
          <span style={{ height: "20px" }}>Like</span>
        </Flex>

        <Flex border gap={"8px"} className="btn-like-comment" justify="center">
          <CommentOutlined style={{ height: "20px" }} />
          <span style={{ height: "20px" }}>Comment</span>
        </Flex>
      </Flex>
    </div>
  );
}

export default DetailPost;
