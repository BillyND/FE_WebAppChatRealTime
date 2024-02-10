import { useSubscription } from "global-state-hook";
import React from "react";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { previewImageFullScreenSubs } from "../../utils/globalStates/initGlobalState";

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
        console.log("===>here");
      }}
    >
      <div>
        <img
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
  background-color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .img-preview-full-screen {
    height: 100%;
    width: 100%;
    object-fit: contain;
    min-width: 375px;
    border: 0.1px solid #232323;
  }

  .icon-close-preview-image {
    position: fixed;
    top: 24px;
    left: 24px;
    background-color: #1e1e1e;
    padding: 12px;
    border-radius: 50%;
    scale: 1.1;

    &:hover {
      transform: rotate(180deg);
      scale: 1.2;
    }

    svg {
      fill: #777777;
    }
  }
`;

export default PreviewImageFullScreen;
