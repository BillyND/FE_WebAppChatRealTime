import { CommentOutlined, LikeOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import PopoverCustom from "../../UI/PopoverCustom";
import { UserThumbnail } from "../../UI/UserThumbnail";
import {
  IconDash,
  IconHeartActive,
  IconHeartDeActive,
  IconMessageActive,
} from "../../assets/icons/icon";
import { updateLikeOfPost } from "../../services/api";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";
import {
  detailPostSubs,
  listPostSubs,
} from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { openModalWithOutRender } from "../../utils/hooks/useModal";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import {
  formatTimeAgo,
  handleHiddenPost,
  handleUpdatePostSocket,
  mergeDataPostToListPost,
} from "../../utils/utilities";
import ModalCommentPost from "./ModalCommentPost";
import { StyledMenuDetailPost, WrapDetailPost } from "./StyledPost";

const DetailPost = (props) => {
  const {
    postId,
    hasDelete = true,
    hasFooter = true,
    loop,
    isAuthorOfPost,
  } = props;
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
  const socketRef = useRef();
  const {
    styleApp: { type },
  } = useStyleApp();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("getPost", (post) => {
      handleUpdatePostSocket(
        {
          ...post,
          currentSocketId: socketRef.current?.id,
        },
        postId,
        ["likerIds"]
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleLike = async () => {
    // If the user ID is in likerIds, remove it; otherwise, add it
    const updatedLikerIds = likerIds.includes(userId)
      ? likerIds.filter((liker) => liker !== userId)
      : [...post.likerIds, userId];

    setState({
      [`post-${postId}`]: { ...post, likerIds: updatedLikerIds },
    });

    mergeDataPostToListPost({ ...post, likerIds: updatedLikerIds });

    // Assuming `updateLikeOfPost` is a function that takes `postId` as a parameter
    debounceUpdateLikes(postId, updatedLikerIds);
  };

  const debounceUpdateLikes = useCallback(
    debounce(async (postId, updatedLikerIds) => {
      await updateLikeOfPost(postId);

      socketRef.current.emit("updatePost", {
        ...post,
        likerIds: updatedLikerIds,
      });
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
      hidden: !(isAuthorOfPost && hasDelete),
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
      hidden: !(isAuthorOfPost && hasDelete),
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
    <WrapDetailPost type={type}>
      <div className="header">
        <div className="info-user">
          <UserThumbnail avaUrl={avaUrl} />
          <div className="name">{username}</div>
        </div>

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
        {hasFooter && <div className="line-left-post" />}

        <Flex gap={8} vertical style={{ width: "100%" }}>
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

          {hasFooter && (
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
          )}

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
