import styled from "styled-components";
import { TYPE_STYLE_APP } from "@utils/constant";

export const WrapModalNewPost = styled.div`
  .loading-create-post {
    z-index: 9999999 !important;
    background-color: #2425264d;
    position: fixed;
    display: flex;
    justify-content: center;
    font-size: 40px;
    border-radius: 8px;
    overflow: hidden !important;
    width: 100%;
    height: 100%;
    inset: 0;
    padding-bottom: 100px;
  }

  .image-preview {
    margin: 12px 0 !important;
    min-height: 150px;
    display: flex;
    justify-content: center;
    background-color: ${(p) =>
      p?.["type-style"] === TYPE_STYLE_APP.DARK ? "#72727217" : "#e9e9e9"};
    border-radius: 8px;
    margin: auto;
    padding: 16px;
    position: relative;
    align-items: center;
    position: relative;
    color: gray;
    img {
      min-width: 100px;
      max-width: 200px;
      max-height: 200px;
      border: 0.5px solid #313131;
      border-radius: 8px;
    }

    .icon-clear-image {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 30px;
      cursor: pointer;
      color: rgb(183, 183, 183);

      &:hover {
        color: #fff !important;
      }
    }

    .loading-upload-image {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      background-color: #d8d8d89c;
      border-radius: 8px;
      color: black;
    }
  }

  .container-upload-image {
    display: flex;
    justify-content: flex-end;
    height: fit-content;
    align-items: center;
    font-size: 16px;
    gap: 8px;
    opacity: 0.4;
    transition: 0.2s;
    cursor: pointer;
    margin: 0 !important;
    color: black;

    &:hover {
      opacity: 1;
    }

    .upload-image {
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAAAAAA7VNdtAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAACYktHRAD/h4/MvwAAAAd0SU1FB+cLDg44FFdBgjQAAAMISURBVEjHY/hPMmAgTtnfD79J1PKxwiT5MaaWX1/RwS+43BImBoYmdC0XG3zt0ICt31aYqhYGBoaEfyhafk6SZsACNB5CVbViapnIgU0Hg+BFnFougO1gZkEBzMzsyV+Bkv/+/YM47C+IBdNSDxThLVixGhWs2vnh///3/Qnx8YlGQAUq8UBQ/xii5acPUCT/339soB3Nrcm/wVq+2gFdtRyrjj/BaFpMP4C1fLEFalmJPRJncqLoYKr6i6Hl9uKOyYe/I7T82NDa2truBlRt1NLa2rL44380LT8mKjIyMPBF3cbioyTk2Edo6WWD2O/0HFULRrzAtdyQh7m5h1gtC0Gu8tMCyrt/x9CSiFVLB1DG799KFgYG3bcoWjYAw20CVr9MBmrRWpkKJC0+oWj5MTO4/QNWLQd5gapZQH7JwojT//8/nb6LqeVrGNT34kcxI/VdDL/yesxAvuUC1iExH0s62AGMAK+fGFr+v+z30DXPPoGu/Oen188nMzMw2HzB1PL///c3H5EV/3p6Ymljsq+Ftqoo0HpbrFqQwfsjnYHq/EyIVElAy+8LzZZ8aEkfr5Zf++PEkRM9Jx83AS3nE/mhilklTCPKp67cc7qTGZ+Wz32yEPW85kVrrr3/AxZcjaFlNULHvUhmsAbVogPvEaIrMbRMvn3x4vUHr778/X/BGlLudd5HcSuGFgYRSSEhCUVtu5hKPZAGgaJ7aCGIqQUViC7BiCRCWjidZzwlqIVLREpKmA9RNjPpT32LXwtTx7WbNy+d3DGvJkiDG6rJcc8/fFoQgfz72d5ac4htwm1f8GlBif23m0J4wZVBwgtitQBz+3YXcAoOeoZVC6gYZ8Ioxt+1CoP0hL2D8pcDjbD7+h+pssj7ixET29RBeooh1fffPCDbB5aRwVUSTz56lbR6bT47UIK7cS2QvSKfB8hu+A/TckEKS8XHwszCyggSZwRzQCzpC3At/ydgr17RAAekwMRbiaMC6Uk/kbQAmwqNPnZ4gU8jrEbH1yDB0TohsqWEDOijBQBNglRFeu5uOgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0xMS0xNFQxNDo1NjoxNCswMDowMM3shAAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMTEtMTRUMTQ6NTY6MTQrMDA6MDC8sTy8AAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTExLTE0VDE0OjU2OjIwKzAwOjAwkWQ+kwAAAABJRU5ErkJggg==");
      background-repeat: no-repeat;
      background-size: contain;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      margin: 0 !important;
    }
  }

  .input-content-post {
    width: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    resize: none;
    color: #fff;
    height: 200px;
    font-size: 16px;

    &::placeholder {
      color: rgb(141, 141, 141);
    }
  }
`;

export const WrapCreateNewPost = styled.div`
  .button-post {
    padding: 6px 16px;
    border-radius: 250px;
    font-weight: 500;
    background-color: #9191912b;
    color: ${(props) => props?.["background-color"]};
  }

  .placeholder-create-post {
    width: 100%;
    cursor: text;
    color: #999999;
    height: 100%;
  }
`;

export const WrapDetailPost = styled.div`
  width: 100%;
  border-radius: 8px;
  gap: 8px;
  display: grid;
  padding: ${(p) => (p?.["is-mobile"] ? "0 12px" : "0")};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon-delete {
      cursor: pointer;
      font-size: 20px;
      color: gray;

      &:hover {
        color: #fff;
      }
    }
  }

  .image {
    .img-post {
      border: 0.5px solid #313131;
      border-radius: 8px;
      max-width: 100%;
      width: ${(p) => (p?.["is-mobile"] ? "100%" : "70%")};
    }
  }

  .btn-like-comment {
    transition: 0.2s;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    padding: 2px;
  }

  .btn-like-comment:hover {
    background-color: #9f9f9f3b;
  }

  .liked {
    color: #0068ff;
  }

  .button-list-liker-post {
    width: fit-content;
    padding-right: 8px;
  }

  .line-left-post {
    background-color: ${(p) =>
      p.type === TYPE_STYLE_APP.DARK ? "#333638" : "#e5e5e5"};

    width: 1.5px;
    height: 100%;
    margin-left: 16px;
    border-radius: 200px;
  }

  .name {
    font-weight: 600;
  }

  .time-post {
    color: #999999;
  }

  .count-reaction {
    font-size: 14px;
    color: #999999;
  }
`;

export const StyledMenuDetailPost = styled.div`
  min-width: 150px;
  display: grid;
  font-weight: 500;

  .item-menu {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 12px;
    cursor: pointer;
    border-radius: 10px;

    &.critical {
      color: red;
    }

    &:active {
      background-color: #b3b3b324;
    }
  }

  .boundary-line-item {
    background-color: #7777774a;
    margin: 0;
  }
`;

export const WrapListPost = styled.div`
  .list-post-container {
    display: grid;
    gap: 16px;
  }
`;
