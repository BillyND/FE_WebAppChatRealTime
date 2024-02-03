import styled from "styled-components";

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

  .icon-loading {
    // margin-top: -20px;
    width: fit-content;
    scale: 2;
    svg {
      fill: #fff !important;
    }
  }

  .icon-more-detail {
    cursor: pointer;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;

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
