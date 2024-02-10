import styled from "styled-components";
import { TYPE_STYLE_APP } from "../../utils/constant";

export const WrapSearchScreen = styled.div`
  padding: 0 16px;
  height: 100vh;
  padding-top: 80px !important;
  font-weight: 400 !important;

  .label-search {
    padding: 12px 16px !important;
    width: 100%;
    width: 100%;
    max-width: 550px;
    border: 0.5px solid
      ${(p) => (p.typeStyle === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9")};
    display: flex;
    align-items: center;
    border-radius: 16px;

    .prefix-input-search {
      padding: ${(p) => (p.isMobile ? "0" : "8px")};
    }

    .suffix-input-search {
      padding: 2px !important;
      background-color: #b8b8b8;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        fill: ${(p) =>
          p.typeStyle === TYPE_STYLE_APP.DARK ? "#000000" : "#fff"};
      }
    }

    .input-search {
      width: 100%;
      height: ${(p) => (p.isMobile ? "20px" : "36px")};
      border: none;
      outline: none;
    }
  }
`;
