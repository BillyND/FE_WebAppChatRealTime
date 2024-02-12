import React from "react";
import { WrapUserScreen } from "./UserScreenStyled";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import DetailUser from "./DetailUser";
import { Flex } from "antd";

function UseScreen(props) {
  const { isMobile, isTablet } = useWindowSize();

  return (
    <WrapUserScreen isMobile={isMobile} isTablet={isTablet}>
      <Flex vertical>
        <DetailUser />
      </Flex>
    </WrapUserScreen>
  );
}

export default UseScreen;
