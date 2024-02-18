import BaseModal from "@UI//BaseModal";
import { UserThumbnail } from "@UI//UserThumbnail";
import { Flex } from "antd";
import { useSubscription } from "global-state-hook";
import React from "react";
import { listPostSubs } from "../../utils/globalStates/initGlobalState";
import { formatDateToMonthYear } from "../../utils/utilities";
import SeparatingLine from "../../UI/SeparatingLine";

function InfoUserModal(props) {
  const {
    state: { currentUser },
  } = useSubscription(listPostSubs, ["currentUser"]);
  const { avaUrl, username, email, showPreview, createdAt } = currentUser || {};

  const handleClosePreview = () => {
    listPostSubs.updateState({
      currentUser: {
        ...currentUser,
        showPreview: false,
      },
    });
  };

  return (
    <BaseModal
      className="modal-delete-post"
      open={showPreview}
      onCancel={handleClosePreview}
      onOk={() => {}}
      hiddenClose={true}
      footer={<></>}
      width={400}
    >
      <Flex vertical className="pt-4 pb-4 px-2" gap={8}>
        <Flex justify="space-between" gap={16}>
          <Flex vertical gap={8} style={{ width: "100%" }}>
            <Flex vertical>
              <b>Name</b>
              <span>{username}</span>
            </Flex>

            <SeparatingLine height={1} />
            <Flex vertical>
              <b>Email</b>
              <span>{email}</span>
            </Flex>

            <SeparatingLine height={1} />
          </Flex>

          <UserThumbnail avaUrl={avaUrl} size={55} />
        </Flex>

        <Flex justify="space-between" gap={16}>
          <Flex vertical>
            <b>Time to join</b>
            <span>{formatDateToMonthYear(createdAt)}</span>
          </Flex>
        </Flex>
      </Flex>
    </BaseModal>
  );
}

export default InfoUserModal;
