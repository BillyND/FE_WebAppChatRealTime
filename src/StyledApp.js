import styled from "styled-components";

export const WrapStyledApp = styled.div`
  * {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif !important;
  }

  .dark {
    .ant-modal-content {
      background-color: #181818 !important;
    }

    .ant-modal {
      padding: 0 !important;
      border-radius: 10px;
      border: 0.5px rgb(93, 93, 93) solid;
    }

    .anticon-close {
      svg {
        fill: rgb(231, 231, 231);
      }
    }
  }

  .light {
    .ant-modal-content,
    .ant-modal-title {
      color: black !important;
      background-color: #fff !important;
    }

    .ant-modal {
      padding: 0 !important;
      border-radius: 10px;
      border: 0.5px rgb(93, 93, 93) solid;
    }

    .anticon-close {
      svg {
        fill: black;
      }
    }
  }

  .ant-modal {
    padding: 0 !important;
    border-radius: 10px;
    border: 0.5px rgb(175, 175, 175) solid;
  }

  .ant-modal-title {
    background-color: #fff !important;
  }

  .ant-modal-close {
    background-color: #7e7e7e00 !important;
  }

  .ant-modal-content {
    max-height: calc(100vh - 40px);
    padding: 16px !important;
    color: #fff;
    border-radius: 10px !important;

    .ant-modal-close-x {
      opacity: 0.6;
      transition: 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .text-center {
    text-align: center !important;
  }

  .none-copy * {
    -webkit-user-select: none !important;
    -khtml-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    -o-user-select: none !important;
    user-select: none !important;
  }

  .remove-style-link {
    color: #dbdbdb !important;
  }

  .remove-style-link:hover {
    color: #fff !important;
  }

  .header-container {
    height: 70px !important;
    width: 100%;
    background-color: #181818;
    position: fixed;
    top: 0;
    z-index: 2 !important;
    box-shadow: rgba(198, 198, 198, 0.16) 0px 1px 4px;
  }

  .ant-modal-close-x {
    margin-top: -5px;
  }

  .ant-modal-header {
    margin-bottom: 20px !important;
  }

  .ant-modal-title {
    background-color: #181818;
    text-align: center;
    font-size: 20px;
    color: #fff !important;
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

  .transition-02 {
    transition: 0.2s !important;
  }

  .transition-03 {
    transition: 0.3s !important;
  }

  .text-disabled {
    color: #b0b3b8 !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .spinner-loading {
    scale: 3;
  }

  .icon-loading {
    // margin-top: -20px;
    width: fit-content;
    scale: 2;
    svg {
      fill: #fff !important;
    }
  }

  hr {
    margin: 4px 0 4px 0;
    &.gray {
      background-color: #7777774a;
    }
  }

  .show {
    opacity: 1;
    visibility: visible;
  }

  .hide {
    opacity: 0;
    visibility: hidden;
  }

  .enable-scroll {
    overflow-y: scroll;
  }

  .disable-scroll {
    overflow-y: hidden;
  }

  .cursor-no-drop {
    cursor: no-drop !important;

    &:hover {
      svg {
        fill: gray !important;
      }
    }
  }

  .icon-more-detail {
    cursor: pointer;
    padding: 7px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      fill: gray;
    }

    &:hover {
      background-color: rgba(128, 128, 128, 0.351);

      svg {
        fill: #fff;
      }
    }
  }

  .avatar {
    border-radius: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  }
`;
