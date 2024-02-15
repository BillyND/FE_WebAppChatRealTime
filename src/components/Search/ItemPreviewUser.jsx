import { UserThumbnail } from "@UI//UserThumbnail";
import { followersUser } from "@services/api";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "@utils/constant";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { showPopupError } from "@utils/utilities";
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import { debounce } from "lodash";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

function ItemPreviewUser(props) {
  const { user } = props;
  const { _id: userId, username, avaUrl, followings, email } = user;
  const {
    infoUser,
    infoUser: { _id: currentUserId, followers },
    login,
  } = useAuthUser();
  const {
    styleApp: { type },
  } = useStyleApp();
  const {
    state: { resultsPreview, results },
    setState: setDataSearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser", "resultsPreview"]);
  const navigate = useNavigate();
  const isFollowed = followers.includes(userId);

  const borderStyle = `1px solid ${
    type === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"
  }`;

  /**
   * Function to handle follow/unfollow action for a user.
   * @param {string} userId - The ID of the user to follow/unfollow.
   */
  const handleFollow = async (userId) => {
    try {
      // Update followers list based on whether the user is already followed or not
      const updatedFollowers = followers.includes(userId)
        ? followers.filter((item) => item !== userId)
        : [...followers, userId];

      // Find the target user in search results or preview results
      const targetUser = [...results, ...resultsPreview].find(
        (item) => item._id === userId
      );

      // Update the followings list of the target user
      targetUser.followings = targetUser.followings.includes(currentUserId)
        ? targetUser.followings.filter((item) => item !== currentUserId)
        : [...targetUser.followings, currentUserId];

      // Update the search results with the modified target user
      const updatedResults = results.map((user) =>
        user._id === targetUser._id ? targetUser : user
      );

      // Update the preview results with the modified target user
      const updatedResultsPreview = resultsPreview.map((user) =>
        user._id === targetUser._id ? targetUser : user
      );

      // Update the data for search user with updated results
      setDataSearchUser({
        results: updatedResults,
        resultsPreview: updatedResultsPreview,
      });

      // Update user info with updated followers list
      login({ infoUser: { ...infoUser, followers: updatedFollowers } });

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

  return (
    <Flex vertical gap={12} key={userId} className="cursor-pointer none-copy">
      <hr className="gray ml-5" />
      <Flex vertical>
        <Flex
          justify="space-between"
          align="center"
          onClick={() => navigate(`/user?email=${email}`)}
        >
          <Flex align="center" gap={12}>
            <UserThumbnail avaUrl={avaUrl} />

            <Flex vertical gap={8}>
              <span className="user-namer"> {username}</span>
              <span style={{ fontSize: "13px" }}> {email}</span>
              {followings && (
                <span className="count-follower">
                  {` ${followings?.length} follower${
                    followings?.length > 1 ? "s" : ""
                  }`}
                </span>
              )}
            </Flex>
          </Flex>

          <Flex
            onClick={(e) => {
              e.stopPropagation();
              handleFollow(userId);
            }}
            style={{
              border: borderStyle,
              color: isFollowed ? "#797979a6" : undefined,
            }}
            align="center"
            justify="center"
            className="button-follow cursor-pointer press-active"
          >
            {isFollowed ? "Following" : "Follow"}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ItemPreviewUser;
