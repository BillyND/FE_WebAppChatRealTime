import styled from "styled-components";
import { TYPE_STYLE_APP } from "@utils/constant";

export const WrapSearchScreen = styled.div`
  padding: 0 16px;
  height: 100vh;
  padding-top: 80px !important;
  font-weight: 400 !important;
  max-width: 600px;
  margin: auto;

  .label-search {
    padding: 8px 12px !important;
    width: 100%;
    width: 100%;
    border: 1px solid
      ${(p) =>
        p?.["type-style"] === TYPE_STYLE_APP.DARK ? "#323233" : "#D9D9D9"};
    display: flex;
    align-items: center;
    border-radius: 16px;
    font-size: 14px;
    margin: 0;

    .prefix-input-search {
      height: fit-content;
      width: fit-content;
      padding: ${(p) => (p?.["is-mobile"] ? "0px" : "8px")};
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
          p?.["type-style"] === TYPE_STYLE_APP.DARK ? "#000000" : "#fff"};
      }
    }

    .input-search {
      width: 100%;
      height: ${(p) => (p?.["is-mobile"] ? "20px" : "36px")};
      border: none;
      outline: none;
    }
  }

  .wrap-preview-search {
    z-index: 1000 !important;
    box-shadow: ${(p) =>
      p?.["is-mobile"]
        ? "0"
        : "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px"};
    position: absolute;
    right: 0;
    left: 0;
    top: 60px;
    word-break: break-all;

    * {
      overflow-x: hidden;
    }
  }

  .button-follow {
    padding: 4px 18px;
    border-radius: 10px;
  }

  .wrap-list-all-user {
    height: ${(p) =>
      p?.["is-mobile"] ? "calc(100dvh - 200px)" : "calc(100vh - 160px)"};
    overflow-y: scroll;
  }

  .user-namer {
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;
