import PopoverCustom from "@UI/PopoverCustom";
import { UserThumbnail } from "@UI/UserThumbnail";
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
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import {
  formatTimeAgo,
  handleHiddenPost,
  handleUpdatePostSocket,
  updateCurrentPost,
} from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigateCustom } from "../../utils/hooks/useNavigateCustom";
import { debounce, formatHtmlToText } from "../../utils/utilities";
import ModalCommentPost from "./ModalCommentPost";
import { StyledMenuDetailPost, WrapDetailPost } from "./StyledPost";

const DetailPost = (props) => {
  const { postId, loop, isAuthorOfPost } = props;
  const {
    state: { [`post-${postId}`]: post },
  } = useSubscription(detailPostSubs, [`post-${postId}`]);
  const {
    infoUser: { _id: userId, avaUrl: currentAvaUrl },
  } = useAuthUser();
  const {
    likerIds = [],
    avaUrl = "",
    imageUrl = "",
    username = "",
    description = "",
    countComment,
    createdAt,
    userEmail,
  } = post;
  const [openComment, setOpenComment] = useState(false);
  const {
    styleApp: { type },
  } = useStyleApp();
  const { isMobile } = useWindowSize();
  const {
    state: { socketIo },
  } = useSubscription(socketIoSubs, ["socketIo"]);
  const navigate = useNavigateCustom();

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

    updateCurrentPost({ ...post, likerIds: updatedLikerIds });

    // Assuming `updateLikeOfPost` is a function that takes `postId` as a parameter
    debounceUpdateLikes(postId, updatedLikerIds);

    socketIo.emit("updatePost", {
      ...post,
      likerIds: updatedLikerIds,
      userId,
    });
  };

  const debounceUpdateLikes = debounce(async (postId) => {
    await updateLikeOfPost(postId);
  }, TIME_DELAY_FETCH_API);

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
        detailPostSubs.state.postHasUpdate = post;
      },
    },
    {
      id: "delete",
      label: "Delete",
      hidden: !isAuthorOfPost,
      critical: true,
      onclick: () => {
        openModalWithOutRender("CONFIRM_DELETE_POST");
        listPostSubs.state.postIdDelete = postId;
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
              className={`item-menu transition-01 none-copy ${
                critical && "critical"
              }`}
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
        <Flex
          justify="space-between"
          gap={8}
          align="center"
          className="cursor-pointer"
          onClick={() => navigate(`/user?email=${userEmail}`)}
        >
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
            <div className="icon-more-detail none-copy">
              <IconDash />
            </div>
          </PopoverCustom>
        </Flex>
      </div>

      <Flex gap={24}>
        <div className="line-left-post" />

        <Flex gap={8} vertical style={{ width: "100%" }}>
          <div
            className="description"
            dangerouslySetInnerHTML={{
              __html: formatHtmlToText(description),
            }}
          />

          {imageUrl && (
            <div className="image">
              <img
                draggable={false}
                src={imageUrl}
                className="img-post cursor-pointer transition-02"
                onClick={() =>
                  previewImageFullScreenSubs.updateState({ imgSrc: imageUrl })
                }
              />
            </div>
          )}

          <Flex gap={16} className="none-copy">
            <Flex
              gap={"8px"}
              className={`btn-like-comment press-active ${
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
              className="btn-like-comment press-active"
              justify="center"
              align="center"
              onClick={() => setOpenComment(true)}
            >
              <IconMessageActive size={1.5} />
            </Flex>
          </Flex>

          <Flex gap={8}>
            {countComment > 0 && (
              <a
                className="count-reaction press-active transition-01"
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
          currentAvaUrl={currentAvaUrl}
          hasFooter={false}
          openComment={openComment}
          setOpenComment={setOpenComment}
        />
      )}
    </WrapDetailPost>
  );
};
export default DetailPost;
