import { Popover } from "antd";
import React from "react";
import { useStyleApp } from "../utils/hooks/useStyleApp";
import styled from "styled-components";

function PopoverCustom(props) {
  const { children, style } = props;
  const { styleApp } = useStyleApp();
  return (
    <WrapPopover>
      <Popover style={{ background: "red" }} {...props}>
        {children}
      </Popover>
    </WrapPopover>
  );
}

const WrapPopover = styled.div`
  .ant-popover-inner {
    background-color: red !important;
  }
`;

export default PopoverCustom;
