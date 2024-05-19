import { InboxOutlined } from "@ant-design/icons";
import { IconImage } from "@assets/icons/icon";
import asyncWait from "@utils/asyncWait";
import { MAX_IMG_PICK, TIME_DELAY_FETCH_API } from "@utils/constant";
import { dataImageMessage } from "@utils/globalStates/initGlobalState";
import { resizeImage } from "@utils/handleImages";
import { debounce, isChanged, uploadFile } from "@utils/utilities";
import { Flex, Tooltip, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useSubscription } from "global-state-hook";
import { useEffect } from "react";

export const cacheOnSuccess = {};

export function DraggerUploadImage({ boxMessageElement }) {
  const { state: stateImageMessage } = useSubscription(dataImageMessage, [
    "fileList",
  ]);

  const { fileList } = stateImageMessage || {};
  return (
    <div
      onMouseOut={async () => {
        await asyncWait(100);
        boxMessageElement.current?.classList.remove("drag-image");
      }}
      onMouseEnter={async () => {
        await asyncWait(100);
        boxMessageElement.current?.classList.remove("drag-image");
      }}
    >
      <Dragger
        accept="image/*"
        fileList={fileList}
        multiple
        maxCount={MAX_IMG_PICK}
        method="get"
        onChange={({ fileList }) => {
          dataImageMessage.updateState({ fileList });
          boxMessageElement.current?.classList.remove("drag-image");
        }}
        className="drop-image-message"
        customRequest={async (e) => {
          const { file, onSuccess } = e || {};
          cacheOnSuccess[file.uid] = onSuccess;
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </div>
  );
}

export function ManualUploadImage({ refBtnUpImage }) {
  const { state: stateImageMessage } = useSubscription(dataImageMessage, [
    "fileList",
  ]);

  const { fileList } = stateImageMessage || {};

  useEffect(() => {
    handleUploadImage(fileList);
  }, [fileList.length]);

  /**
   * Function to handle changes in the file list
   * @param {Array} newFileList - The new list of files
   */
  const handleUploadImage = debounce(async (newFileList) => {
    // Current   of images

    // Create sets of uids from fileList and imgList for comparison
    const fileListUids = new Set(newFileList.map((file) => file.uid));
    const imgListUids = new Set(
      dataImageMessage.state.imgList.map((img) => img.uid)
    );

    // Filter the new items to be added to imgList
    const newItems = newFileList.filter((file) => !imgListUids.has(file.uid));
    // Filter the items to be removed from imgList
    const removedItems = dataImageMessage.state.imgList.filter(
      (img) => !fileListUids.has(img.uid)
    );

    // Exit the function if there are no new items or items to be removed
    if (!newItems.length && !removedItems.length) {
      return;
    }

    // Process new items: resize and upload images
    const imgExtracted = await Promise.all(
      newItems.map(async (file) => {
        const resizedFile = await resizeImage(file.originFileObj);
        const resUpload = await uploadFile(resizedFile);
        return { ...resUpload, uid: file.uid };
      })
    );

    // Create a new list of images by removing items that need to be removed and adding the new items
    const updatedImgList = dataImageMessage.state.imgList
      .filter((img) => fileListUids.has(img.uid))
      .concat(imgExtracted);

    // Update state if the image list has changed
    if (isChanged([updatedImgList, dataImageMessage.state.imgList])) {
      dataImageMessage.updateState({
        imgList: updatedImgList,
      });

      dataImageMessage.state.imgList.forEach((img) => {
        cacheOnSuccess[img.uid]("Ok");
      });
    }
  }, TIME_DELAY_FETCH_API);

  const handleChange = async ({ fileList }) => {
    dataImageMessage.updateState({ fileList });
  };

  return (
    <Upload
      maxCount={MAX_IMG_PICK}
      customRequest={(e) => {
        const { file, onSuccess } = e || {};
        cacheOnSuccess[file.uid] = onSuccess;
      }}
      className={`${fileList.length > 0 ? "has-file" : ""}`}
      multiple
      accept="image/*"
      listType="picture"
      fileList={fileList}
      onPreview={() => {}}
      onChange={handleChange}
    >
      <span className="btn-up-img-message" ref={refBtnUpImage}></span>
    </Upload>
  );
}

export function ButtonPickImage({ refBtnUpImage }) {
  const { state } = useSubscription(dataImageMessage, ["fileList"]);

  const { fileList } = state || {};
  const isDisablePickImg = fileList.length >= MAX_IMG_PICK;

  const handleOpenPickImg = () => {
    if (refBtnUpImage.current && !isDisablePickImg) {
      refBtnUpImage.current.click();
    }
  };
  return (
    <Flex className="mx-1" align="center" justify="center">
      <Tooltip
        title={isDisablePickImg ? "The photo limit has been reached." : ""}
      >
        <IconImage
          className={`press-active ${
            isDisablePickImg ? "disable-pick-img" : ""
          }`}
          onClick={handleOpenPickImg}
        />
      </Tooltip>
    </Flex>
  );
}
