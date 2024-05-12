import { previewImageFullScreenSubs } from "@utils/globalStates/initGlobalState";
import { Image } from "antd";
import { useSubscription } from "global-state-hook";
import React from "react";

function PreviewImageFullScreen() {
  const {
    state: { imgSrc },
    setState: setImgPreview,
  } = useSubscription(previewImageFullScreenSubs, ["imgSrc"]);

  if (!imgSrc) return;

  return (
    <Image
      style={{
        display: "none",
      }}
      src={imgSrc}
      preview={{
        visible: imgSrc,
        src: imgSrc,
        onVisibleChange: () => {
          setImgPreview({ imgSrc: "" });
        },
      }}
    />
  );
}

export default PreviewImageFullScreen;
