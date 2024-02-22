import { UserThumbnail } from "@UI//UserThumbnail";
import { followersUser } from "@services/api";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import {
  listPostSubs,
  previewImageFullScreenSubs,
  searchInputSubs,
} from "../../utils/globalStates/initGlobalState";
import { showPopupError } from "../../utils/utilities";
import EditProfileModal from "./EditProfileModal";
import InfoUserModal from "./InfoUserModal";

function DetailUser() {
  const { isMobile } = useWindowSize();
  const {
    styleApp: { type },
  } = useStyleApp();
  const {
    infoUser,
    login,
    infoUser: { _id: currentUserId, followers },
  } = useAuthUser();
  const {
    state: { currentUser },
  } = useSubscription(listPostSubs, ["currentUser"]);
  const {
    _id: userId,
    followings,
    avaUrl,
    username,
    email,
    about,
  } = currentUser || {};

  const isAuthor = currentUserId === userId;
  const isFollowed = followers?.includes(userId);

  /**
   * Function to handle follow/unfollow action for a user.
   */
  const handleFollow = async () => {
    try {
      // Update followers list based on whether the user is already followed or not
      const updatedFollowers = followers.includes(userId)
        ? followers.filter((item) => item !== userId)
        : [...followers, userId];

      const updatedFollowing = followings.includes(currentUserId)
        ? followings.filter((item) => item !== currentUserId)
        : [...followings, currentUserId];

      // Update user info with updated followers list
      login({ infoUser: { ...infoUser, followers: updatedFollowers } });

      listPostSubs.updateState({
        currentUser: {
          ...currentUser,
          followings: updatedFollowing,
        },
      });

      searchInputSubs.updateState({
        results: searchInputSubs.state.results.map((user) =>
          user._id === userId
            ? {
                ...user,
                followings: updatedFollowing,
              }
            : user
        ),
      });

      // Show success message based on follow/unfollow action
      message.success(followers.includes(userId) ? "Unfollowed" : "Followed");

      // Update the followers list for the user
      followersUser({ userId });
    } catch (error) {
      // Show error popup and log the error
      showPopupError(error);
      console.error("===>Error handleFollow", error);
    }
  };

  const handleShowPreviewUser = () => {
    listPostSubs.updateState({
      currentUser: {
        ...currentUser,
        showPreview: true,
      },
    });
  };

  const handleShowEditUser = () => {
    listPostSubs.updateState({
      currentUser: {
        ...currentUser,
        showEditProfile: true,
      },
    });
  };

  if (!currentUser) return;

  return (
    <Flex vertical gap={16} className={`wrap-detail-user px-3 pt-3`}>
      <Flex justify="space-between" align="center" gap={24}>
        <Flex vertical>
          <h2
            className="cursor-pointer"
            style={{ fontSize: "24px", wordBreak: "break-all" }}
            onClick={handleShowPreviewUser}
          >
            {username}
          </h2>
          <span style={{ fontSize: "14px" }}>{email}</span>
        </Flex>
        <div
          className="press-active"
          onClick={() =>
            previewImageFullScreenSubs.updateState({
              imgSrc: avaUrl,
            })
          }
        >
          <UserThumbnail avaUrl={avaUrl} size={isMobile ? 64 : 84} />
        </div>
      </Flex>
      <span style={{ fontSize: "14px" }}>{about}</span>
      <a className="count-follower none-copy transition-01">
        {` ${followings?.length} follower${followings?.length > 1 ? "s" : ""}`}
      </a>
      {isAuthor ? (
        <Flex
          onClick={handleShowEditUser}
          justify="center"
          align="center"
          className="btn-edit-profile cursor-pointer press-active none-copy"
        >
          Edit profile
        </Flex>
      ) : (
        <Flex style={{ width: "100%" }} gap={16} className="none-copy">
          <Flex
            style={{
              width: "100%",
              background:
                type === TYPE_STYLE_APP.DARK
                  ? isFollowed
                    ? ""
                    : "#fff"
                  : isFollowed
                  ? ""
                  : "#000000",

              color:
                type === TYPE_STYLE_APP.DARK
                  ? isFollowed
                    ? "#fff"
                    : "#000000"
                  : isFollowed
                  ? "#000000"
                  : "#fff",
            }}
            justify="center"
            align="center"
            className="btn-edit-profile cursor-pointer press-active"
            onClick={handleFollow}
          >
            {isFollowed ? "Following" : "Follow"}
          </Flex>

          <Flex
            style={{ width: "100%" }}
            justify="center"
            align="center"
            className="btn-edit-profile cursor-pointer press-active"
          >
            Message
          </Flex>
        </Flex>
      )}

      <InfoUserModal />
      <EditProfileModal />
    </Flex>
  );
}

export default DetailUser;
