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
import { updateLikeOfPost } from "../../services/api";
import { debounce } from "lodash";
import {
  SOURCE_IMAGE_LIKED,
  TIME_DELAY_SEARCH_INPUT,
} from "../../constants/ConstantHomePage";

function DetailPost(props) {
  const { post, isAuthorOfPost } = props;
  const { openModal } = useModal();
  const { infoUser } = useAuthUser();
  const {
    likerIds = [],
    _id: postId = "",
    avaUrl = "",
    imageUrl = "",
    username = "",
    description = "",
  } = post || {};

  const { _id: userId = "" } = infoUser || {};

  const handleLike = async () => {
    const { listPost } = listPostSubs.state;

    const updatedList = listPost.map((post) => {
      // Check if the post ID matches the target post ID
      if (post?._id === postId) {
        // If the user ID is in likerIds, remove it; otherwise, add it
        const updatedLikerIds = likerIds.includes(userId)
          ? likerIds.filter((liker) => liker !== userId)
          : [...post.likerIds, userId];

        return {
          ...post,
          likerIds: updatedLikerIds,
        };
      }
      // If the post ID does not match the target post ID, return the original post
      return post;
    });

    // Assume this function updates the state with the new list of posts
    listPostSubs.updateState({
      listPost: updatedList,
    });

    // Assuming `updateLikeOfPost` is a function that takes `postId` as a parameter
    (function () {
      const debouncedUpdateLike = debounce(() => {
        updateLikeOfPost(postId);
      }, TIME_DELAY_SEARCH_INPUT);

      debouncedUpdateLike();
    })();
  };

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
            border
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

          <Flex
            border
            gap={"8px"}
            className="btn-like-comment"
            justify="center"
          >
            <CommentOutlined style={{ height: "20px" }} />
            <span style={{ height: "20px" }}>Comment</span>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

export default DetailPost;
