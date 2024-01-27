import styled from "styled-components";

export const WrapModalNewPost = styled.div`
  .modal-create-post {
    color: #fff !important;
    position: relative;
    background-color: #242526;
    // max-height: 95vh;
    min-height: 500px;
    overflow-y: scroll;

    .ant-modal-content {
      max-height: calc(100vh - 32px);
    }

    .loading-create-post {
      z-index: 10;
      background-color: #242526;
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      font-size: 40px;
      opacity: 0.5;
      border-radius: 16px;
    }

    .btn-create-post {
      height: 36px;
      border-radius: 20px;
      outline: none;
      background-color: #505151;
      cursor: no-drop;
      border: none;
      outline: none;
      color: #858686;

      &.enable {
        cursor: pointer;
        color: #ffffff !important;
        background-color: #1677ff;
      }
    }

    .input-content-post {
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      resize: none;
      color: #fff !important;
      height: 200px;
      font-size: 16px;

      &::placeholder {
        color: rgb(141, 141, 141);
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
      color: #fff;

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

    .image-preview {
      min-height: 150px;
      display: flex;
      justify-content: center;
      background-color: #333436;
      border-radius: 8px;
      margin: auto;
      padding: 16px;
      position: relative;
      align-items: center;
      position: relative;
      img {
        min-height: 200px;
        max-width: 200px;
        max-height: 200px;
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
  }
`;