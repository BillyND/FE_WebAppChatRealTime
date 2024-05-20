import styled from "styled-components";

export const WrapMessageScreen = styled.div`
  height: ${(p) => (p?.["is-mobile"] ? "100dvh" : "100vh")};
  padding-top: 70px !important;
  font-weight: 400 !important;
  display: grid;
  grid-template-columns: ${(p) => (p?.["is-mobile"] ? "100%" : "350px auto")};

  .wrap-all-conversations {
    height: ${(p) =>
      p?.["is-mobile"] ? "calc(100dvh - 136px)" : "calc(100vh - 70px)"};
    width: ${(p) => (p?.["is-mobile"] ? "100vw" : undefined)};
    border-inline-end: 1.5px solid #80808033;
  }

  .wrap-detail-conversation {
    height: ${(p) => (p?.["is-mobile"] ? "100dvh" : "calc(100vh - 70px)")};
    width: ${(p) => (p?.["is-mobile"] ? "100vw" : undefined)};
    top: 0;
    position: ${(p) => (p?.["is-mobile"] ? "fixed" : "static")};
    z-index: ${(p) => (p?.["is-mobile"] ? "1000" : undefined)};
    background-color: ${(p) => (p?.["is-dark"] ? "#101010" : "#FFFFFF")};

    .drag-image {
      .drop-image-message {
        display: block;
      }
    }

    .btn-view-profile {
      border-radius: 16px;
      border: none;
      outline: none;
      padding: 6px 16px;
      font-weight: bold;
      color: ${(p) => (p?.["is-dark"] ? "#fff" : "#0000000")};
      background-color: #88888838;
    }

    .user-email {
      color: gray;
    }

    .content-conversation {
      display: flex;
      flex-direction: column-reverse;
      overflow-y: scroll;
      overflow-x: hidden;
      height: 100dvh;
    }

    .icon-back-conversation {
      padding: 6px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      transition: 0.2s;
      position: relative;

      .icon-un-read {
        left: -10px;
        top: -10px;
      }

      &:hover {
        background: #8080805c;
      }
    }
  }

  .footer-conversation {
    position: relative;

    .disable-pick-img {
      opacity: 0.5;
      cursor: no-drop;

      &::active {
        scale: 1 !important;
      }
    }

    .icon-back-first-message {
      top: -60px;
      font-size: 30px;
      position: absolute;
      border-radius: 50%;
      backdrop-filter: blur(5px);
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      left: calc(50% - 12.5px);
      padding: 2px;
      scale: 0;
      opacity: 0;

      &.show-back-first {
        opacity: 1;
        scale: 1;
      }
    }

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
      background-color: ${(p) => (p?.["is-dark"] ? "#3a3b3c" : "#adadad4f")};
      color: ${(p) => (p?.["is-dark"] ? "#fff" : "#000000")};
    }

    .button-send:hover {
      background-color: ${(p) =>
        p?.["is-dark"] ? "rgb(56, 56, 56)" : "#3838381c"};
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
    border-radius: 18px;
    max-width: 70%;
    word-break: break-word;
    overflow-wrap: break-word;
    position: relative;
    * {
      transition: 0.2s;
    }

    &.img-message {
      max-width: 250px;
      border: 0.1px solid #3b3b3b29;
    }

    &.text-message {
      background-color: ${(p) => (p?.["is-dark"] ? "#2d2d2d" : "#efefef")};
      padding: 6px 12px;
    }

    &.sender {
      color: #fff;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;

      &.start {
        border-bottom-right-radius: 18px;
      }

      &.end {
        border-top-right-radius: 18px;
      }
    }

    &.receiver {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;

      &.start {
        border-bottom-left-radius: 18px;
      }

      &.end {
        border-top-left-radius: 18px;
      }
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
    border-radius: 18px !important;

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
    color: ${(props) => (props?.["is-dark"] ? "#fff" : "black")};
    background-color: ${(props) =>
      props?.["is-dark"] ? "#2d2d2d" : "#ededed"};

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
      fill: ${(props) => (props?.["is-dark"] ? "#000000" : "#fff")};
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
      color: ${(p) => (p?.["is-dark"] ? "#DADDE1" : "gray")} !important;
    }

    .read {
      color: gray !important;
      font-weight: 400 !important;
    }

    .content-last-message,
    .time-last-message {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 160px;
      font-size: 13px;
      font-weight: 400;
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
