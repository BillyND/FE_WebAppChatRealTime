import { PlusCircleOutlined } from "@ant-design/icons";
import React from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useModal } from "../../hooks/useModal";
import ModalNewPost from "./ModalNewPost";
import "./NewPost.scss";

function NewPost(props) {
  const {
    infoUser: { avaUrl, username },
  } = useAuthUser();
  const { openModal } = useModal();

  const handleOpeModalNewPost = (type) => {
    openModal("MODAL_NEW_POST", type);
  };

  const placeHolderInputPost = `Hey ${username}, what are you thinking?`;

  return (
    <>
      <div className="new-post-container mt-4 none-copy">
        <div className="input-post">
          <div
            className="avatar-user"
            style={{ backgroundImage: `url(${avaUrl})` }}
          ></div>
          <div className="button-input" onClick={() => handleOpeModalNewPost()}>
            {placeHolderInputPost}
          </div>
        </div>

        <hr />

        <div className="option-post">
          <div
            className="option option-image-post"
            onClick={() => handleOpeModalNewPost()}
          >
            <PlusCircleOutlined />
            <span>New post</span>
          </div>
        </div>
      </div>
      <ModalNewPost placeHolderInputPost={placeHolderInputPost} />
    </>
  );
}

export default NewPost;
