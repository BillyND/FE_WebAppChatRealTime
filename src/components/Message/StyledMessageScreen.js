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

  .item-preview-conversation {
    width: 100%;
    border-radius: 12px;
    cursor: pointer;

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
