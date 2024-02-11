import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useSubscription } from "global-state-hook";
import React from "react";
import { TYPE_STYLE_APP } from "@utils/constant";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { IconSearchDeActive, WrapIconAntdDeActive } from "@assets/icons/icon";
import { RightOutlined } from "@ant-design/icons";
import { searchUserByName } from "@services/api";
import { useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import { UserThumbnail } from "@UI//UserThumbnail";
import { cloneDeep, debounce } from "lodash";
import { message } from "antd";
import { SpinnerLoading } from "@UI//SpinnerLoading";
import { showPopupError } from "@utils/utilities";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useCallback } from "react";
import { followersUser } from "../../services/api";
import { TIME_DELAY_FETCH_API } from "../../utils/constant";

function PreviewSearch({ focusInput }) {
  const {
    styleApp,
    styleApp: { type, inputSearch: inputSearchStyle },
  } = useStyleApp();
  const {
    state: { keySearchUser },
  } = useSubscription(searchInputSubs, ["keySearchUser"]);
  const { isMobile } = useWindowSize();
  const [dataPreview, setDataPreview] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const {
    infoUser,
    infoUser: { followers, _id: currentUserId },
    login,
  } = useAuthUser();
  const [localFollowers, setLocalFollowers] = useState(followers || []);

  const borderStyle = `1px solid ${
    type === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"
  }`;

  useEffect(() => {
    handleSearchUser();
  }, [keySearchUser]);

  const handleSearchUser = async () => {
    try {
      setDataPreview([]);
      setLoadingSearch(true);
      const resSearch = keySearchUser
        ? await searchUserByName({ username: keySearchUser })
        : [];

      setDataPreview(resSearch.filter((item) => item?._id !== currentUserId));
    } catch (error) {
      showPopupError(error);
      console.error("===>Error handleSearchUser:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      let cloneFollowers = cloneDeep(localFollowers);

      if (cloneFollowers.includes(userId)) {
        cloneFollowers = cloneFollowers.filter((item) => item !== userId);
        message.success("Unfollowed");
      } else {
        cloneFollowers.push(userId);
        message.success("Followed");
      }

      setLocalFollowers(cloneFollowers);

      updateInfoUser(cloneFollowers);

      await followersUser({
        userId,
      });
    } catch (error) {
      showPopupError(error);
    }
  };

  const updateInfoUser = useCallback(
    debounce((followers) => {
      login({
        infoUser: {
          ...infoUser,
          followers,
        },
      });
    }, TIME_DELAY_FETCH_API),
    []
  );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="wrap-preview-search transition-02 enable-scroll  none-copy"
      style={{
        ...(isMobile ? styleApp : inputSearchStyle),
        height: keySearchUser && true ? `calc(100vh - 200px)` : "0px",
        // height: keySearchUser && focusInput ? `calc(100vh - 200px)` : "0px",
        ...(keySearchUser &&
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
            >{`Search "${keySearchUser}"`}</span>
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
              <Fragment key={userId}>
                <hr className="gray" />

                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={12}>
                    <UserThumbnail avaUrl={avaUrl} />
                    <span> {username}</span>
                  </Flex>

                  <Flex
                    onClick={() => handleFollow(userId)}
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
              </Fragment>
            );
          })}
        </Flex>
      </Flex>
    </div>
  );
}

export default PreviewSearch;
