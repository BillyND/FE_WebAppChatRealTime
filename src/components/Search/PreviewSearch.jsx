import { SpinnerLoading } from "@UI//SpinnerLoading";
import { RightOutlined } from "@ant-design/icons";
import { IconSearchDeActive, WrapIconAntdDeActive } from "@assets/icons/icon";
import { searchUserByName } from "@services/api";
import { TYPE_STYLE_APP } from "@utils/constant";
import { searchInputSubs } from "@utils/globalStates/initGlobalState";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { showPopupError } from "@utils/utilities";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React, { Fragment, useEffect } from "react";
import ItemPreviewUser from "./ItemPreviewUser";

function PreviewSearch(props) {
  const { focusInput, setLoadingSearch, loadingSearch, inputSearch } = props;
  const {
    styleApp,
    styleApp: { type, inputSearch: inputSearchStyle },
  } = useStyleApp();
  const {
    state: { keySearchUser, resultsPreview },
    setState: setDataSearchUser,
  } = useSubscription(searchInputSubs, ["keySearchUser", "resultsPreview"]);
  const { isMobile } = useWindowSize();
  const { infoUser } = useAuthUser();

  const borderStyle = `1px solid ${
    type === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"
  }`;

  const handleSearchUser = async () => {
    try {
      if (!keySearchUser) return;

      const resSearch = await searchUserByName({ username: keySearchUser });

      setDataSearchUser({
        resultsPreview: resSearch.filter((item) => item?._id !== infoUser._id),
      });
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

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="wrap-preview-search transition-02 enable-scroll  none-copy"
      style={{
        ...(isMobile ? styleApp : inputSearchStyle),
        height:
          inputSearch.trim() && focusInput
            ? !resultsPreview?.length
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
          {resultsPreview.map((user) => {
            return (
              <Fragment key={user?._id}>
                <ItemPreviewUser user={user} />
              </Fragment>
            );
          })}
        </Flex>
      </Flex>
    </div>
  );
}

export default PreviewSearch;
