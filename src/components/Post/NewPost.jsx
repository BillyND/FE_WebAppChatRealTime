import { PlusCircleOutlined } from "@ant-design/icons";
import React from "react";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { openModalWithOutRender } from "../../utils/hooks/useModal";
import "./Post.scss";

export const placeHolderInputPost = `What are you thinking?`;

function NewPost(props) {
  const {
    infoUser: { avaUrl },
  } = useAuthUser();

  const handleOpeModalNewPost = (type) => {
    openModalWithOutRender("MODAL_NEW_POST", type);
  };

  return (
    <>
      <div className="new-post-container none-copy">
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
    </>
  );
}

export default NewPost;
