import {
  CommentOutlined,
  DeleteOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Flex } from "antd";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { updateLikeOfPost } from "../../services/api";
import { SOURCE_IMAGE_LIKED, TIME_DELAY_FETCH_API } from "../../utils/constant";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useModal } from "../../utils/hooks/useModal";
import { listPostSubs } from "./ListPost";

function DetailPost(props) {
  const { post, isAuthorOfPost } = props;
  const [currentPost, setCurrentPost] = useState(post || {});
  const { openModal } = useModal(["CONFIRM_DELETE_POST"]);
  const { infoUser } = useAuthUser();
  const {
    likerIds = [],
    _id: postId = "",
    avaUrl = "",
    imageUrl = "",
    username = "",
    description = "",
  } = currentPost;
  const { _id: userId = "" } = infoUser || {};

  const handleLike = async () => {
    const updatedLikerIds = likerIds.includes(userId)
      ? likerIds.filter((liker) => liker !== userId)
      : [...likerIds, userId];

    setCurrentPost((prev) => {
      return {
        ...prev,
        likerIds: updatedLikerIds,
      };
    });

    // Assuming `updateLikeOfPost` is a function that takes `postId` as a parameter
    debounceUpdateLikes(postId);
  };

  const debounceUpdateLikes = useCallback(
    debounce((postId) => {
      updateLikeOfPost(postId);
    }, TIME_DELAY_FETCH_API),
    []
  );

  const handleComment = () => {};

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
          <img src={imageUrl} loading="lazy" />
        </div>
      )}
      <div>
        {likerIds.length > 0 && (
          <Flex
            gap={"8px"}
            className="pb-1 cursor-pointer button-list-liker-post none-copy"
            align="center"
            justify="center"
          >
            <img width={18} src={SOURCE_IMAGE_LIKED} />
            <a className="text-disabled">{likerIds.length}</a>
          </Flex>
        )}

        <hr />
        <Flex gap={"8px"} className="none-copy">
          <Flex
            gap={"8px"}
            className={`btn-like-comment ${
              likerIds?.length > 0 && likerIds?.includes(userId) ? "liked" : ""
            }`}
            justify="center"
            onClick={handleLike}
          >
            <LikeOutlined style={{ height: "20px" }} />
            <span style={{ height: "20px" }}>Like</span>
          </Flex>

          <Flex gap={"8px"} className="btn-like-comment" justify="center">
            <CommentOutlined style={{ height: "20px" }} />
            <span style={{ height: "20px" }}>Comment</span>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

export default DetailPost;
