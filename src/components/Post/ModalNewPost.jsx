import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { createPost, updatePost } from "@services/api";
import { TIME_DELAY_SEARCH_INPUT } from "@utils/constant";
import { detailPostSubs } from "@utils/globalStates/initGlobalState";
import { readFileAsDataURL, resizeImage } from "@utils/handleImages";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useDebounce } from "@utils/hooks/useDebounce";
import { useModal } from "@utils/hooks/useModal";
import { useStyleApp } from "@utils/hooks/useStyleApp";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import {
  isChanged,
  handleGetListPost,
  showPopupError,
  updateCurrentPost,
} from "@utils/utilities";
import { Flex, Modal, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { WrapModalNewPost } from "./StyledPost";

function ModalNewPost({ placeHolderInputPost }) {
  const { isMobile } = useWindowSize();
  const {
    state: { MODAL_NEW_POST },
    closeModal,
  } = useModal(["MODAL_NEW_POST"]);
  const {
    infoUser: { _id: userId, email },
  } = useAuthUser();
  const {
    state: { postHasUpdate = {} },
  } = useSubscription(detailPostSubs, ["postHasUpdate"]);
  const { styleApp } = useStyleApp();
  const { type } = styleApp || {};
  const { _id: postId, imageUrl = "", description = "" } = postHasUpdate;
  const [valueInputPost, setValueInputPost] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loadings, setLoadings] = useState({
    parseFile: false,
    createPost: false,
  });
  const refInputPost = useRef(null);
  const debounceOpenModal = useDebounce(MODAL_NEW_POST, 100);
  const disableBtnCreatePost =
    (!valueInputPost?.trim() && !selectedImage) ||
    loadings.createPost ||
    (!isChanged([imageUrl, selectedImage]) &&
      !isChanged([description.trim(), valueInputPost.trim()]));
  const refInputImage = useRef(null);

  const debounceDataUpdate = useDebounce(
    JSON.stringify(postHasUpdate),
    TIME_DELAY_SEARCH_INPUT
  );

  useEffect(() => {
    postId && handleApplyDataUpdate();
  }, [debounceDataUpdate]);

  useEffect(() => {
    if (debounceOpenModal) {
      refInputPost.current.focus();
    }
  }, [debounceOpenModal]);

  const handleApplyDataUpdate = () => {
    const { imageUrl = "", description = "" } = postHasUpdate;
    setSelectedImage(imageUrl);
    setValueInputPost(description);
  };

  const handleUpPost = async () => {
    setLoadings({ ...loadings, createPost: true });

    try {
      const dataPost = {
        userId,
        description: valueInputPost?.trim(),
        imageUrl: selectedImage,
      };

      const [resPost] = await Promise.all([
        await createPost(dataPost),
        handleGetListPost({
          page: 1,
          limit: 5,
          email: listPostSubs.state.emailParamState,
        }),
      ]);

      const isSuccess = resPost?.EC === 0;

      isSuccess
        ? (handleCancel(), message.success(resPost?.message))
        : message.error(resPost?.message);
    } catch (error) {
      showPopupError();
    } finally {
      setLoadings({ parseFile: false, createPost: false });
      handleClearAllDataPost();
    }
  };

  const handleEditPost = async () => {
    setLoadings({ ...loadings, createPost: true });

    try {
      const dataPost = {
        userId,
        description: valueInputPost?.trim(),
        imageUrl: selectedImage,
        postId,
      };

      const resPost = await updatePost(dataPost);

      const isSuccess = resPost?.EC === 0;

      if (isSuccess) {
        handleCancel();

        updateCurrentPost(
          {
            ...postHasUpdate,
            ...dataPost,
          },
          false,
          { postHasUpdate: {} }
        );

        message.success(resPost?.message);
      } else {
        message.error(resPost?.message);
      }
    } catch (error) {
      showPopupError();
    } finally {
      setLoadings({ parseFile: false, createPost: false });
      handleClearAllDataPost();
    }
  };

  const handleCancel = () => {
    if (loadings.createPost) return;

    handleClearAllDataPost();
    closeModal("MODAL_NEW_POST");

    detailPostSubs.state.postHasUpdate = {};
  };

  const handleClearImage = () => {
    setSelectedImage(null);

    if (refInputImage.current) {
      refInputImage.current.value = null;
    }
  };

  const handleClearAllDataPost = () => {
    setValueInputPost("");
    handleClearImage();
  };

  const handleFileChange = async (event) => {
    setLoadings({ ...loadings, parseFile: true });
    const selectedFile = event.target.files[0];

    console.log("===>selectedFile:", selectedFile);

    if (!selectedFile) {
      setLoadings({ ...loadings, parseFile: false });
      return;
    }

    if (!selectedFile.type.startsWith("image")) {
      message.error("Please select an image!");
      setSelectedImage(null);
      setLoadings({ ...loadings, parseFile: false });
      return;
    }

    try {
      const resizedFile = await resizeImage(selectedFile);

      if (resizedFile.size > 5 * 1024 * 1024) {
        message.error("Please select an image smaller than 5MB");
        setSelectedImage(null);
        setLoadings({ parseFile: false, createPost: false });
        return;
      }

      const dataURL = await readFileAsDataURL(resizedFile);

      setSelectedImage(dataURL);
    } catch (error) {
      console.error(error);
      message.error("Image is incorrect, please choose another image!");
    } finally {
      setLoadings({ parseFile: false, createPost: false });
    }
  };

  return (
    <Modal
      zIndex={2000}
      style={{ top: isMobile ? 16 : 40 }}
      width={isMobile ? 1000 : 500}
      className={`modal-create-post ${type} none-copy`}
      title={<span className="">{postId ? "Update" : "Create"} post</span>}
      open={MODAL_NEW_POST}
      onCancel={handleCancel}
      footer={
        <Flex justify="end">
          <span
            className={`btn-create-post px-3 ${
              !disableBtnCreatePost ? "enable press-active" : " "
            }`}
            onClick={
              !disableBtnCreatePost
                ? postId
                  ? handleEditPost
                  : handleUpPost
                : undefined
            }
          >
            {postId ? "Update" : "Post"}
          </span>
        </Flex>
      }
    >
      <WrapModalNewPost type-style={type}>
        {loadings.createPost && (
          <div className="loading-create-post">
            <LoadingOutlined />
          </div>
        )}
        <textarea
          maxLength={8000}
          ref={refInputPost}
          value={valueInputPost}
          onChange={(e) => setValueInputPost(e.target.value)}
          className="input-content-post pt-3"
          placeholder={placeHolderInputPost}
        />

        <div className="image-preview">
          {selectedImage ? (
            <>
              <img src={selectedImage} loading="lazy" />
              <CloseCircleOutlined
                className="icon-clear-image"
                onClick={handleClearImage}
              />
            </>
          ) : (
            <label htmlFor="fileInputPost" className="container-upload-image">
              <div className="upload-image"></div>
              <span>Add image</span>
            </label>
          )}
          {loadings.parseFile && (
            <div className="loading-upload-image">
              <LoadingOutlined />
            </div>
          )}
        </div>

        <input
          ref={refInputImage}
          type="file"
          accept="image/*"
          id="fileInputPost"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </WrapModalNewPost>
    </Modal>
  );
}

export default ModalNewPost;
