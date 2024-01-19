/* eslint-disable react/no-unknown-property */
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { useModal } from "../../utils/hooks/useModal";
import { createPost } from "../../services/api";
import { readFileAsDataURL, resizeImage } from "../../utils/handleImages";
import { handleGetListPost } from "../../utils/utilities";

function ModalNewPost({ placeHolderInputPost }) {
  const {
    state: { MODAL_NEW_POST },
    closeModal,
  } = useModal(["MODAL_NEW_POST"]);
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const [valueInputPost, setValueInputPost] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loadings, setLoadings] = useState({
    parseFile: false,
    createPost: false,
  });

  const refInputPost = useRef(null);
  const debounceOpenModal = useDebounce(MODAL_NEW_POST, 100);
  const disableBtnCreatePost =
    (!valueInputPost?.trim() && !selectedImage) || loadings.createPost;

  /**
   * Handles the process of creating and updating posts.
   */
  const handleUpPost = async () => {
    // Set loading state for post creation
    setLoadings({ ...loadings, createPost: true });

    try {
      // Prepare data for creating a new post
      const dataPost = {
        userId,
        description: valueInputPost?.trim(),
        imageUrl: selectedImage,
      };

      // Use Promise.all to await both post creation and list update concurrently
      const [resPost] = await Promise.all([
        await createPost(dataPost),
        handleGetListPost({ page: 1, limit: 5 }),
      ]);

      // Check if post creation was successful
      const isSuccess = resPost?.EC === 0;

      // Display success or error message based on the result
      isSuccess
        ? (handleCancel(), message.success(resPost?.message))
        : message.error(resPost?.message);
    } catch (error) {
      message.error("Server error!");
    } finally {
      // Reset loading state after completion (whether successful or not)
      setLoadings({ ...loadings, createPost: false });
    }
  };

  useEffect(() => {
    if (debounceOpenModal) {
      refInputPost.current.focus();
    }
  }, [debounceOpenModal]);

  const handleCancel = () => {
    if (loadings.createPost) return;

    handleClearAllDataPost();
    closeModal("MODAL_NEW_POST");
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
      className="modal-create-post none-copy"
      title={<span className="">Create post</span>}
      open={MODAL_NEW_POST}
      onCancel={handleCancel}
      footer={
        <Button
          disabled={disableBtnCreatePost}
          className={`btn-create-post ${!disableBtnCreatePost ? "enable" : ""}`}
          onClick={handleUpPost}
        >
          Post
        </Button>
      }
    >
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
            <img width={"200px"} src={selectedImage} loading="lazy" />
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
        onCancel={() => {}}
      />
    </Modal>
  );
}

export default ModalNewPost;
