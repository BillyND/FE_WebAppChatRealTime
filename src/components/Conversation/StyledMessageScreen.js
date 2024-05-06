import styled from "styled-components";

export const WrapMessageScreen = styled.div`
  height: ${(p) => (p.isMobile ? "100dvh" : "100vh")};
  padding-top: 70px !important;
  font-weight: 400 !important;
  display: grid;
  grid-template-columns: ${(p) => (p.isMobile ? "100%" : "350px auto")};

  .wrap-all-conversations {
    height: ${(p) =>
      p.isMobile ? "calc(100dvh - 136px)" : "calc(100vh - 70px)"};
    width: ${(p) => (p.isMobile ? "100vw" : undefined)};
    border-inline-end: 1.5px solid #80808033;
  }

  .wrap-detail-conversation {
    height: ${(p) => (p.isMobile ? "100dvh" : "calc(100vh - 70px)")};
    width: ${(p) => (p.isMobile ? "100vw" : undefined)};
    top: 0;
    position: ${(p) => (p.isMobile ? "fixed" : "static")};
    z-index: ${(p) => (p.isMobile ? "1000" : undefined)};
    background-color: ${(p) => (p.isDark ? "#101010" : "#FFFFFF")};

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
      display: flex;
      flex-direction: column-reverse;
      gap: 50px;
      overflow-y: scroll;
      overflow-x: hidden;
      height: 100dvh;

      .last-time-message {
        font-size: 12px;
        color: gray;
      }
    }

    .icon-back-conversation {
      padding: 6px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      transition: 0.2s;

      &:hover {
        background: #8080805c;
      }
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

    .input-comment {
      background-color: ${(p) => (p.isDark ? "#3a3b3c" : "#adadad4f")};
      color: ${(p) => (p.isDark ? "#fff" : "#000000")};
    }

    .button-send:hover {
      background-color: ${(p) => (p.isDark ? "rgb(56, 56, 56)" : "#3838381c")};
    }
  }

  .sender {
    .time-message {
      left: -55px !important;
    }
  }

  .time-message {
    color: #fff;
    position: absolute;
    right: -55px;
    width: 50px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 8px;
    padding: 4px;
    transition: 0.5s;
    opacity: 0;
    pointer-events: none;
    font-size: 12px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    text-align: center;
  }

  .wrap-message {
    background-color: ${(p) => (p.isDark ? "#262626" : "#efefef")};
    padding: 6px 12px;
    border-radius: 18px;
    max-width: 70%;
    word-break: break-word;
    overflow-wrap: break-word;
    position: relative;

    &.sender {
      background-color: #3797f0;
      color: #fff;
      border-bottom-right-radius: 0;
    }

    &.receiver {
      border-top-left-radius: 0;
    }

    &:hover {
      .time-message {
        opacity: 1;
      }
    }
  }

  .wrap-message-typing {
    width: fit-content;
    transition: 0.3s;

    &.not-typing {
      padding: 0;
      margin: 0 !important;
      height: 0;
      opacity: 0;
    }

    &.typing {
      height: 35px;
      opacity: 1;
    }
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
    right: 16px;
    top: 19px;
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

    .un-read {
      font-weight: 700;
    }

    .read {
      color: gray !important;
      font-weight: 400 !important;
    }

    .content-last-message {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 160px;
      color: ${(p) => (p.isDark ? "#DADDE1" : "#464646")};
      font-size: 13px;
      font-weight: 700;
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
