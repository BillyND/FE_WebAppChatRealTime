import { Popover } from "antd";
import React from "react";
import { useStyleApp } from "../utils/hooks/useStyleApp";
import styled from "styled-components";

function PopoverCustom(props) {
  const { children, content } = props;
  const {
    styleApp: { popoverSettings },
  } = useStyleApp();

  return (
    <Popover
      {...props}
      content={<WrapPopover style={popoverSettings}>{content}</WrapPopover>}
    >
      {children}
    </Popover>
  );
}

const WrapPopover = styled.div`
  min-height: 10px;
  min-width: 10px;
  position: absolute;
  z-index: 100;
  top: -10px;
  right: -10px;
  background: #181818;
  border-radius: 16px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

export default PopoverCustom;
