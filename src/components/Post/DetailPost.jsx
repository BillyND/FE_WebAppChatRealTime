import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Flex, Popover } from "antd";
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
import { UserThumbnail } from "../../UI/UserThumbnail";
import { updateLikeOfPost } from "../../services/api";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";
import {
  detailPostSubs,
  listPostSubs,
} from "../../utils/globalStates/initGlobalState";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { openModalWithOutRender, useModal } from "../../utils/hooks/useModal";
import { formatTimeAgo, handleUpdatePostSocket } from "../../utils/utilities";
import ModalCommentPost from "./ModalCommentPost";
import { StyledMenuDetailPost, WrapDetailPost } from "./StyledPost";
import { useStyleApp } from "../../utils/hooks/useStyleApp";
import { IconDash } from "../../assets/icons/icon";
import PopoverCustom from "../../UI/PopoverCustom";

const DetailPost = (props) => {
  const {
    postId,
    hasDelete = true,
    hasFooter = true,
    loop,
    isAuthorOfPost,
  } = props;
  const {
    state: { [`post-${postId}`]: post, listPost },
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
  const [isOpenPopover, setIsOpenPopover] = useState(false);

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

    setState({
      [`post-${postId}`]: { ...post, likerIds: updatedLikerIds },
    });

    listPostSubs.state.listPost = updatedList;

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
        const { id, label, critical, onclick } = item;
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

          <div className="icon-more-detail">
            <PopoverCustom
              placement="bottomRight"
              content={wrapMenuDetailPost}
              trigger="click"
            >
              <IconDash />
            </PopoverCustom>
          </div>
        </Flex>
      </div>

      {/* {isAuthorOfPost && hasDelete && (
          <Flex gap={12}>
            <EditOutlined
              onClick={() => {
                openModalWithOutRender("MODAL_NEW_POST");

                detailPostSubs.state = {
                  ...detailPostSubs.state,
                  postHasUpdate: post,
                };
              }}
              className="icon-delete"
            />
            <DeleteOutlined
              onClick={() => {
                openModalWithOutRender("CONFIRM_DELETE_POST");

                listPostSubs.state = {
                  ...listPostSubs.state,
                  postIdDelete: postId,
                };
              }}
              className="icon-delete"
            />
          </Flex>
        )} */}

      <Flex gap={24}>
        <div className="line-left-post" />

        <Flex gap={8} vertical>
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
        </Flex>
      </Flex>

      <div>
        <Flex gap={8}>
          {likerIds.length > 0 && (
            <Flex
              gap={4}
              className="pb-1 cursor-pointer button-list-liker-post none-copy"
              align="center"
              justify="center"
            >
              <LikeOutlined style={{ height: "20px" }} />
              <a className="text-disabled">{likerIds.length}</a>
            </Flex>
          )}

          {countComment > 0 && (
            <Flex
              gap={4}
              className="pb-1 cursor-pointer button-list-liker-post none-copy"
              align="center"
              justify="center"
            >
              <CommentOutlined style={{ height: "20px" }} />
              <a className="text-disabled">{countComment}</a>
            </Flex>
          )}
        </Flex>

        {/* {hasFooter && (
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
        )} */}
      </div>

      {!loop && openComment && (
        <ModalCommentPost
          post={post}
          {...props}
          openComment={openComment}
          setOpenComment={setOpenComment}
        />
      )}
    </WrapDetailPost>
  );
};
export default DetailPost;
