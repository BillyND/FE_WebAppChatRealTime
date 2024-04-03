import { UserThumbnail } from "@UI//UserThumbnail";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { openModalWithOutRender } from "@utils/hooks/useModal";
import { Flex } from "antd";
import React from "react";
import { WrapCreateNewPost } from "./StyledPost";

export const placeHolderInputPost = `What are you thinking?`;

function NewPost() {
  const {
    infoUser: { avaUrl },
  } = useAuthUser();

  const handleOpeModalNewPost = (type) => {
    openModalWithOutRender("MODAL_NEW_POST", type);
  };

  return (
    <WrapCreateNewPost className="none-copy pt-3">
      <Flex align="center" gap={16}>
        <UserThumbnail avaUrl={avaUrl} />
        <span
          className="placeholder-create-post"
          onClick={() => handleOpeModalNewPost()}
        >
          {placeHolderInputPost}
        </span>

        <div
          onClick={() => handleOpeModalNewPost()}
          className="button-post press-active"
        >
          <span>Post</span>
        </div>
      </Flex>
    </WrapCreateNewPost>
  );
}

export default NewPost;
