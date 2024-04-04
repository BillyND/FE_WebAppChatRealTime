import styled from "styled-components";

export const WrapMessageScreen = styled.div`
  height: 100vh;
  padding-top: 80px !important;
  font-weight: 400 !important;
  display: grid;
  grid-template-columns: 350px auto;

  .wrap-all-conversations {
    height: calc(100vh - 80px);
    border-inline-end: 1.5px solid #80808033;
  }

  .wrap-detail-conversation {
    height: calc(100vh - 80px);
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
    right: 18px;
    top: 18px;
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
`;
