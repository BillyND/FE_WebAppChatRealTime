import React from "react";
import styled from "styled-components";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { TYPE_STYLE_APP } from "../utils/constant";

function SeparatingLine({ height, className }) {
  const {
    styleApp,
    styleApp: { type: typeStyle },
  } = useStyleApp();

  return (
    <StyledSeparatingLine
      className={className}
      isDark={typeStyle === TYPE_STYLE_APP.DARK}
      height={height}
    ></StyledSeparatingLine>
  );
}

const StyledSeparatingLine = styled.div`
  width: 100%;
  height: ${(p) => (p.height ? `${p.height}px` : "1px")};
  border-radius: 200px;
  background-color: ${(p) => (p.isDark ? "#424242" : "#cbcbcb")};
`;

export default SeparatingLine;
