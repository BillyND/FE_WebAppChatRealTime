import { SpinnerLoading } from "@UI//SpinnerLoading";
import { UserThumbnail } from "@UI//UserThumbnail";
import { RightOutlined } from "@ant-design/icons";
import { IconSearchDeActive, WrapIconAntdDeActive } from "@assets/icons/icon";
import { searchUserByName } from "@services/api";
import { TYPE_STYLE_APP } from "@utils/constant";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { showPopupError } from "@utils/utilities";
import { Flex, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect, useState } from "react";
import { followersUser } from "../../services/api";

function PreviewSearch(props) {
  const {
    focusInput,
    setDataPreview,
    setLoadingSearch,
    dataPreview,
    loadingSearch,
    inputSearch,
  } = props;
  const {
    styleApp,
    styleApp: { type, inputSearch: inputSearchStyle },
  } = useStyleApp();
  const {
    state: { keySearchUser },
  } = useSubscription(searchInputSubs, ["keySearchUser"]);
  const { isMobile } = useWindowSize();
  const { infoUser, login } = useAuthUser();
  const [localFollowers, setLocalFollowers] = useState(
    infoUser.followers || []
  );

  const borderStyle = `1px solid ${
    type === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"
  }`;

  const handleSearchUser = async () => {
    try {
      if (!keySearchUser) return;

      const resSearch = await searchUserByName({ username: keySearchUser });

      setDataPreview(resSearch.filter((item) => item?._id !== infoUser._id));
    } catch (error) {
      showPopupError(error);
      console.error("===>Error handleSearchUser:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [keySearchUser]);

  const handleFollow = async (userId) => {
    try {
      const updatedFollowers = localFollowers.includes(userId)
        ? localFollowers.filter((item) => item !== userId)
        : [...localFollowers, userId];

      setLocalFollowers(updatedFollowers);

      login({ infoUser: { ...infoUser, followers: updatedFollowers } });

      if (localFollowers.includes(userId)) {
        message.success("Unfollowed");
      } else {
        message.success("Followed");
      }

      await followersUser({ userId });
    } catch (error) {
      showPopupError(error);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="wrap-preview-search transition-02 enable-scroll  none-copy"
      style={{
        ...(isMobile ? styleApp : inputSearchStyle),
        height:
          inputSearch && focusInput
            ? !dataPreview.length
              ? "fit-content"
              : `calc(100vh - 200px)`
            : "0px",
        ...(inputSearch &&
          focusInput &&
          !isMobile && {
            borderBottom: borderStyle,
            borderLeft: borderStyle,
            borderRight: borderStyle,
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }),
      }}
    >
      <Flex
        vertical
        gap={10}
        style={{
          padding: "16px",
        }}
      >
        <Flex
          className="cursor-pointer"
          align="center"
          justify="space-between"
          gap={8}
          style={{
            maxHeight: "67px",
            boxSizing: "border-box",
          }}
        >
          <Flex align="center" gap={16}>
            <IconSearchDeActive style={{ scale: "0.7", minWidth: "26px" }} />
            <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >{`Search "${inputSearch}"`}</span>
          </Flex>
          <WrapIconAntdDeActive style={{ scale: "1.1", minWidth: "26px" }}>
            <RightOutlined />
          </WrapIconAntdDeActive>
        </Flex>
        {loadingSearch && <SpinnerLoading />}

        <Flex vertical gap={16} className="mt-2">
          {dataPreview.map((user) => {
            const { _id: userId, username, avaUrl } = user;

            const isFollowed = localFollowers.includes(userId);

            return (
              <Flex vertical gap={16} key={userId} className="cursor-pointer">
                <hr className="gray" />

                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={12}>
                    <UserThumbnail avaUrl={avaUrl} />
                    <span> {username}</span>
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
                    className=" button-follow cursor-pointer"
                  >
                    {isFollowed ? "Followed" : "Follow"}
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </div>
  );
}

export default PreviewSearch;
