import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import PopoverCustom from "@UI//PopoverCustom";
import {
  IconDash,
  IconHeartActive,
  IconHeartDeActive,
  IconMessageActive,
} from "@assets/icons/icon";
import { updateLikeOfPost } from "@services/api";
import { TIME_DELAY_FETCH_API } from "@utils/constant";
import {
  detailPostSubs,
  listPostSubs,
  previewImageFullScreenSubs,
  socketIoSubs,
} from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { openModalWithOutRender } from "@utils/hooks/useModal";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import {
  formatTimeAgo,
  handleHiddenPost,
  handleUpdatePostSocket,
  updateCurrentPost,
} from "@utils/utilities";
import ModalCommentPost from "./ModalCommentPost";
import { StyledMenuDetailPost, WrapDetailPost } from "./StyledPost";
import PreviewImageFullScreen from "@UI//PreviewImageFullScreen";
import { UserThumbnail } from "@UI//UserThumbnail";
import { useStyleApp } from "@utils/hooks/useStyleApp";

const DetailPost = (props) => {
  const { postId, loop, isAuthorOfPost } = props;
  const {
    state: { [`post-${postId}`]: post },
    setState,
  } = useSubscription(detailPostSubs, [`post-${postId}`]);
  const {
    infoUser: { _id: userId },
  } = useAuthUser();
  const {
    likerIds = [],
    avaUrl = "",
    imageUrl = "",
    username = "",
    description = "",
    countComment,
    createdAt,
  } = post;
  const [openComment, setOpenComment] = useState(false);
  const {
    styleApp: { type },
  } = useStyleApp();
  const { isMobile } = useWindowSize();
  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);

  useEffect(() => {
    socketIo.on("getPost", (post) => {
      handleUpdatePostSocket(
        {
          ...post,
          currentSocketId: socketIo?.id,
        },
        postId,
        ["likerIds"]
      );
    });
  }, [socketIo]);

  const handleLike = async () => {
    // If the user ID is in likerIds, remove it; otherwise, add it
    const updatedLikerIds = likerIds.includes(userId)
      ? likerIds.filter((liker) => liker !== userId)
      : [...post.likerIds, userId];

    // detailPostSubs.setState({
    //   [`post-${postId}`]: { ...post, likerIds: updatedLikerIds },
    // });

    updateCurrentPost({ ...post, likerIds: updatedLikerIds });

    // Assuming `updateLikeOfPost` is a function that takes `postId` as a parameter
    debounceUpdateLikes(postId, updatedLikerIds);

    socketIo.emit("updatePost", {
      ...post,
      likerIds: updatedLikerIds,
      userId,
    });
  };

  const debounceUpdateLikes = useCallback(
    debounce(async (postId) => {
      await updateLikeOfPost(postId);
    }, TIME_DELAY_FETCH_API),
    []
  );

  const dataMenuDetailPost = [
    {
      id: "hidden",
      label: "Hidden",
      onclick: () => {
        handleHiddenPost(postId);
      },
    },
    {
      id: "edit",
      label: "Edit",
      hidden: !isAuthorOfPost,
      onclick: () => {
        openModalWithOutRender("MODAL_NEW_POST");

        detailPostSubs.state = {
          ...detailPostSubs.state,
          postHasUpdate: post,
        };
      },
    },
    {
      id: "delete",
      label: "Delete",
      hidden: !isAuthorOfPost,
      critical: true,
      onclick: () => {
        openModalWithOutRender("CONFIRM_DELETE_POST");

        listPostSubs.state = {
          ...listPostSubs.state,
          postIdDelete: postId,
        };
      },
    },
  ];

  const wrapMenuDetailPost = (
    <StyledMenuDetailPost>
      {dataMenuDetailPost.map((item, index) => {
        const { id, label, critical, onclick, hidden } = item;

        if (hidden) return null;
        return (
          <Fragment key={id}>
            {index > 0 && <hr className="boundary-line-item" />}

            <div
              className={`item-menu ${critical && "critical"}`}
              onClick={() => onclick && onclick()}
            >
              {label}
            </div>
          </Fragment>
        );
      })}
    </StyledMenuDetailPost>
  );

  return (
    <WrapDetailPost type={type} isMobile={isMobile}>
      <div className="header">
        <Flex justify="space-between" gap={8} align="center">
          <UserThumbnail avaUrl={avaUrl} />
          <div className="name">{username}</div>
        </Flex>

        <Flex gap={10} justify="center" align="center">
          <div className="time-post">{formatTimeAgo(createdAt)}</div>

          <PopoverCustom
            placement="bottomRight"
            content={wrapMenuDetailPost}
            trigger="click"
          >
            <div className="icon-more-detail">
              <IconDash />
            </div>
          </PopoverCustom>
        </Flex>
      </div>

      <Flex gap={24} className="none-copy">
        <div className="line-left-post" />

        <Flex gap={8} vertical style={{ width: "100%" }}>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html: description.replace(/\n/g, "<br/>"),
            }}
          />

          {imageUrl && (
            <div className="image">
              <PreviewImageFullScreen />
              <img
                draggable={false}
                src={imageUrl}
                className="img-post cursor-pointer transition-02"
                style={{ backgroundImage: `url(${imageUrl})` }}
                onClick={() =>
                  previewImageFullScreenSubs.updateState({ imgSrc: imageUrl })
                }
              />
            </div>
          )}

          {/* {hasFooter && ( */}
          <Flex gap={16} className="none-copy">
            <Flex
              gap={"8px"}
              className={`btn-like-comment ${
                likerIds?.length > 0 && likerIds?.includes(userId)
                  ? "liked"
                  : ""
              }`}
              justify="center"
              align="center"
              onClick={handleLike}
            >
              {likerIds?.includes(userId) ? (
                <IconHeartActive size={1.5} />
              ) : (
                <IconHeartDeActive size={1.5} />
              )}
            </Flex>

            <Flex
              gap={"8px"}
              className="btn-like-comment"
              justify="center"
              align="center"
              onClick={() => setOpenComment(true)}
            >
              <IconMessageActive size={1.5} />
            </Flex>
          </Flex>
          {/* )} */}

          <Flex gap={8}>
            {countComment > 0 && (
              <a
                className="count-reaction"
                onClick={() => setOpenComment(true)}
              >
                {`${countComment} ${countComment > 1 ? "comments" : "comment"}`}
              </a>
            )}
            {countComment > 0 && likerIds.length > 0 && (
              <span className="count-reaction">&#x2022;</span>
            )}
            {likerIds.length > 0 && (
              <span className="count-reaction">
                {`${likerIds.length} ${likerIds.length > 1 ? "likes" : "like"}`}{" "}
              </span>
            )}
          </Flex>
        </Flex>
      </Flex>

      {!loop && (
        <ModalCommentPost
          post={post}
          {...props}
          hasFooter={false}
          openComment={openComment}
          setOpenComment={setOpenComment}
        />
      )}
    </WrapDetailPost>
  );
};
export default DetailPost;
