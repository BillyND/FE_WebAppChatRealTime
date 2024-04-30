import styled from "styled-components";

export const WrapMessageScreen = styled.div`
  height: 100vh;
  padding-top: 70px !important;
  font-weight: 400 !important;
  display: grid;
  grid-template-columns: 350px auto;

  .wrap-all-conversations {
    height: ${(p) =>
      p.isMobile ? "calc(100vh - 136px)" : "calc(100vh - 70px)"};

    border-inline-end: 1.5px solid #80808033;
  }

  .wrap-detail-conversation {
    height: ${(p) =>
      p.isMobile ? "calc(100vh - 136px)" : "calc(100vh - 70px)"};

    .btn-view-profile {
      border-radius: 16px;
      border: none;
      outline: none;
      padding: 6px 16px;
      font-weight: bold;
      color: ${(p) => (p.isDark ? "#fff" : "#0000000")};
      background-color: #88888838;
    }

    .user-email {
      color: gray;
    }

    .content-conversation {
      height: 100%;
      max-height: 100%;
      overflow-x: scroll;
    }
  }

  .footer-conversation {
    .icon-show-more-option {
      scale: 1.6;
      padding: 8px;
      cursor: pointer;
      transition: 0.2s;

      &:active {
        scale: 1.4;
      }
    }
  }

  .wrap-message {
    background-color: ${(p) => (p.isDark ? "#262626" : "#efefef")};
    padding: 6px 12px;
    border-radius: 18px;
    max-width: 70%;
    word-break: break-word;
    overflow-wrap: break-word;

    &.sender {
      background-color: #3797f0;
      color: #fff;
    }
  }

  #box-list-message {
    height: calc(100vh - 222px);
    overflow-y: scroll;
  }

  .icon-load-send-message {
    height: 20px;
    .icon-loading {
      scale: 1;
    }
  }
`;

export const WrapSearchUser = styled.div`
  position: relative;

  .search-conversation {
    height: 40px;
    border-radius: 8px;
    padding: 8px;
    padding-right: 34px;
    outline: none;
    border: none;
    color: ${(props) => (props.isDark ? "#fff" : "black")};
    background-color: ${(props) => (props.isDark ? "#2d2d2d" : "#ededed")};

    &::placeholder {
      color: gray;
    }
  }

  .suffix-input-search {
    position: absolute;
    right: 24px;
    top: 26px;
    width: 20px;
    height: 20px;
    background-color: #b8b8b8;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      fill: ${(props) => (props.isDark ? "#000000" : "#fff")};
    }
  }
`;

export const WrapListConversation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: scroll;

  .icon-un-read {
    width: 10px;
    min-height: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #0765ff;
    position: absolute;
    top: 8px;
    left: 8px;
  }

  .item-preview-conversation {
    width: 100%;
    border-radius: 12px;
    cursor: pointer;
    position: relative;

    &:hover {
      background-color: #80808014;
    }

    &.selected {
      background-color: #80808026;
    }

    .info-last-message {
      color: gray;
    }

    .content-last-message {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 160px;
      color: ${(p) => (p.isDark ? "#DADDE1" : "#464646")};
      font-size: 13px;

      &.read {
        color: gray;
      }
    }
  }

  .warning-no-conversation {
    color: gray;
  }

  .item-user {
    border-radius: 12px;

    &:hover {
      background-color: #80808026;
    }

    .user-email {
      color: gray;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 250px;
    }

    .user-name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 250px;
    }
  }
`;
