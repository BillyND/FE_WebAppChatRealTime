import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useModal } from "../../hooks/useModal";
import { useAuthUser } from "../../hooks/useAuthUser";
import { createPost } from "../../services/api";

function ModalNewPost({ placeHolderInputPost }) {
  const {
    state: { MODAL_NEW_POST },
    closeModal,
  } = useModal();
  const [valueInputPost, setValueInputPost] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loadingParseFile, setLoadingParseFile] = useState(false);
  const refInputPost = useRef(null);
  const debounceOpenModal = useDebounce(MODAL_NEW_POST, 100);
  const disableBtnCreatePost = !valueInputPost?.trim() && !selectedImage;
  const {
    infoUser: { _id: userId },
  } = useAuthUser();

  const handleUpPost = async () => {
    const dataPost = {
      userId,
      description: valueInputPost,
      imageUrl: selectedImage,
    };

    const resPost = await createPost(dataPost);
  };

  useEffect(() => {
    if (debounceOpenModal) {
      refInputPost.current.focus();
    }
  }, [debounceOpenModal]);

  const handleCancel = () => {
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

  const handleFileChange = (event) => {
    setLoadingParseFile(true);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image")) {
        const reader = new FileReader();
        reader.onload = function () {
          const img = new Image();
          img.onload = function () {
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                const resizedFile = new File([blob], selectedFile.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                if (blob.size > 500 * 1024) {
                  message.error("Please select an image smaller than 500KB");
                  setSelectedImage(null);
                } else {
                  const reader = new FileReader();
                  reader.onload = function () {
                    const dataURL = reader.result;
                    setSelectedImage(dataURL);

                    console.log(">>>dataURL:", dataURL);
                  };
                  reader.readAsDataURL(resizedFile);
                }
              },
              "image/jpeg",
              1
            );
          };
          img.src = reader.result;
          setLoadingParseFile(false);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        message.error("Please select an image!");
        setSelectedImage(null);
        setLoadingParseFile(false);
      }
    } else {
      setLoadingParseFile(false);
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
            <img width={"200px"} src={selectedImage} />
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
        {loadingParseFile && (
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
    </Modal>
  );
}

export default ModalNewPost;
