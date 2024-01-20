/* eslint-disable react/display-name */
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
import ModalCommentPost from "./ModalCommentPost";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";

const DetailPost = React.memo((props) => {
  const {
    post,
    isAuthorOfPost,
    loop = false,
    hasFooter = true,
    hasDelete = true,
  } = props;
  const { listPost } = listPostSubs.state;
  const {
    infoUser: { _id: userId },
  } = useAuthUser();
  const {
    likerIds = [],
    _id: postId = "",
    avaUrl = "",
    imageUrl = "",
    username = "",
    description = "",
  } = post;
  const [openComment, setOpenComment] = useState(false);
  const { openModal } = useModal(["CONFIRM_DELETE_POST"]);

  const handleLike = async () => {
    // If the user ID is in likerIds, remove it; otherwise, add it
    const updatedLikerIds = likerIds.includes(userId)
      ? likerIds.filter((liker) => liker !== userId)
      : [...post.likerIds, userId];

    const updatedList = listPost.map((post) => {
      // Check if the post ID matches the target post ID
      if (post?._id === postId) {
        return {
          ...post,
          likerIds: updatedLikerIds,
        };
      }
      // If the post ID does not match the target post ID, return the original post
      return post;
    });

    listPostSubs.updateState({
      listPost: updatedList,
    });

    // Assuming `updateLikeOfPost` is a function that takes `postId` as a parameter
    debounceUpdateLikes(postId, updatedList);
  };

  const debounceUpdateLikes = useCallback(
    debounce((postId) => {
      updateLikeOfPost(postId);
    }, TIME_DELAY_FETCH_API),
    []
  );

  const handleComment = () => {
    openModal("MODAL_COMMENT_POST");
  };

  return (
    <div className="card-detail-post p-3">
      <div className="header">
        <div className="info-user">
          <div
            className="avatar"
            style={{ backgroundImage: `url(${avaUrl})` }}
          />
          <div className="name">{username}</div>
        </div>
        {isAuthorOfPost && hasDelete && (
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

        {hasFooter && (
          <>
            <hr className="gray" />
            <Flex gap={"8px"} className="none-copy">
              <Flex
                gap={"8px"}
                className={`btn-like-comment ${
                  likerIds?.length > 0 && likerIds?.includes(userId)
                    ? "liked"
                    : ""
                }`}
                justify="center"
                onClick={handleLike}
              >
                <LikeOutlined style={{ height: "20px" }} />
                <span style={{ height: "20px" }}>Like</span>
              </Flex>

              <Flex
                gap={"8px"}
                className="btn-like-comment"
                justify="center"
                onClick={() => setOpenComment(true)}
              >
                <CommentOutlined style={{ height: "20px" }} />
                <span style={{ height: "20px" }}>Comment</span>
              </Flex>
            </Flex>
          </>
        )}
      </div>
      {!loop && (
        <ModalCommentPost
          post={post}
          {...props}
          openComment={openComment}
          setOpenComment={setOpenComment}
        />
      )}
    </div>
  );
});
export default DetailPost;
