import styled from "styled-components";
import { TYPE_STYLE_APP } from "./utils/constant";

export const WrapStyledApp = styled.div`
  .header-container {
    height: 70px !important;
    width: 100%;
    background-color: #181818;
    position: fixed;
    top: 0;
    z-index: 2 !important;
    box-shadow: rgba(198, 198, 198, 0.16) 0px 1px 4px;
  }

  .search-home-container {
    height: 50px;
    .search-input {
      border-radius: 7px;

      .ant-input-affix-wrapper {
        border-radius: 0;
        border-radius: 8px;
        outline: none !important;
        border: none !important;
        background-color: rgb(252 252 252 / 18%);
        height: 50px;

        input {
          background-color: transparent;
          color: #fff;
        }

        input::placeholder {
          color: #9a9a9aa3;
        }
      }

      .ant-input-group-addon {
        display: none;
      }

      .icon-search {
        font-size: 20px;
        svg {
          fill: #dcdcdc;
        }
      }

      .anticon-close-circle {
        font-size: 14px;
        svg {
          fill: #dcdcdc;
        }
      }
    }
  }

  * {
    hr {
      margin: 4px 0 4px 0;
      &.gray {
        background-color: ${(p) =>
          p?.["type-style"] === TYPE_STYLE_APP.DARK
            ? "#7777774a"
            : "#77777700"};
      }
      border-radius: 200px;
    }
  }
`;
