import { Flex } from "antd";
import React from "react";
import { UserThumbnail } from "../../UI/UserThumbnail";
import { useAuthUser } from "../../utils/hooks/useAuthUser";
import { openModalWithOutRender } from "../../utils/hooks/useModal";
import { WrapCreateNewPost } from "./StyledPost";
import { useStyleApp } from "../../utils/hooks/useStyleApp";

export const placeHolderInputPost = `What are you thinking?`;

function NewPost(props) {
  const {
    infoUser: { avaUrl },
  } = useAuthUser();
  const {
    styleApp: { backgroundColor },
  } = useStyleApp();

  const handleOpeModalNewPost = (type) => {
    openModalWithOutRender("MODAL_NEW_POST", type);
  };

  return (
    <WrapCreateNewPost
      className="none-copy pb-3"
      backgroundColor={backgroundColor}
    >
      <Flex align="center" gap={16}>
        <UserThumbnail avaUrl={avaUrl} />
        <span
          className="placeholder-create-post"
          onClick={() => handleOpeModalNewPost()}
        >
          {placeHolderInputPost}
        </span>

        <div className="button-post cursor-no-drop">
          <span>Post</span>
        </div>
      </Flex>
    </WrapCreateNewPost>
  );
}

export default NewPost;
