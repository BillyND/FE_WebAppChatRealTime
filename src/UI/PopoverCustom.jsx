import { Popover } from "antd";
import React from "react";
import { useStyleApp } from "../utils/hooks/useStyleApp";

function PopoverCustom(props) {
  const { children, style } = props;
  const { styleApp } = useStyleApp();
  return (
    <Popover
      style={{
        ...styleApp,
        style,
      }}
      {...props}
    >
      {children}
    </Popover>
  );
}

export default PopoverCustom;
