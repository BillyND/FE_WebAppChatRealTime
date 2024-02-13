import React from "react";
import { useAuthUser } from "@utils/hooks/useAuthUser";
import { useWindowSize } from "@utils/hooks/useWindowSize";
import { Flex } from "antd";

function DetailUser(props) {
  const {
    infoUser,
    infoUser: { followings },
  } = useAuthUser();

  console.log("===><infoUser", infoUser);

  return (
    <Flex vertical gap={20} className={`wrap-detail-user none-copy`}>
      <Flex> {followings.length}</Flex>
      <Flex
        justify="center"
        align="center"
        className="btn-edit-profile cursor-pointer press-active transition-02"
      >
        Edit profile
      </Flex>
    </Flex>
  );
}

export default DetailUser;
