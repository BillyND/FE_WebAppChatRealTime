import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import { useSubscription } from "global-state-hook";
import React, { useEffect, useRef, useState } from "react";
import { createPost, updatePost } from "../../services/api";
import { TIME_DELAY_SEARCH_INPUT } from "../../utils/constant";
import {
  detailPostSubs,
  listPostSubs,
} from "../../utils/globalStates/initGlobalState";
import { readFileAsDataURL, resizeImage } from "../../utils/handleImages";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { useModal } from "../../utils/hooks/useModal";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import {
  compareChange,
  handleGetListPost,
  showPopupError,
  mergeDataPostToListPost,
} from "../../utils/utilities";

function ModalNewPost({ placeHolderInputPost }) {
  const { isMobile } = useWindowSize();
  const {
    state: { MODAL_NEW_POST },
    closeModal,
  } = useModal(["MODAL_NEW_POST"]);
  const {
    infoUser: { _id: userId },
  } = useAuthUser();
  const {
    state,
    state: { postHasUpdate = {} },
    setState,
  } = useSubscription(detailPostSubs, ["postHasUpdate"]);
  const { listPost = [] } = listPostSubs.state || {};
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
    (!compareChange([imageUrl, selectedImage]) &&
      !compareChange([description, valueInputPost]));
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
        handleGetListPost({ page: 1, limit: 5 }),
      ]);

      const isSuccess = resPost?.EC === 0;

      isSuccess
        ? (handleCancel(), message.success(resPost?.message))
        : message.error(resPost?.message);
    } catch (error) {
      showPopupError();
    } finally {
      setLoadings({ ...loadings, createPost: false });
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
        setState({
          ...state,
          [`post-${postId}`]: {
            ...postHasUpdate,
            ...dataPost,
          },
          postHasUpdate: {},
        });

        mergeDataPostToListPost({
          ...postHasUpdate,
          ...dataPost,
        });

        message.success(resPost?.message);
      } else {
        message.error(resPost?.message);
      }
    } catch (error) {
      showPopupError();
    } finally {
      setLoadings({ ...loadings, createPost: false });
    }
  };

  const handleCancel = () => {
    if (loadings.createPost) return;

    handleClearAllDataPost();
    closeModal("MODAL_NEW_POST");

    detailPostSubs.state = {
      ...detailPostSubs.state,
      postHasUpdate: {},
    };
  };

  const handleClearImage = () => {
    setSelectedImage("");
  };

  const handleClearAllDataPost = () => {
    setValueInputPost("");
    setSelectedImage(null);
  };

  const handleFileChange = async (event) => {
    setLoadings({ ...loadings, parseFile: true });
    const selectedFile = event.target.files[0];

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

      if (resizedFile.size > 500 * 1024) {
        message.error("Please select an image smaller than 500KB");
        setSelectedImage(null);
        setLoadings({ ...loadings, parseFile: false });
        return;
      }

      const dataURL = await readFileAsDataURL(resizedFile);
      setSelectedImage(dataURL);
    } catch (error) {
      console.error(error);
      message.error("Image is incorrect, please choose another image!");
    } finally {
      setLoadings({ ...loadings, parseFile: false });
    }
  };

  return (
    <Modal
      style={{ top: isMobile ? 16 : 40 }}
      width={isMobile ? 1000 : 500}
      className="modal-create-post none-copy"
      title={<span className="">{postId ? "Update" : "Create"} post</span>}
      open={MODAL_NEW_POST}
      onCancel={handleCancel}
      footer={
        <Button
          disabled={disableBtnCreatePost}
          className={`btn-create-post ${!disableBtnCreatePost ? "enable" : ""}`}
          onClick={postId ? handleEditPost : handleUpPost}
        >
          {postId ? "Update" : "Post"}
        </Button>
      }
    >
      <div>
        {loadings.createPost && (
          <div className="loading-create-post">
            <LoadingOutlined />
          </div>
        )}
        <textarea
          ref={refInputPost}
          value={valueInputPost}
          onChange={(e) => setValueInputPost(e.target.value)}
          className="input-content-post pt-3"
          placeholder={placeHolderInputPost}
        ></textarea>

        <div className="image-preview mb-4 mt-4">
          {selectedImage ? (
            <>
              <img src={selectedImage} loading="lazy" />
              <CloseCircleOutlined
                className="icon-clear-image"
                onClick={handleClearImage}
              />
            </>
          ) : (
            <label htmlFor="fileInput" className="container-upload-image">
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
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </Modal>
  );
}

export default ModalNewPost;
