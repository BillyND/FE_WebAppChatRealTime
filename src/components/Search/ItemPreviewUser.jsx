import { Flex } from "antd";
import React from "react";
import { UserThumbnail } from "@UI//UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { message } from "antd";
import { showPopupError } from "../../utils/utilities";
import { TIME_DELAY_FETCH_API, TYPE_STYLE_APP } from "../../utils/constant";
import { useCallback } from "react";
import { debounce } from "lodash";
import { followersUser } from "../../services/api";
import { useSubscription } from "global-state-hook";
import { searchInputSubs } from "../../utils/globalStates/initGlobalState";

function ItemPreviewUser(props) {
  const { user } = props;
  const { _id: userId, username, avaUrl, followings } = user;
  const {
    infoUser,
    infoUser: { _id: currentUserId, followers },
    login,
  } = useAuthUser();
  const {
    styleApp: { type },
  } = useStyleApp();
  const {
    state: { keySearchUser, resultsPreview, results },
    setState: setDataSearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser", "resultsPreview"]);
  const isFollowed = followers.includes(userId);

  const borderStyle = `1px solid ${
    type === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"
  }`;

  const handleFollow = async (userId) => {
    try {
      const updatedFollowers = followers.includes(userId)
        ? followers.filter((item) => item !== userId)
        : [...followers, userId];

      let targetUserFollow = null;

      targetUserFollow = results.find((item) => item._id === userId);
      targetUserFollow.followings = targetUserFollow.followings.includes(
        currentUserId
      )
        ? targetUserFollow.followings.filter((item) => item !== currentUserId)
        : [...targetUserFollow.followings, currentUserId];

      const updatedResults = results.map((user) => {
        if (user._id === targetUserFollow._id) {
          return targetUserFollow;
        }
        return user;
      });

      const updatedResultsPreview = resultsPreview.map((user) => {
        if (user._id === targetUserFollow._id) {
          return targetUserFollow;
        }
        return user;
      });

      setDataSearchUser({
        results: updatedResults,
        resultsPreview: updatedResultsPreview,
      });

      login({ infoUser: { ...infoUser, followers: updatedFollowers } });

      if (followers.includes(userId)) {
        message.success("Unfollowed");
      } else {
        message.success("Followed");
      }

      debounceUpdateFollowers(userId);
    } catch (error) {
      showPopupError(error);
      console.error("===>Error handleFollow", error);
    }
  };

  const debounceUpdateFollowers = useCallback(
    debounce((userId) => {
      followersUser({ userId });
    }, TIME_DELAY_FETCH_API),
    []
  );

  return (
    <Flex vertical gap={12} key={userId} className="cursor-pointer none-copy">
      <hr className="gray ml-5" />
      <Flex vertical>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={12}>
            <UserThumbnail avaUrl={avaUrl} />

            <Flex vertical gap={8}>
              <span className="user-namer"> {username}</span>
              {followings && (
                <span className="count-follower">
                  {` ${followings?.length} follower${
                    followings?.length > 0 ? "s" : ""
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
              color: isFollowed ? "#9E9E9E" : undefined,
            }}
            align="center"
            justify="center"
            className="button-follow cursor-pointer transition-02"
          >
            {isFollowed ? "Following" : "Follow"}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ItemPreviewUser;
