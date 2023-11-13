import React from "react";
import "./NewPost.scss";
import { useAuthUser } from "../../hooks/useAuthUser";
import ModalNewPost from "./ModalNewPost";
import { useModal } from "../../hooks/useModal";
import {
  KEW_NEW_FEELING,
  KEW_NEW_IMAGE,
  KEW_NEW_POST,
} from "../../utils/constant";

function NewPost(props) {
  const {
    infoUser: { avaUrl, username },
  } = useAuthUser();
  const { openModal } = useModal();

  const handleOpeModalNewPost = (type) => {
    openModal("MODAL_NEW_POST", type);
  };

  return (
    <>
      <div className="new-post-container mt-4 none-copy">
        <div className="input-post">
          <div
            className="avatar-user"
            style={{ backgroundImage: `url(${avaUrl})` }}
          ></div>
          <div
            className="button-input"
            onClick={() => handleOpeModalNewPost(KEW_NEW_POST)}
          >
            Hey <b className="ml-1">{username}</b>, what are you thinking?
          </div>
        </div>

        <hr />

        <div className="option-post">
          <div
            className="option option-image-post"
            onClick={() => handleOpeModalNewPost(KEW_NEW_IMAGE)}
          >
            <div className="icon-image"></div>
            <span>Image</span>
          </div>

          <div
            className="option option-feeling-post"
            onClick={() => handleOpeModalNewPost(KEW_NEW_FEELING)}
          >
            <div className="icon-feeling"></div>
            <span>Feeling</span>
          </div>
        </div>
      </div>
      <ModalNewPost />
    </>
  );
}

export default NewPost;
