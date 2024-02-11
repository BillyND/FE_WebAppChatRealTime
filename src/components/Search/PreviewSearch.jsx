import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useSubscription } from "global-state-hook";
import React from "react";
import { TYPE_STYLE_APP } from "../../utils/constant";
import { searchInputSubs } from "../../utils/globalStates/initGlobalState";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";
import { IconSearchDeActive, WrapIconAntdDeActive } from "@assets/icons/icon";
import { RightOutlined } from "@ant-design/icons";

function PreviewSearch(props) {
  const {
    styleApp,
    styleApp: { type, inputSearch: inputSearchStyle },
  } = useStyleApp();
  const {
    state: { keySearchUser },
  } = useSubscription(searchInputSubs, ["keySearchUser"]);
  const { isMobile } = useWindowSize();

  const borderStyle = `1px solid ${
    type === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"
  }`;

  return (
    <div
      className="wrap-preview-search transition-02 enable-scroll"
      style={{
        ...(isMobile ? styleApp : inputSearchStyle),
        height: keySearchUser ? `calc(100vh - 200px)` : "0px",
        ...(keySearchUser &&
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
        className="cursor-pointer"
        gap={10}
        style={{
          padding: "16px",
        }}
      >
        <Flex
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
        <hr className="gray" />
      </Flex>
    </div>
  );
}

export default PreviewSearch;
