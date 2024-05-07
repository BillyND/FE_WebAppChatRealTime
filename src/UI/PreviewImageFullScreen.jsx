import { CloseOutlined } from "@ant-design/icons";
import { previewImageFullScreenSubs } from "@utils/globalStates/initGlobalState";
import { useSubscription } from "global-state-hook";
import React from "react";
import styled from "styled-components";

function PreviewImageFullScreen() {
  const {
    state: { imgSrc },
    setState: setImgPreview,
  } = useSubscription(previewImageFullScreenSubs, ["imgSrc"]);

  if (!imgSrc) return;

  return (
    <WrapPreviewImage
      onClick={() => {
        setImgPreview({ imgSrc: "" });
      }}
    >
      <div>
        <img
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          className="img-preview-full-screen"
          src={imgSrc}
        />
      </div>
      <CloseOutlined className="icon-close-preview-image cursor-pointer transition-02" />
    </WrapPreviewImage>
  );
}

const WrapPreviewImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000000bd;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  .img-preview-full-screen {
    max-height: 100dvh;
    max-width: 100vw;
    height: 100%;
    width: 100%;
    object-fit: contain;
    min-width: 100vw;
    padding: 40px;
  }

  .icon-close-preview-image {
    position: fixed;
    top: 16px;
    right: 16px;
    padding: 5px;
    border-radius: 50%;
    scale: 1.5;

    &:hover {
      transform: rotate(180deg);
    }

    svg {
      fill: #777777;
    }
  }

  @media only screen and (max-width: 468px) {
    .img-preview-full-screen {
      padding: 0;
    }
  }
`;

export default PreviewImageFullScreen;
